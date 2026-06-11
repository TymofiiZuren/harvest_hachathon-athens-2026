export const CLASSROOM = {
  id: 'bio-6a',
  name: 'Biology 6A',
  code: 'LEAF-204',
  teacher: 'Ms. Green',
  topic: 'Plant adaptation and biodiversity',
  title: 'Schoolyard Plant Quest',
  description:
    'Students complete camera-based plant missions, answer quick Kahoot-style checks, and build a shared living collection from real evidence.',
  students: [
    { id: 's1', name: 'Alex', points: 420 },
    { id: 's2', name: 'Maya', points: 390 },
    { id: 's3', name: 'Nikos', points: 340 },
    { id: 's4', name: 'Sofia', points: 310 },
  ],
}

export const LESSON_TASKS = [
  {
    id: 'sun-seeker',
    title: 'Find a Sunflower',
    topic: 'Photosynthesis',
    description: 'Take a camera photo of a sunflower and learn why young flower heads track sunlight.',
    targetCommonNames: ['sunflower'],
    targetScientificNames: ['Helianthus annuus'],
    points: 150,
    hint: 'Look for a tall plant with a large yellow flower head.',
    successText: 'Correct! Sunflowers are a great example of plants responding to light.',
    failText: 'Wrong evidence: the classroom seedling wilted and lost one health leaf.',
    quiz: {
      question: 'Why do young sunflowers turn during the day?',
      choices: ['To follow light', 'To escape rain', 'To make seeds fly', 'To hide from insects'],
      answer: 'To follow light',
    },
  },
  {
    id: 'clover-fixer',
    title: 'Spot a Clover',
    topic: 'Soil nutrients',
    description: 'Photograph white clover and discover how legumes help return nitrogen to soil.',
    targetCommonNames: ['white clover', 'clover'],
    targetScientificNames: ['Trifolium repens'],
    points: 130,
    hint: 'Search low grass for groups of three small leaflets.',
    successText: 'Correct! Clover is a legume that supports nitrogen-fixing bacteria.',
    failText: 'Wrong plant: your virtual garden dried out a little. Try observing the leaves more carefully.',
    quiz: {
      question: 'What important nutrient can clover help add to soil?',
      choices: ['Nitrogen', 'Plastic', 'Salt', 'Sand'],
      answer: 'Nitrogen',
    },
  },
  {
    id: 'asteraceae-hunter',
    title: 'Find the Daisy Family',
    topic: 'Plant classification',
    description: 'Take a photo of any plant from the Asteraceae family, such as a daisy, dandelion, or sunflower.',
    targetFamilies: ['Asteraceae'],
    targetCommonNames: ['daisy', 'dandelion', 'sunflower'],
    targetScientificNames: ['Bellis perennis', 'Taraxacum officinale', 'Helianthus annuus'],
    points: 170,
    hint: 'Many Asteraceae flowers look like one flower but are made of many tiny florets.',
    successText: 'Correct! You found a member of one of the largest flowering plant families.',
    failText: 'Not the target family: your classroom streak broke. Compare the flower structure and retry.',
    quiz: {
      question: 'A daisy “flower” is actually made of many tiny...',
      choices: ['Florets', 'Pebbles', 'Roots', 'Seeds only'],
      answer: 'Florets',
    },
  },
]

export function getLessonTask(id) {
  return LESSON_TASKS.find((task) => task.id === id) || LESSON_TASKS[0]
}

function clean(value) {
  return String(value || '').toLowerCase().trim()
}

function includesAny(value, targets = []) {
  const normalized = clean(value)
  if (!normalized) return false
  return targets.some((target) => {
    const wanted = clean(target)
    return wanted && (normalized.includes(wanted) || wanted.includes(normalized))
  })
}

export function matchPlantToTask(plant, task) {
  if (!plant || !task) return false
  return (
    includesAny(plant.scientificName, task.targetScientificNames) ||
    includesAny(plant.commonName, task.targetCommonNames) ||
    includesAny(plant.family, task.targetFamilies)
  )
}
