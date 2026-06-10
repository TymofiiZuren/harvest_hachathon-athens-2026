// Identifies a plant from a photo via Pl@ntNet, then enriches it with a description
// + photo from Wikipedia.
//
// Three possible outcomes:
//   - a real species result                      -> { ...species, source:'plantnet' }
//   - the photo isn't a plant / nothing matched  -> { notPlant: true }
//   - no network / quota / key problem           -> a sample plant { source:'offline', reason }
// Only genuine connection problems fall back to a sample, so a non-plant photo is
// reported honestly instead of showing a random result.

import { PLANTNET_API_KEY } from './config'
import { SAMPLE_PLANTS } from '../data/samplePlants'

const PLANTNET_URL =
  `https://my-api.plantnet.org/v2/identify/k-world-flora?api-key=${PLANTNET_API_KEY}&include-related-images=true`
const WIKI_SUMMARY = 'https://en.wikipedia.org/api/rest_v1/page/summary/'

export async function identifyPlant(uri) {
  let res
  try {
    const form = new FormData()
    form.append('images', { uri, name: 'photo.jpg', type: 'image/jpeg' })
    form.append('organs', 'auto')
    res = await fetch(PLANTNET_URL, { method: 'POST', body: form })
  } catch (err) {
    // True network failure (no internet, blocked) -> offline demo sample.
    return offlineIdentify('Network request failed')
  }

  // Pl@ntNet rejects non-plant images (and returns 404 when nothing is found).
  if (res.status === 404 || res.status === 400) {
    return { notPlant: true }
  }
  // Key / quota / server problems -> sample with the reason shown on the card.
  if (!res.ok) {
    return offlineIdentify(`Pl@ntNet HTTP ${res.status}`)
  }

  const data = await res.json()
  const top = data.results && data.results[0]
  if (!top) {
    return { notPlant: true } // responded fine, but recognised no species
  }

  const species = top.species || {}
  const common = species.commonNames || []
  const base = {
    scientificName: species.scientificNameWithoutAuthor || 'Unknown',
    commonName: common[0] || species.scientificNameWithoutAuthor || 'Unknown',
    family: (species.family && species.family.scientificNameWithoutAuthor) || '',
    confidence: Math.round((top.score || 0) * 100),
    image: (top.images && top.images[0] && top.images[0].url && top.images[0].url.m) || null,
    emoji: '🌿',
    source: 'plantnet',
  }

  const enrich = await enrichWiki(base.scientificName, base.commonName)
  return {
    ...base,
    description: enrich.description || '',
    image: base.image || enrich.image || null,
    wikiUrl: enrich.wikiUrl || '',
  }
}

async function enrichWiki(scientificName, commonName) {
  for (const title of [scientificName, commonName]) {
    if (!title) continue
    try {
      const res = await fetch(WIKI_SUMMARY + encodeURIComponent(title.replace(/ /g, '_')))
      if (!res.ok) continue
      const data = await res.json()
      if (data.type === 'disambiguation') continue
      const photo = (data.originalimage && data.originalimage.source) ||
        (data.thumbnail && data.thumbnail.source) || null
      return {
        description: data.extract || '',
        image: photo,
        wikiUrl: (data.content_urls && data.content_urls.desktop && data.content_urls.desktop.page) || '',
      }
    } catch (e) {
      continue
    }
  }
  return { description: '', image: null, wikiUrl: '' }
}

function offlineIdentify(reason) {
  const pick = SAMPLE_PLANTS[Math.floor(Math.random() * SAMPLE_PLANTS.length)]
  return {
    ...pick,
    confidence: 78 + Math.floor(Math.random() * 20),
    image: null,
    source: 'offline',
    reason: reason || 'unknown',
  }
}
