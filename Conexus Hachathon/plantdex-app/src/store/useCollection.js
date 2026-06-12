// PlantDex game state persisted on-device via AsyncStorage.
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CLASSROOM, LESSON_TASKS } from '../data/lessonTasks'
import { DEFAULT_PROFILE } from '../data/profileShop'
import { PASS_MARK } from '../data/leavingCert'

export const MAX_GARDEN_HEALTH = 3
const POINTS_NEW = 100
const POINTS_REPEAT = 10
// First-time pass bonuses for Study Hub tests.
const STUDY_BONUS_TOPIC = 30
const STUDY_BONUS_EXAM = 60
// Daily mission streak: completing a task on consecutive days pays a rising
// bonus (+15 day one, capped at +75 from day five on).
const streakBonusOf = (streak) => 15 * Math.min(streak, 5)

export const dayKey = (t) => new Date(t).toISOString().slice(0, 10)

function makeTaskId(title) {
  const slug = String(title || 'mission').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  return `${slug || 'mission'}-${Date.now()}`
}

function mergeLessonTasks(savedTasks = []) {
  const saved = Array.isArray(savedTasks) ? savedTasks : []
  const savedById = new Map(saved.map((task) => [task.id, task]))
  const builtInsWithSavedProgress = LESSON_TASKS.map((task) => ({
    ...task,
    ...(savedById.get(task.id) || {}),
    // Always keep the newest built-in reference image/text for default missions.
    targetImage: task.targetImage,
    description: task.description,
    hint: task.hint,
    successText: task.successText,
    failText: task.failText,
  }))
  const customTasks = saved.filter((task) => !LESSON_TASKS.some((builtIn) => builtIn.id === task.id))
  return [...customTasks, ...builtInsWithSavedProgress]
}

