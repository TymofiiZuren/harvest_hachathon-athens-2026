// Kahoot-style quizzes for the interactive learning feature.
// This is a SEPARATE feature from camera "missions" (lessonTasks) — quizzes are
// multi-question, have a join code/link, and can be played without an account.
//
// Quiz shape:
//   { id, code, title, topic, emoji, accent, description,
//     questions: [ { id, q, choices:[...], answer:<index>, seconds } ] }
//
// `code` is a stable, human-friendly join code printed on the host card.
// `answer` is the INDEX into `choices` (Kahoot-style).
//
// NOTE: real-time multiplayer lobbies, accounts, and persistence are the backend
// team's job. The frontend ships these as local demo data + a local playthrough.

export const QUIZ_ACCENTS = ['#4ADE80', '#34D399', '#FBBF24', '#FB7185', '#60A5FA', '#A78BFA']

export const AGRI_QUIZZES = [
  {
    id: 'soil-nutrients',
    code: 'SOIL-01',
    title: 'Soil & Plant Nutrients',
    topic: 'Agronomy',
    emoji: '🌱',
    accent: '#4ADE80',
    description: 'How soil feeds crops: the key nutrients and what they do.',
    questions: [
      { id: 'q1', q: 'Which three nutrients does the "N-P-K" label on fertilizer stand for?', choices: ['Nitrogen, Phosphorus, Potassium', 'Nitrogen, Phosphorus, Calcium', 'Nickel, Phosphorus, Potassium', 'Nitrogen, Potassium, Carbon'], answer: 0, seconds: 20 },
      { id: 'q2', q: 'Which nutrient most directly drives leafy green growth?', choices: ['Nitrogen', 'Phosphorus', 'Potassium', 'Sulphur'], answer: 0, seconds: 20 },
      { id: 'q3', q: 'A soil pH of 7 is considered…', choices: ['Neutral', 'Strongly acidic', 'Strongly alkaline', 'Toxic to all plants'], answer: 0, seconds: 20 },
      { id: 'q4', q: 'Which soil type drains fastest and holds the least water?', choices: ['Sandy soil', 'Clay soil', 'Loam', 'Peat'], answer: 0, seconds: 20 },
      { id: 'q5', q: 'Yellowing of older leaves often signals a shortage of…', choices: ['Nitrogen', 'Water only', 'Sunlight only', 'Oxygen'], answer: 0, seconds: 20 },
    ],
  },
  {
    id: 'crop-rotation',
    code: 'ROTA-02',
    title: 'Crop Rotation & Cover Crops',
    topic: 'Soil management',
    emoji: '🔄',
    accent: '#34D399',
    description: 'Why farmers move crops around fields season to season.',
    questions: [
      { id: 'q1', q: 'A main benefit of rotating crops each year is…', choices: ['Breaking pest and disease cycles', 'Making fields look tidy', 'Using more fertilizer', 'Slowing the harvest'], answer: 0, seconds: 20 },
      { id: 'q2', q: 'Legumes like beans and clover are valued in rotations because they…', choices: ['Add nitrogen to the soil', 'Remove all nutrients', 'Need no water', 'Repel bees'], answer: 0, seconds: 20 },
      { id: 'q3', q: 'A "cover crop" is mainly grown to…', choices: ['Protect and improve the soil', 'Be sold at market', 'Replace the main harvest', 'Attract weeds'], answer: 0, seconds: 20 },
      { id: 'q4', q: 'Planting the same crop every year on the same field tends to…', choices: ['Deplete specific nutrients', 'Improve soil forever', 'Eliminate all pests', 'Increase rainfall'], answer: 0, seconds: 20 },
    ],
  },
  {
    id: 'photosynthesis',
    code: 'PHOT-03',
    title: 'Photosynthesis & Growth',
    topic: 'Plant science',
    emoji: '☀️',
    accent: '#FBBF24',
    description: 'How plants turn light, water, and air into food.',
    questions: [
      { id: 'q1', q: 'Photosynthesis mainly happens in which part of the plant cell?', choices: ['Chloroplast', 'Nucleus', 'Root hair', 'Cell wall'], answer: 0, seconds: 20 },
      { id: 'q2', q: 'Which gas do plants take IN for photosynthesis?', choices: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Helium'], answer: 0, seconds: 20 },
      { id: 'q3', q: 'The green pigment that captures light is called…', choices: ['Chlorophyll', 'Keratin', 'Melanin', 'Carotene'], answer: 0, seconds: 20 },
      { id: 'q4', q: 'Photosynthesis produces sugar and releases which gas?', choices: ['Oxygen', 'Carbon dioxide', 'Methane', 'Hydrogen'], answer: 0, seconds: 20 },
      { id: 'q5', q: 'Besides light and CO₂, plants also need ___ for photosynthesis.', choices: ['Water', 'Salt', 'Plastic', 'Sound'], answer: 0, seconds: 20 },
    ],
  },
  {
    id: 'pollinators',
    code: 'POLL-04',
    title: 'Pollinators & Bees',
    topic: 'Agroecology',
    emoji: '🐝',
    accent: '#FB7185',
    description: 'The animals that move pollen and keep crops fruiting.',
    questions: [
      { id: 'q1', q: 'Roughly what share of the food crops we eat depends on animal pollination?', choices: ['About a third', 'Almost none', 'Exactly half of all water', 'All of it'], answer: 0, seconds: 20 },
      { id: 'q2', q: 'Which of these is a major crop pollinator?', choices: ['Honey bee', 'Earthworm', 'Spider mite', 'Slug'], answer: 0, seconds: 20 },
      { id: 'q3', q: 'Pollination is the transfer of pollen from the ___ to the ___ of flowers.', choices: ['Anther to stigma', 'Root to leaf', 'Seed to soil', 'Stem to bark'], answer: 0, seconds: 20 },
      { id: 'q4', q: 'A farm-friendly way to support pollinators is to…', choices: ['Plant wildflower strips', 'Remove all flowers', 'Spray pesticides at midday', 'Pave the field'], answer: 0, seconds: 20 },
    ],
  },
  {
    id: 'irrigation',
    code: 'AQUA-05',
    title: 'Irrigation & Water',
    topic: 'Water management',
    emoji: '💧',
    accent: '#60A5FA',
    description: 'Getting the right amount of water to crops, efficiently.',
    questions: [
      { id: 'q1', q: 'Which irrigation method generally wastes the LEAST water?', choices: ['Drip irrigation', 'Flooding the whole field', 'Overhead spray at noon', 'Leaving a hose running'], answer: 0, seconds: 20 },
      { id: 'q2', q: 'Watering early morning or evening helps because it…', choices: ['Reduces evaporation', 'Burns the leaves', 'Attracts pests', 'Uses more water'], answer: 0, seconds: 20 },
      { id: 'q3', q: 'Mulch placed on soil mainly helps to…', choices: ['Keep moisture in', 'Dry the soil faster', 'Block all sunlight to roots', 'Lower the pH to zero'], answer: 0, seconds: 20 },
      { id: 'q4', q: 'Overwatering can harm plants by…', choices: ['Starving roots of oxygen', 'Adding too much nitrogen', 'Cooling the sun', 'Making leaves greener'], answer: 0, seconds: 20 },
    ],
  },
  {
    id: 'pests-ipm',
    code: 'PEST-06',
    title: 'Pests & Smart Control',
    topic: 'Crop protection',
    emoji: '🐛',
    accent: '#A78BFA',
    description: 'Integrated Pest Management: control pests with less spraying.',
    questions: [
      { id: 'q1', q: 'IPM stands for…', choices: ['Integrated Pest Management', 'Instant Plant Medicine', 'Intensive Pesticide Mixing', 'Internal Plant Mapping'], answer: 0, seconds: 20 },
      { id: 'q2', q: 'Ladybugs are useful on farms because they…', choices: ['Eat aphids', 'Eat crops', 'Spread disease', 'Block sunlight'], answer: 0, seconds: 20 },
      { id: 'q3', q: 'A core idea of IPM is to use pesticides…', choices: ['Only as a last resort', 'Every single day', 'On every field always', 'Never measure anything'], answer: 0, seconds: 20 },
      { id: 'q4', q: 'Rotating crops can reduce pests by…', choices: ['Breaking their life cycle', 'Feeding them more', 'Warming the soil', 'Adding pesticide'], answer: 0, seconds: 20 },
    ],
  },
  {
    id: 'composting',
    code: 'COMP-07',
    title: 'Composting & Soil Life',
    topic: 'Organic matter',
    emoji: '🪱',
    accent: '#4ADE80',
    description: 'Turning plant waste into rich food for the soil.',
    questions: [
      { id: 'q1', q: 'Composting turns kitchen and garden waste into…', choices: ['Nutrient-rich humus', 'Pure plastic', 'Clean drinking water', 'Sand'], answer: 0, seconds: 20 },
      { id: 'q2', q: 'Which creature is a star composter in healthy soil?', choices: ['Earthworm', 'Locust', 'Aphid', 'Mosquito'], answer: 0, seconds: 20 },
      { id: 'q3', q: 'A good compost pile needs a balance of "greens" (nitrogen) and…', choices: ['"Browns" (carbon)', 'Salt', 'Concrete', 'Motor oil'], answer: 0, seconds: 20 },
      { id: 'q4', q: 'Turning a compost pile mainly adds…', choices: ['Oxygen for microbes', 'Pesticides', 'Sugar', 'Salt'], answer: 0, seconds: 20 },
    ],
  },
  {
    id: 'seeds',
    code: 'SEED-08',
    title: 'Seeds & Germination',
    topic: 'Plant science',
    emoji: '🌰',
    accent: '#34D399',
    description: 'What a seed needs to wake up and start growing.',
    questions: [
      { id: 'q1', q: 'Germination is the process where a seed…', choices: ['Begins to sprout and grow', 'Dries out and dies', 'Turns into soil', 'Becomes a rock'], answer: 0, seconds: 20 },
      { id: 'q2', q: 'Most seeds need these three things to germinate:', choices: ['Water, warmth, oxygen', 'Salt, ice, plastic', 'Light only', 'Pesticide, sand, wind'], answer: 0, seconds: 20 },
      { id: 'q3', q: 'The first root that emerges from a seed is the…', choices: ['Radicle', 'Petal', 'Stamen', 'Sepal'], answer: 0, seconds: 20 },
      { id: 'q4', q: 'Planting a seed too deep can stop it from sprouting because…', choices: ['It runs out of energy before reaching light', 'It gets too much light', 'The soil is too clean', 'Roots grow upward'], answer: 0, seconds: 20 },
    ],
  },
  {
    id: 'greenhouse',
    code: 'GROW-09',
    title: 'Greenhouses & Climate',
    topic: 'Controlled growing',
    emoji: '🏡',
    accent: '#FBBF24',
    description: 'Growing food in a controlled, protected environment.',
    questions: [
      { id: 'q1', q: 'A greenhouse keeps plants warm by…', choices: ['Trapping heat from sunlight', 'Cooling the air', 'Blocking all light', 'Removing oxygen'], answer: 0, seconds: 20 },
      { id: 'q2', q: 'Greenhouses let farmers…', choices: ['Extend the growing season', 'Stop plants from growing', 'Avoid watering forever', 'Remove all nutrients'], answer: 0, seconds: 20 },
      { id: 'q3', q: 'On a hot day a greenhouse needs ___ to avoid overheating.', choices: ['Ventilation', 'More plastic', 'Less light always', 'Salt'], answer: 0, seconds: 20 },
      { id: 'q4', q: 'Hydroponics grows plants using…', choices: ['Nutrient-rich water instead of soil', 'Only sand', 'No water at all', 'Pure sugar'], answer: 0, seconds: 20 },
    ],
  },
  {
    id: 'sustainable',
    code: 'ECO-10',
    title: 'Sustainable Farming',
    topic: 'Agroecology',
    emoji: '♻️',
    accent: '#60A5FA',
    description: 'Farming that protects soil, water, and biodiversity for the future.',
    questions: [
      { id: 'q1', q: 'Sustainable agriculture aims to produce food while…', choices: ['Protecting soil and water for the future', 'Using up all resources fast', 'Ignoring the environment', 'Removing all wildlife'], answer: 0, seconds: 20 },
      { id: 'q2', q: 'Reducing tillage (less ploughing) helps by…', choices: ['Keeping carbon and structure in the soil', 'Destroying all earthworms', 'Drying out every field', 'Adding plastic'], answer: 0, seconds: 20 },
      { id: 'q3', q: 'Biodiversity on a farm is good because it…', choices: ['Builds a more resilient ecosystem', 'Always lowers yields', 'Attracts only pests', 'Wastes land'], answer: 0, seconds: 20 },
      { id: 'q4', q: 'Agroforestry combines crops with…', choices: ['Trees', 'Concrete', 'Plastic sheets', 'Salt flats'], answer: 0, seconds: 20 },
    ],
  },
]

// 6-digit numeric PIN for a hosted session (Kahoot-style game PIN).
export function genPin() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

// Build a shareable join link for a code or pin.
// Domain is a placeholder; the backend team wires up real deep links.
export function joinLink(codeOrPin) {
  return `https://plantdex.app/join/${codeOrPin}`
}

// Stable code for a freshly created quiz, e.g. "QUIZ-4831".
export function makeQuizCode() {
  return `QUIZ-${Math.floor(1000 + Math.random() * 9000)}`
}

export function blankQuestion() {
  return { id: `q-${Date.now()}-${Math.floor(Math.random() * 1000)}`, q: '', choices: ['', '', '', ''], answer: 0, seconds: 20 }
}
