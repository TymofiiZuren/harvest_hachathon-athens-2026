// GBIF (Global Biodiversity Information Facility) — free, keyless API.
// Resolves a scientific name to a taxonKey, then provides world-map tile URLs
// showing real recorded occurrences of that species.

const matchCache = {}

// Look up a species: returns { taxonKey, count } or null.
export async function gbifTaxon(scientificName) {
  if (!scientificName) return null
  const cacheKey = String(scientificName).toLowerCase().trim()
  if (matchCache[cacheKey] !== undefined) return matchCache[cacheKey]
  try {
    const res = await fetch(
      `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(scientificName)}`
    )
    if (!res.ok) {
      matchCache[cacheKey] = null
      return null
    }
    const data = await res.json()
    const taxonKey = data.usageKey || null
    if (!taxonKey) {
      matchCache[cacheKey] = null
      return null
    }

    // Occurrence count is a nice headline number; non-fatal if it fails.
    let count = null
    try {
      const cRes = await fetch(`https://api.gbif.org/v1/occurrence/search?taxonKey=${taxonKey}&limit=0`)
      if (cRes.ok) {
        const cData = await cRes.json()
        count = typeof cData.count === 'number' ? cData.count : null
      }
    } catch (e) {
      // count stays null
    }

    const result = { taxonKey, count }
    matchCache[cacheKey] = result
    return result
  } catch (e) {
    return null
  }
}

// Zoom-0 world tiles (one tile = whole world, Web Mercator).
// base: dark basemap matching the app theme; overlay: glowing occurrence dots.
export function gbifMapUrls(taxonKey) {
  return {
    base: 'https://tile.gbif.org/3857/omt/0/0/0@2x.png?style=gbif-dark',
    overlay: `https://api.gbif.org/v2/map/occurrence/density/0/0/0@2x.png?taxonKey=${taxonKey}&style=greenHeat.point`,
  }
}

export function formatCount(n) {
  if (typeof n !== 'number') return null
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${Math.round(n / 1000)}K`
  return String(n)
}
