// ─── Leaving Cert Biology · plant-science study pack ─────────────────────────
// Topics mirror the LC Biology syllabus units that overlap with PlantDex's
// botany theme. Each topic ships short revision notes plus exam-style MCQs in
// driving-theory format: instant feedback and an explanation for every answer.

export const PASS_MARK = 0.8 // like the driver theory test — 80% to pass
export const EXAM_SIZE = 10 // questions per mock test

export const LC_TOPICS = [
  {
    id: 'photosynthesis',
    emoji: '☀️',
    accent: '#F5C04E',
    title: 'Photosynthesis',
    tag: 'Unit 2 · Cell Metabolism',
    notes: [
      {
        h: 'The big idea',
        body: 'Photosynthesis converts light energy into chemical energy stored in glucose. Balanced equation: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ (requires light energy and chlorophyll). It is the source of nearly all food and atmospheric oxygen.',
      },
      {
        h: 'Where it happens',
        body: 'In chloroplasts, mainly in leaf cells. Chlorophyll (in the grana) absorbs mostly red and blue light and reflects green — which is why leaves look green.',
      },
      {
        h: 'Light stage (light-dependent)',
        body: 'Light energy splits water — photolysis — into protons, electrons and oxygen. The energy is trapped in ATP and NADPH. Oxygen is released as a by-product through the stomata.',
      },
      {
        h: 'Dark stage (light-independent)',
        body: 'CO₂ combines with the protons and electrons carried by NADPH, using energy from ATP, to build glucose. It does not need light directly but depends on the products of the light stage.',
      },
      {
        h: 'Limiting factors — classic exam graph',
        body: 'Rate of photosynthesis is controlled by light intensity, CO₂ concentration and temperature. Increasing one factor raises the rate only until another factor becomes limiting — then the graph plateaus.',
      },
    ],
    questions: [
      {
        q: 'In which cell organelle does photosynthesis take place?',
        options: ['Mitochondrion', 'Chloroplast', 'Ribosome', 'Nucleus'],
        answer: 1,
        why: 'Chloroplasts contain chlorophyll, the pigment that traps light energy. Mitochondria do the opposite job — respiration.',
      },
      {
        q: 'The oxygen released during photosynthesis comes from:',
        options: ['Carbon dioxide', 'Glucose', 'Water', 'Chlorophyll'],
        answer: 2,
        why: 'In the light stage, water is split by light energy (photolysis) into protons, electrons and oxygen.',
      },
      {
        q: 'Which of these are products of the LIGHT stage?',
        options: ['Glucose and starch', 'ATP and NADPH', 'CO₂ and water', 'Nitrates and minerals'],
        answer: 1,
        why: 'The light stage traps energy as ATP and NADPH (plus O₂ as a by-product). Glucose is only made later, in the dark stage.',
      },
      {
        q: 'A plant in very bright light stops increasing its photosynthesis rate. The most likely reason is:',
        options: [
          'Its chlorophyll is used up',
          'Another factor, e.g. CO₂, has become limiting',
          'Photosynthesis stops in bright light',
          'The stomata produce less oxygen',
        ],
        answer: 1,
        why: 'This is the limiting-factor principle: once light is plentiful, the rate is capped by whichever factor is now in shortest supply, often CO₂.',
      },
      {
        q: 'Leaves appear green because chlorophyll:',
        options: ['Absorbs green light', 'Reflects green light', 'Produces green glucose', 'Absorbs only ultraviolet light'],
        answer: 1,
        why: 'Chlorophyll absorbs mainly red and blue wavelengths and reflects green light back to your eye.',
      },
    ],
  },
  {
    id: 'transport',
    emoji: '🌿',
    accent: '#4ADE80',
    title: 'Structure & Transport',
    tag: 'Unit 3 · The Organism',
    notes: [
      {
        h: 'Three plant tissue types',
        body: 'Dermal tissue covers and protects. Ground tissue handles photosynthesis and food storage. Vascular tissue transports — it is made of xylem and phloem.',
      },
      {
        h: 'Xylem — the water pipe',
        body: 'Dead, hollow cells (vessels and tracheids) strengthened with lignin. Carries water and minerals in ONE direction only: up from roots to leaves. Lignin also supports the plant.',
      },
      {
        h: 'Phloem — the food pipe',
        body: 'Living sieve-tube cells kept alive by companion cells. Carries food (sucrose and amino acids) both up and down the plant. This movement of food is called translocation.',
      },
      {
        h: 'Transpiration',
        body: 'The loss of water vapour, mainly through the stomata of leaves. It pulls a continuous column of water up the stem (the cohesion-tension model — water molecules stick together), cools the leaf and delivers dissolved minerals.',
      },
      {
        h: 'Stomata and guard cells',
        body: 'Each stoma is opened and closed by a pair of guard cells that swell or shrink. The plant balances taking in CO₂ against losing water. Most stomata are on the cooler, shadier underside of the leaf.',
      },
    ],
    questions: [
      {
        q: 'Which tissue carries water and minerals from the roots to the leaves?',
        options: ['Phloem', 'Xylem', 'Dermal tissue', 'Ground tissue'],
        answer: 1,
        why: 'Xylem moves water and minerals upward only. Phloem is the food-transport tissue.',
      },
      {
        q: 'A key difference between xylem and phloem is that xylem:',
        options: [
          'Is made of dead cells at maturity',
          'Transports food in both directions',
          'Contains companion cells',
          'Is found only in flowers',
        ],
        answer: 0,
        why: 'Mature xylem vessels are dead, hollow tubes reinforced with lignin. Phloem sieve cells stay alive, supported by companion cells.',
      },
      {
        q: 'Transpiration is best defined as:',
        options: [
          'The movement of food through the phloem',
          'The loss of water vapour, mainly through stomata',
          'The absorption of water by root hairs',
          'The splitting of water in photosynthesis',
        ],
        answer: 1,
        why: 'Transpiration is evaporation of water vapour from the plant, mostly through leaf stomata — and it powers the upward pull of water.',
      },
      {
        q: 'The transport of food (e.g. sucrose) in a plant is called:',
        options: ['Transpiration', 'Translocation', 'Transamination', 'Osmosis'],
        answer: 1,
        why: 'Translocation is the movement of food through the phloem — it can travel both up and down the plant.',
      },
      {
        q: 'Most stomata are found on the underside of a leaf because:',
        options: [
          'More light reaches the underside',
          'It reduces water loss — the underside is cooler and shadier',
          'The xylem only reaches the underside',
          'Guard cells cannot survive in sunlight',
        ],
        answer: 1,
        why: 'Less direct sun means less evaporation, so the plant keeps gas exchange while cutting water loss.',
      },
    ],
  },
  {
    id: 'ecology',
    emoji: '🌍',
    accent: '#60A5FA',
    title: 'Ecology & Ecosystems',
    tag: 'Unit 1 · The Study of Life',
    notes: [
      {
        h: 'Key definitions',
        body: 'Ecosystem: a community of organisms interacting with each other and their non-living environment. Habitat: the place where an organism lives. Niche: the functional role of an organism in its ecosystem.',
      },
      {
        h: 'Food chains and webs',
        body: 'Every food chain starts with a producer (a green plant). Arrows show the direction of energy flow. A food web is a set of interlinked food chains and shows feeding relationships more realistically.',
      },
      {
        h: 'Energy flow — why chains are short',
        body: 'Only about 10% of energy passes to the next trophic level; the rest is lost as heat, movement and waste. That is why food chains rarely have more than four or five links.',
      },
      {
        h: 'Studying a habitat',
        body: 'Quadrats are thrown randomly to estimate the percentage frequency or cover of plants. A line transect records change across a habitat. Identification keys name the organisms found. Errors are reduced by repeating and randomising.',
      },
      {
        h: 'The nitrogen cycle',
        body: 'Plants absorb nitrates from soil to build proteins. Nitrogen-fixing bacteria (free-living, or in the root nodules of legumes like clover and peas) convert nitrogen gas into usable compounds. Decomposers return nitrogen to the soil.',
      },
    ],
    questions: [
      {
        q: 'Every food chain must begin with a:',
        options: ['Herbivore', 'Producer (green plant)', 'Decomposer', 'Carnivore'],
        answer: 1,
        why: 'Producers trap the sun’s energy by photosynthesis — they are the entry point of energy into every food chain.',
      },
      {
        q: 'Roughly how much energy passes from one trophic level to the next?',
        options: ['90%', '50%', '10%', '100%'],
        answer: 2,
        why: 'About 90% is lost as heat, movement and waste at each level — only ~10% moves on. This limits chain length.',
      },
      {
        q: 'A quadrat is used in ecology to:',
        options: [
          'Trap small mammals',
          'Estimate the frequency or cover of plants in a habitat',
          'Measure soil pH',
          'Record air temperature',
        ],
        answer: 1,
        why: 'A quadrat is a square frame thrown randomly; counting what grows inside gives percentage frequency or cover for plants.',
      },
      {
        q: 'The term "niche" means:',
        options: [
          'The place where an organism lives',
          'The functional role of an organism in its ecosystem',
          'A group of the same species',
          'The non-living parts of an ecosystem',
        ],
        answer: 1,
        why: 'Niche = the organism’s job (what it eats, what eats it, how it behaves). Habitat is its address; niche is its profession.',
      },
      {
        q: 'Clover and peas enrich the soil because their root nodules contain:',
        options: ['Mycorrhizal fungi', 'Nitrogen-fixing bacteria', 'Decomposing viruses', 'Chloroplasts'],
        answer: 1,
        why: 'Nitrogen-fixing bacteria in legume root nodules convert nitrogen gas into compounds plants can use — natural fertiliser.',
      },
    ],
  },
  {
    id: 'responses',
    emoji: '🌱',
    accent: '#C084FC',
    title: 'Plant Responses',
    tag: 'Unit 3 · Responses & Growth',
    notes: [
      {
        h: 'Tropisms',
        body: 'A tropism is a growth response of a plant to an external stimulus. Phototropism (light), geotropism (gravity), hydrotropism (water), thigmotropism (touch) and chemotropism (chemicals). Positive = growth towards, negative = growth away.',
      },
      {
        h: 'Auxin (IAA) — the growth regulator',
        body: 'Auxin is produced in the shoot tip. In a lit-from-one-side shoot it moves to the shaded side, where it makes cells elongate more — so the shoot bends TOWARDS the light.',
      },
      {
        h: 'Shoots vs roots',
        body: 'Shoots are positively phototropic and negatively geotropic (grow up, towards light). Roots are positively geotropic and negatively phototropic (grow down) — anchoring the plant and finding water.',
      },
      {
        h: 'Growth regulators in industry',
        body: 'Rooting powders (auxins) help cuttings grow roots. Ethene gas ripens fruit such as bananas in transit. Synthetic auxins are used as selective weedkillers.',
      },
    ],
    questions: [
      {
        q: 'A shoot growing towards light is showing:',
        options: ['Negative geotropism only', 'Positive phototropism', 'Positive hydrotropism', 'Thigmotropism'],
        answer: 1,
        why: 'Growth towards a light stimulus is positive phototropism (shoots are also negatively geotropic, but the light response is what is described).',
      },
      {
        q: 'Auxin makes a shoot bend towards light because it:',
        options: [
          'Builds up on the bright side and slows growth there',
          'Builds up on the shaded side and makes those cells elongate more',
          'Kills cells on the shaded side',
          'Attracts chlorophyll to the bright side',
        ],
        answer: 1,
        why: 'More auxin on the shaded side means more cell elongation there — uneven growth curves the shoot towards the light.',
      },
      {
        q: 'Which growth regulator is used commercially to ripen bananas?',
        options: ['Auxin (IAA)', 'Ethene', 'Chlorophyll', 'Nicotine'],
        answer: 1,
        why: 'Ethene is a gaseous plant regulator that triggers ripening — fruit is shipped green and ripened on arrival.',
      },
      {
        q: 'A root growing downwards into the soil is showing:',
        options: ['Positive geotropism', 'Negative geotropism', 'Positive phototropism', 'Chemotropism'],
        answer: 0,
        why: 'Growing in the direction of gravity is positive geotropism — it anchors the plant and brings roots towards water.',
      },
      {
        q: 'Where in the plant is auxin (IAA) produced?',
        options: ['Root nodules', 'The shoot tip (apex)', 'The flower petals', 'Xylem vessels'],
        answer: 1,
        why: 'Auxin is made in the apical meristem at the shoot tip and moves down — removing the tip stops the bending response.',
      },
    ],
  },
  {
    id: 'reproduction',
    emoji: '🌸',
    accent: '#FB7185',
    title: 'Flowers & Reproduction',
    tag: 'Unit 3 · Reproduction',
    notes: [
      {
        h: 'Parts of the flower',
        body: 'Sepals protect the bud. Petals attract pollinators. The stamen (male) = anther, which makes pollen, on a filament. The carpel (female) = stigma, style and ovary, which contains the ovules.',
      },
      {
        h: 'Pollination',
        body: 'Transfer of pollen from anther to stigma. Insect-pollinated flowers: bright petals, scent, nectar, sticky pollen. Wind-pollinated flowers: small green petals, huge amounts of light pollen, feathery stigmas hanging outside the flower.',
      },
      {
        h: 'Double fertilisation — unique to flowering plants',
        body: 'One sperm nucleus fuses with the egg to form the zygote (2n), which becomes the embryo. The second sperm fuses with the two polar nuclei to form the endosperm (3n) — the food store of the seed.',
      },
      {
        h: 'Fruit, seed and dispersal',
        body: 'After fertilisation the ovary becomes the fruit and each ovule becomes a seed. Dispersal (by wind, water, animals or self) avoids competition with the parent and colonises new ground.',
      },
      {
        h: 'Germination and dormancy',
        body: 'A seed needs water, oxygen and a suitable temperature to germinate. Dormancy is a resting period — it helps seeds survive winter and germinate when conditions improve.',
      },
    ],
    questions: [
      {
        q: 'Pollen is produced in the:',
        options: ['Stigma', 'Anther', 'Ovary', 'Sepal'],
        answer: 1,
        why: 'The anther (top of the stamen, the male part) produces pollen grains by meiosis.',
      },
      {
        q: 'In double fertilisation, the second sperm nucleus forms the:',
        options: ['Zygote (2n)', 'Endosperm (3n)', 'Fruit wall', 'Root nodule'],
        answer: 1,
        why: 'The second sperm fuses with the two polar nuclei to make the triploid endosperm — the food store for the embryo.',
      },
      {
        q: 'Which features suggest a flower is WIND-pollinated?',
        options: [
          'Bright petals and nectar',
          'Strong scent and sticky pollen',
          'Small green petals and feathery stigmas',
          'Large landing-platform petals',
        ],
        answer: 2,
        why: 'Wind flowers do not need to attract insects — they make masses of light pollen and catch it with feathery stigmas outside the flower.',
      },
      {
        q: 'The three conditions a seed needs to germinate are:',
        options: [
          'Water, oxygen and a suitable temperature',
          'Light, soil and nitrates',
          'Carbon dioxide, heat and darkness',
          'Chlorophyll, water and wind',
        ],
        answer: 0,
        why: 'Water activates enzymes, oxygen allows respiration, and a suitable temperature lets enzymes work. Light is NOT required by most seeds.',
      },
      {
        q: 'After fertilisation, the ovary of a flower develops into the:',
        options: ['Seed', 'Fruit', 'Endosperm', 'Stigma'],
        answer: 1,
        why: 'Ovary → fruit; ovule → seed. The fruit protects the seeds and often helps disperse them.',
      },
    ],
  },
]

// Random sample across every topic — the "mock theory test".
export function buildMockExam(size = EXAM_SIZE) {
  const pool = LC_TOPICS.flatMap((t) =>
    t.questions.map((q) => ({ ...q, topic: t.title, emoji: t.emoji }))
  )
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, Math.min(size, pool.length))
}
