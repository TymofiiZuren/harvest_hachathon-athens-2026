export const CLASSROOM = {
  id: 'bio-6a',
  name: 'Biology 6A',
  code: 'LEAF-204',
  teacher: 'Ms. Green',
  topic: 'Plant adaptation and biodiversity',
  title: 'Schoolyard Plant Quest',
  description:
    'Students complete plant photo missions, compare target images, and build a shared living collection from real evidence.',
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
    description: 'Find and photograph a sunflower. Compare your plant to the reference image before submitting.',
    targetCommonNames: ['sunflower'],
    targetScientificNames: ['Helianthus annuus'],
    targetImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sunflower_sky_backdrop.jpg?width=900',
    points: 150,
    hint: 'Look for a tall plant with a large yellow flower head and a dark central disk.',
    successText: 'Correct evidence. Sunflowers are a great example of plants responding to light.',
    failText: 'Wrong evidence: the classroom seedling wilted and lost one health leaf.',
  },
  {
    id: 'clover-fixer',
    title: 'Spot a Clover',
    topic: 'Soil nutrients',
    description: 'Photograph white clover. Use the reference image to check the leaflets and flower shape.',
    targetCommonNames: ['white clover', 'clover'],
    targetScientificNames: ['Trifolium repens'],
    targetImage: 'https://upload.wikimedia.org/wikipedia/commons/d/db/Trifolium_repens_%28inflorescense%29_Edit.jpg',
    points: 130,
    hint: 'Search low grass for groups of three small leaflets and a round white flower head.',
    successText: 'Correct evidence. Clover is a legume that supports nitrogen-fixing bacteria.',
    failText: 'Wrong plant: your virtual garden dried out a little. Try observing the leaves more carefully.',
  },
  {
    id: 'asteraceae-hunter',
    title: 'Find the Daisy Family',
    topic: 'Plant classification',
    description: 'Take a photo of a daisy-family plant, such as a daisy, dandelion, or sunflower.',
    targetFamilies: ['Asteraceae'],
    targetCommonNames: ['daisy', 'dandelion', 'sunflower'],
    targetScientificNames: ['Bellis perennis', 'Taraxacum officinale', 'Helianthus annuus'],
    targetImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bellis_perennis_white_(aka).jpg?width=900',
    points: 170,
    hint: 'Many Asteraceae flowers look like one flower but are made of many tiny florets.',
    successText: 'Correct evidence. You found a member of one of the largest flowering plant families.',
    failText: 'Not the target family: your classroom streak broke. Compare the flower structure and retry.',
  },
  {
    id: 'lavender-aroma',
    title: 'Find Lavender',
    topic: 'Plant defenses',
    description: 'Find lavender and compare the purple flower spikes and narrow leaves with the reference image.',
    targetCommonNames: ['lavender', 'english lavender'],
    targetScientificNames: ['Lavandula angustifolia'],
    targetImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Single_lavender_flower02.jpg?width=900',
    points: 140,
    hint: 'Look for narrow grey-green leaves and purple flower spikes with a strong scent.',
    successText: 'Correct evidence. Lavender uses aromatic oils that can discourage herbivores.',
    failText: 'Not lavender. The class garden lost health; compare the flower spike and leaves again.',
  },
  {
    id: 'rosemary-needle',
    title: 'Identify Rosemary',
    topic: 'Drought adaptation',
    description: 'Photograph rosemary and notice the tough, needle-like leaves that reduce water loss.',
    targetCommonNames: ['rosemary'],
    targetScientificNames: ['Salvia rosmarinus', 'Rosmarinus officinalis'],
    targetImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Rosmarinus_officinalis_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-258.jpg?width=900',
    points: 145,
    hint: 'Find a woody herb with thin needle-like leaves and a pine-like smell.',
    successText: 'Correct evidence. Rosemary leaves are shaped to conserve water in dry conditions.',
    failText: 'Wrong plant. Check for woody stems and narrow aromatic leaves before retrying.',
  },
  {
    id: 'plantain-rosette',
    title: 'Find Broadleaf Plantain',
    topic: 'Urban ecology',
    description: 'Find broadleaf plantain and compare its low rosette shape and strong parallel leaf veins.',
    targetCommonNames: ['broadleaf plantain', 'plantain'],
    targetScientificNames: ['Plantago major'],
    targetImage: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Plantago_major_RF.jpg',
    points: 120,
    hint: 'Look near paths for broad oval leaves growing flat in a rosette.',
    successText: 'Correct evidence. Broadleaf plantain survives trampling with flexible leaves and a low form.',
    failText: 'Not broadleaf plantain. The garden lost health; look for oval leaves with strong veins.',
  },
  {
    id: 'tomato-crop',
    title: 'Spot a Tomato Plant',
    topic: 'Food crops',
    description: 'Photograph a tomato plant. Look for compound leaves, yellow flowers, or red fruit.',
    targetCommonNames: ['tomato'],
    targetScientificNames: ['Solanum lycopersicum'],
    targetImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tomato_je.jpg?width=900',
    points: 155,
    hint: 'Search gardens for fuzzy stems, divided leaves, yellow flowers, or tomatoes.',
    successText: 'Correct evidence. Tomato is a major crop and a model plant for food science.',
    failText: 'Wrong evidence. Compare leaf shape, flower color, and fruit before trying again.',
  },
]

export function getLessonTask(id) {
  return LESSON_TASKS.find((task) => task.id === id) || LESSON_TASKS[0]
}

const PLANT_IMAGE_MATCHES = [
  { terms: ['sunflower', 'helianthus'], image: LESSON_TASKS[0].targetImage },
  { terms: ['clover', 'trifolium'], image: LESSON_TASKS[1].targetImage },
  { terms: ['daisy', 'dandelion', 'asteraceae', 'bellis', 'taraxacum'], image: LESSON_TASKS[2].targetImage },
  { terms: ['lavender', 'lavandula'], image: LESSON_TASKS[3].targetImage },
  { terms: ['rosemary', 'rosmarinus', 'salvia rosmarinus'], image: LESSON_TASKS[4].targetImage },
  { terms: ['plantain', 'plantago'], image: LESSON_TASKS[5].targetImage },
  { terms: ['tomato', 'solanum lycopersicum'], image: LESSON_TASKS[6].targetImage },
]

export function imageForPlantName(name) {
  const haystack = String(name || '').toLowerCase()
  const match = PLANT_IMAGE_MATCHES.find((item) => item.terms.some((term) => haystack.includes(term)))
  return match?.image || ''
}

export function missionImageForTask(task) {
  if (!task) return ''
  if (task.targetImage || task.imageUrl) return task.targetImage || task.imageUrl
  return imageForPlantName(`${task.title || ''} ${(task.targetCommonNames || []).join(' ')}`)
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
