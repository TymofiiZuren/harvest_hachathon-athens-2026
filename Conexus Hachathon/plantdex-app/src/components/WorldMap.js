// "Where it grows" — world map of real recorded sightings of a species,
// drawn from GBIF occurrence tiles (dark basemap + glowing density dots).
// Renders nothing if the species can't be matched, so it never breaks a card.
import { useEffect, useState } from 'react'
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native'
import { gbifTaxon, gbifMapUrls, formatCount } from '../services/gbif'
import { T, F } from '../theme'

export default function WorldMap({ scientificName, style }) {
  const [state, setState] = useState({ status: 'loading', taxonKey: null, count: null })

  useEffect(() => {
    let alive = true
    setState({ status: 'loading', taxonKey: null, count: null })
    gbifTaxon(scientificName).then((taxon) => {
      if (!alive) return
      setState(taxon ? { status: 'ready', ...taxon } : { status: 'none' })
    })
    return () => { alive = false }
  }, [scientificName])

  if (state.status === 'none') return null

  return (
    <View style={[s.wrap, style]}>
      <View style={s.headRow}>
        <Text style={F.micro}>Where it grows</Text>
        {state.status === 'ready' && state.count !== null && (
          <Text style={s.count}>{formatCount(state.count)} sightings</Text>
        )}
      </View>

      <View style={s.mapBox}>
        {state.status === 'loading' ? (
          <ActivityIndicator color={T.c.accent} />
        ) : (
          <>
            <Image source={{ uri: gbifMapUrls(state.taxonKey).base }} style={s.map} resizeMode="cover" />
            <Image
              source={{ uri: gbifMapUrls(state.taxonKey).overlay }}
              style={[s.map, StyleSheet.absoluteFill]}
              resizeMode="cover"
            />
          </>
        )}
      </View>
      <Text style={s.credit}>Live occurrence data · GBIF.org</Text>
    </View>
  )
}

const s = StyleSheet.create({
  wrap: { marginTop: 16 },
  headRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  count: { color: T.c.accent, fontWeight: '800', fontSize: 12 },
  mapBox: { height: 185, borderRadius: T.r.md, overflow: 'hidden', backgroundColor: T.c.photo, borderWidth: 1, borderColor: T.c.line, alignItems: 'center', justifyContent: 'center' },
  map: { width: '100%', height: '100%' },
  credit: { ...F.body, fontSize: 10, color: T.c.faint, marginTop: 6, textAlign: 'right' },
})