export const useCollection = create(
  persist(
    (set, get) => ({
      currentUser: null, // { name, role:'student'|'teacher', classCode }
      classroom: CLASSROOM,
      lessonTasks: LESSON_TASKS,
      plants: {}, // { [scientificName]: { ...plant, firstFound, timesSeen } }
      points: 0,
      activeTaskId: 'sun-seeker',
      completedTasks: {},
      taskAttempts: [],
      gardenHealth: MAX_GARDEN_HEALTH,
      taskStreak: 0, // consecutive days with at least one completed mission
      lastTaskDay: '', // YYYY-MM-DD of the last streak-counted completion
      profile: { ...DEFAULT_PROFILE },
      studyBest: {}, // topicId | 'exam' -> { correct, total }

      login: (user) => set({ currentUser: user }),
      logout: () => set({ currentUser: null }),

      // ── Profile cosmetics ────────────────────────────────────────────────
      setPfp: (pfp) => set((s) => ({ profile: { ...s.profile, pfp } })),

      buyCosmetic: (item) => {
        const s = get()
        if (s.profile.owned?.includes(item.id)) return { ok: false, reason: 'owned' }
        if (s.points < item.cost) return { ok: false, reason: 'points' }
        set((st) => ({
          points: st.points - item.cost,
          profile: { ...st.profile, owned: [...(st.profile.owned || []), item.id], [item.type]: item.id },
        }))
        return { ok: true }
      },

      equipCosmetic: (item) => set((s) => ({ profile: { ...s.profile, [item.type]: item.id } })),

      // ── Study Hub results ────────────────────────────────────────────────
      // Persists best scores and pays a one-off bonus the first time a test
      // is passed (no farming: repeat passes earn nothing extra).
      recordStudyResult: (id, correct, total) => {
        const prev = get().studyBest?.[id]
        const passedNow = correct / total >= PASS_MARK
        const passedBefore = !!prev && prev.correct / prev.total >= PASS_MARK
        const bonus = passedNow && !passedBefore ? (id === 'exam' ? STUDY_BONUS_EXAM : STUDY_BONUS_TOPIC) : 0
        const best = !prev || correct / total > prev.correct / prev.total ? { correct, total } : prev
        set((s) => ({
          studyBest: { ...(s.studyBest || {}), [id]: best },
          points: s.points + bonus,
        }))
        return { bonus }
      },

      // Credit points from activities outside plant scans (e.g. finished quizzes).
      addPoints: (amount) => set((s) => ({ points: s.points + (Number(amount) || 0) })),

      setLessonInfo: (lesson) => set((s) => ({
        classroom: {
          ...(s.classroom || CLASSROOM),
          ...lesson,
        },
      })),

      addLessonTask: (task) => {
        const newTask = {
          id: task.id || makeTaskId(task.title),
          title: task.title || 'New plant mission',
          topic: task.topic || get().classroom?.topic || 'Plant science',
          description: task.description || 'Students submit plant photo evidence for this mission.',
          targetCommonNames: task.targetCommonNames || [task.targetPlant || task.title || 'plant'],
          targetScientificNames: task.targetScientificNames || [],
          targetFamilies: task.targetFamilies || [],
          points: Number(task.points) || 100,
          targetImage: task.targetImage || task.imageUrl || '',
          hint: task.hint || 'Look closely at the leaf shape, flower, stem, and surrounding habitat.',
          successText: task.successText || 'Correct evidence. The plant observation supports the lesson goal.',
          failText: task.failText || 'Incorrect evidence. The class garden loses health; observe and try again.',
        }
        set((s) => ({
          lessonTasks: [newTask, ...(s.lessonTasks || LESSON_TASKS)],
          activeTaskId: newTask.id,
        }))
        return newTask
      },

      setActiveTask: (taskId) => set({ activeTaskId: taskId }),

      deleteLessonTask: (taskId) => {
        set((s) => {
          const remaining = (s.lessonTasks || LESSON_TASKS).filter((task) => task.id !== taskId)
          const nextTasks = remaining.length ? remaining : LESSON_TASKS
          const nextCompleted = { ...(s.completedTasks || {}) }
          delete nextCompleted[taskId]
          return {
            lessonTasks: nextTasks,
            completedTasks: nextCompleted,
            taskAttempts: (s.taskAttempts || []).filter((attempt) => attempt.taskId !== taskId),
            activeTaskId: s.activeTaskId === taskId ? nextTasks[0].id : s.activeTaskId,
          }
        })
      },

      addSighting: (plant) => {
        const key = plant.scientificName || plant.commonName || `plant-${Date.now()}`
        const existing = get().plants[key]
        const isNew = !existing
        const pointsEarned = isNew ? POINTS_NEW : POINTS_REPEAT
        const entry = existing
          ? {
              ...existing,
              ...plant,
              firstFound: existing.firstFound,
              timesSeen: existing.timesSeen + 1,
              lastSeen: Date.now(),
              photoHistory: [plant.cameraPhoto || plant.image, ...(existing.photoHistory || [])].filter(Boolean).slice(0, 5),
            }
          : {
              ...plant,
              firstFound: Date.now(),
              lastSeen: Date.now(),
              timesSeen: 1,
              photoHistory: [plant.cameraPhoto || plant.image].filter(Boolean),
            }

        set((s) => ({
          plants: { ...s.plants, [key]: entry },
          points: s.points + pointsEarned,
        }))
        return { isNew, pointsEarned }
      },

      completeTask: (task, plant, photoUri) => {
        const state = get()
        const existing = state.completedTasks[task.id]
        const taskPoints = existing ? 0 : task.points
        const now = Date.now()
        const completion = existing || {
          taskId: task.id,
          title: task.title,
          completedAt: now,
          plantName: plant.commonName,
          scientificName: plant.scientificName,
          photo: photoUri || plant.cameraPhoto || plant.image || null,
          points: task.points,
        }

        // Mission streak: the first fresh completion of each day extends (or
        // restarts) the consecutive-day streak and pays its bonus once.
        const today = dayKey(now)
        let streak = state.taskStreak || 0
        let lastTaskDay = state.lastTaskDay || ''
        let streakBonus = 0
        if (!existing && lastTaskDay !== today) {
          streak = lastTaskDay === dayKey(now - 86400000) ? streak + 1 : 1
          streakBonus = streakBonusOf(streak)
          lastTaskDay = today
        }

        set((s) => ({
          completedTasks: { ...s.completedTasks, [task.id]: completion },
          taskAttempts: [
            { taskId: task.id, correct: true, at: now, plantName: plant.commonName },
            ...s.taskAttempts,
          ].slice(0, 30),
          points: s.points + taskPoints + streakBonus,
          gardenHealth: Math.min(MAX_GARDEN_HEALTH, (s.gardenHealth || MAX_GARDEN_HEALTH) + 1),
          taskStreak: streak,
          lastTaskDay,
        }))
        return { taskPoints, alreadyCompleted: !!existing, streak, streakBonus }
      },

      recordWrongTask: (task, plant, photoUri) => {
        set((s) => ({
          taskAttempts: [
            {
              taskId: task.id,
              correct: false,
              at: Date.now(),
              plantName: plant?.commonName || 'Not a plant',
              photo: photoUri || plant?.cameraPhoto || null,
            },
            ...s.taskAttempts,
          ].slice(0, 30),
          gardenHealth: Math.max(0, (s.gardenHealth ?? MAX_GARDEN_HEALTH) - 1),
        }))
      },

      reset: () => set({
        plants: {},
        points: 0,
        completedTasks: {},
        taskAttempts: [],
        gardenHealth: MAX_GARDEN_HEALTH,
        activeTaskId: 'sun-seeker',
        lessonTasks: LESSON_TASKS,
        classroom: CLASSROOM,
        taskStreak: 0,
        lastTaskDay: '',
        profile: { ...DEFAULT_PROFILE },
        studyBest: {},
      }),
    }),
    {
      name: 'plantdex-collection',
      storage: createJSONStorage(() => AsyncStorage),
      merge: (persisted, current) => ({
        ...current,
        ...(persisted || {}),
        classroom: { ...CLASSROOM, ...((persisted && persisted.classroom) || {}) },
        lessonTasks: mergeLessonTasks(persisted && persisted.lessonTasks),
        profile: { ...DEFAULT_PROFILE, ...((persisted && persisted.profile) || {}) },
        studyBest: (persisted && persisted.studyBest) || {},
      }),
    }
  )
)

export function collectionList(plants) {
  return Object.values(plants || {}).sort((a, b) => b.firstFound - a.firstFound)
}

export function activeTaskFromState(state) {
  const tasks = state.lessonTasks?.length ? state.lessonTasks : LESSON_TASKS
  return tasks.find((task) => task.id === state.activeTaskId) || tasks[0]
}
