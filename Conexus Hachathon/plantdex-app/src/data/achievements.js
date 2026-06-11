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
]

export function achievementStats(state) {
  return {
    points: state.points || 0,
    plantCount: Object.keys(state.plants || {}).length,
    completedCount: Object.keys(state.completedTasks || {}).length,
    gardenHealth: typeof state.gardenHealth === 'number' ? state.gardenHealth : 3,
  }
}

export function getAchievements(state) {
  const stats = achievementStats(state)
  return ACHIEVEMENTS.map((achievement) => ({
    ...achievement,
    unlocked: achievement.isUnlocked(stats),
  }))
}

export function unlockedAchievementCount(state) {
  return getAchievements(state).filter((achievement) => achievement.unlocked).length
}
