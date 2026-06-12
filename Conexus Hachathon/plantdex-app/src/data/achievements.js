import { LESSON_TASKS } from './lessonTasks'

export const ACHIEVEMENTS = [
  {
    id: 'first-photo',
    title: 'First Field Photo',
    description: 'Add your first plant photo to the collection.',
    isUnlocked: ({ plantCount }) => plantCount >= 1,
  },
  {
    id: 'task-sprout',
    title: 'Task Sprout',
    description: 'Complete one classroom plant mission.',
    isUnlocked: ({ completedCount }) => completedCount >= 1,
  },
  {
    id: 'lesson-leader',
    title: 'Lesson Leader',
    description: 'Complete three classroom missions.',
    isUnlocked: ({ completedCount }) => completedCount >= 3,
  },
  {
    id: 'plantdex-builder',
    title: 'PlantDex Builder',
    description: 'Collect five different plant species.',
    isUnlocked: ({ plantCount }) => plantCount >= 5,
  },
  {
    id: 'knowledge-bloom',
    title: 'Knowledge Bloom',
    description: 'Earn 500 points from discoveries and lessons.',
    isUnlocked: ({ points }) => points >= 500,
  },
  {
    id: 'careful-observer',
    title: 'Careful Observer',
    description: 'Finish a mission while keeping your garden healthy.',
    isUnlocked: ({ completedCount, gardenHealth }) => completedCount >= 1 && gardenHealth >= 3,
  },
  {
    id: 'on-a-roll',
    title: 'On a Roll',
    description: 'Complete missions three days in a row.',
    isUnlocked: ({ taskStreak }) => taskStreak >= 3,
  },
  {
    id: 'stylist',
    title: 'Garden Stylist',
    description: 'Buy your first profile cosmetic.',
    isUnlocked: ({ cosmeticsOwned }) => cosmeticsOwned >= 1,
  },
  {
    id: 'scholar',
    title: 'Leaving Cert Scholar',
    description: 'Pass three Study Hub tests.',
    isUnlocked: ({ studyPasses }) => studyPasses >= 3,
  },
]

export function achievementStats(state) {
  return {
    points: state.points || 0,
    plantCount: Object.keys(state.plants || {}).length,
    completedCount: Object.keys(state.completedTasks || {}).length,
    gardenHealth: typeof state.gardenHealth === 'number' ? state.gardenHealth : 3,
    taskStreak: state.taskStreak || 0,
    cosmeticsOwned: state.profile?.owned?.length || 0,
    studyPasses: Object.values(state.studyBest || {}).filter((r) => r && r.correct / r.total >= 0.8).length,
  }
}

export function getAchievements(state) {
  const stats = achievementStats(state)
  return ACHIEVEMENTS.map((achievement) => ({
    ...achievement,
    unlocked: achievement.isUnlocked(stats),
  }))
}

// ── Teacher achievements ──────────────────────────────────────────────────────
// Teachers are judged on what they build and how the class performs, not on
// personal scanning stats.
export const TEACHER_ACHIEVEMENTS = [
  {
    id: 't-first-mission',
    title: 'Mission Designer',
    description: 'Create your first custom plant mission.',
    isUnlocked: ({ customMissions }) => customMissions >= 1,
  },
  {
    id: 't-curriculum',
    title: 'Curriculum Builder',
    description: 'Grow the mission bank to five missions.',
    isUnlocked: ({ missionCount }) => missionCount >= 5,
  },
  {
    id: 't-quiz-smith',
    title: 'Quiz Smith',
    description: 'Create your first custom quiz.',
    isUnlocked: ({ customQuizzes }) => customQuizzes >= 1,
  },
  {
    id: 't-full-class',
    title: 'Full Classroom',
    description: 'Have four or more students in your class.',
    isUnlocked: ({ studentCount }) => studentCount >= 4,
  },
  {
    id: 't-momentum',
    title: 'Class Momentum',
    description: 'Your class completes three missions.',
    isUnlocked: ({ completedCount }) => completedCount >= 3,
  },
  {
    id: 't-harvest',
    title: 'Class Harvest',
    description: 'Your class collects ten different species.',
    isUnlocked: ({ plantCount }) => plantCount >= 10,
  },
]

export function teacherStats(state, quizzes = []) {
  const builtIn = new Set(LESSON_TASKS.map((task) => task.id))
  const tasks = state.lessonTasks || []
  return {
    missionCount: tasks.length,
    customMissions: tasks.filter((task) => !builtIn.has(task.id)).length,
    customQuizzes: quizzes.filter((quiz) => quiz.custom).length,
    studentCount: state.classroom?.students?.length || 0,
    completedCount: Object.keys(state.completedTasks || {}).length,
    plantCount: Object.keys(state.plants || {}).length,
  }
}

export function getTeacherAchievements(state, quizzes = []) {
  const stats = teacherStats(state, quizzes)
  return TEACHER_ACHIEVEMENTS.map((achievement) => ({
    ...achievement,
    unlocked: achievement.isUnlocked(stats),
  }))
}

export function unlockedAchievementCount(state) {
  return getAchievements(state).filter((achievement) => achievement.unlocked).length
}
