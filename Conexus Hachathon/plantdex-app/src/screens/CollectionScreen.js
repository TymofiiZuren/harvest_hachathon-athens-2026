import { View, Text, Image, StyleSheet, ScrollView } from 'react-native'
import { useCollection, DEX_GOAL, collectionList } from '../store/useCollection'
import { C } from '../theme'

export default function CollectionScreen() {
  const plants = useCollection((st) => st.plants)
  const list = collectionList(plants)
  const count = list.length
  const pct = Math.min(100, Math.round((count / DEX_GOAL) * 100))

  return (
    <ScrollView contentContainerStyle={s.scroll}>
      <View style={s.header}>
        <Text style={s.title}>My collection</Text>
        <Text style={s.counter}>{count}/{DEX_GOAL}</Text>
      </View>
      <View style={s.barTrack}>
        <View style={[s.barFill, { width: `${pct}%` }]} />
      </View>

      {count === 0 ? (
        <View style={s.empty}>
          <Text style={{ fontSize: 60 }}>🌱</Text>
          <Text style={s.emptyTitle}>Your collection is empty</Text>
          <Text style={s.emptySub}>Scan your first plant on the Scan tab to start your dex.</Text>
        </View>
      ) : (
        <View style={s.grid}>
          {list.map((p) => (
            <View key={p.scientificName} style={s.tile}>
              <View style={s.tilePhoto}>
                {p.image ? (
                  <Image source={{ uri: p.image }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                ) : (
                  <Text style={{ fontSize: 44 }}>{p.emoji || '🌿'}</Text>
                )}
              </View>
              <View style={s.tileBody}>
                <Text style={s.tileName} numberOfLines={1}>{p.commonName}</Text>
                <Text style={s.tileSci} numberOfLines={1}>{p.scientificName}</Text>
                {p.timesSeen > 1 && (
                  <View style={s.seenChip}><Text style={s.seenText}>×{p.timesSeen} finds</Text></View>
                )}
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  )
}

const s = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 },
  title: { fontSize: 20, fontWeight: '800', color: C.bark },
  counter: { fontSize: 14, fontWeight: '800', color: C.leafDark },
  barTrack: { height: 12, borderRadius: 999, backgroundColor: 'rgba(0,0,0,0.10)', overflow: 'hidden', marginBottom: 18 },
  barFill: { height: '100%', backgroundColor: C.leaf, borderRadius: 999 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontWeight: '800', color: C.muted, marginTop: 14, fontSize: 16 },
  emptySub: { color: C.muted, textAlign: 'center', marginTop: 6, maxWidth: 280, lineHeight: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: { width: '48%', backgroundColor: C.cardBg, borderRadius: 18, overflow: 'hidden', marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
  tilePhoto: { height: 110, backgroundColor: '#e3f0e6', alignItems: 'center', justifyContent: 'center' },
  tileBody: { padding: 10 },
  tileName: { fontWeight: '800', color: C.bark },
  tileSci: { fontStyle: 'italic', color: C.muted, fontSize: 12 },
  seenChip: { alignSelf: 'flex-start', backgroundColor: 'rgba(244,185,66,0.25)', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2, marginTop: 6 },
  seenText: { fontSize: 11, fontWeight: '800', color: C.bark },
})
