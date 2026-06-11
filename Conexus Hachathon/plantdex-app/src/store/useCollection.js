// PlantDex game state persisted on-device via AsyncStorage.
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CLASSROOM, LESSON_TASKS } from '../data/lessonTasks'

export const DEX_GOAL = 24
export const MAX_GARDEN_HEALTH = 3
const POINTS_NEW = 100
const POINTS_REPEAT = 10

function makeTaskId(title) {
  const slug = String(title || 'mission').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  return `${slug || 'mission'}-${Date.now()}`
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

      login: (user) => set({ currentUser: user }),
      logout: () => set({ currentUser: null }),

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
          hint: task.hint || 'Look closely at the leaf shape, flower, stem, and surrounding habitat.',
          successText: task.successText || 'Correct evidence. The plant observation supports the lesson goal.',
          failText: task.failText || 'Incorrect evidence. The class garden loses health; observe and try again.',
          quiz: {
            question: task.quiz?.question || task.question || 'What feature helped you identify this plant?',
            choices: task.quiz?.choices || task.choices || ['Leaves', 'Flowers', 'Stem', 'Habitat'],
            answer: task.quiz?.answer || task.answer || 'Leaves',
          },
        }
        set((s) => ({
          lessonTasks: [newTask, ...(s.lessonTasks || LESSON_TASKS)],
          activeTaskId: newTask.id,
        }))
        return newTask
      },

      setActiveTask: (taskId) => set({ activeTaskId: taskId }),

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
        const existing = get().completedTasks[task.id]
        const taskPoints = existing ? 0 : task.points
        const completion = existing || {
          taskId: task.id,
          title: task.title,
          completedAt: Date.now(),
          plantName: plant.commonName,
          scientificName: plant.scientificName,
          photo: photoUri || plant.cameraPhoto || plant.image || null,
          points: task.points,
        }

        set((s) => ({
          completedTasks: { ...s.completedTasks, [task.id]: completion },
          taskAttempts: [
            { taskId: task.id, correct: true, at: Date.now(), plantName: plant.commonName },
            ...s.taskAttempts,
          ].slice(0, 30),
          points: s.points + taskPoints,
          gardenHealth: Math.min(MAX_GARDEN_HEALTH, (s.gardenHealth || MAX_GARDEN_HEALTH) + 1),
        }))
        return { taskPoints, alreadyCompleted: !!existing }
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
      }),
    }),
    {
      name: 'plantdex-collection',
      storage: createJSONStorage(() => AsyncStorage),
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
