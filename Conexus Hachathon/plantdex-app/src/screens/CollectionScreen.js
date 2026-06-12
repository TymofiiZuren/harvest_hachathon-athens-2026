import { useState } from 'react'
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native'
import { useCollection, collectionList } from '../store/useCollection'
import { PlantPlaceholder } from '../components/DesignElements'
import WorldMap from '../components/WorldMap'
import { Press, Btn, Sheet, Tag } from '../components/ui'
import { T, F } from '../theme'

export default function CollectionScreen() {
  const plants = useCollection((state) => state.plants)
  const [selected, setSelected] = useState(null)
  const list = collectionList(plants)
  const count = list.length

  return (
    <>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <View>
            <Text style={F.micro}>Collection</Text>
            <Text style={[F.display, s.title]}>Dex</Text>
          </View>
          <View style={s.countBlock}>
            <Text style={s.countValue}>{count}</Text>
            <Text style={F.micro}>Species</Text>
          </View>
        </View>

        <Text style={s.section}>Field photos</Text>
        {count === 0 ? (
          <View style={s.empty}>
            <PlantPlaceholder size={80} />
            <Text style={[F.h2, s.emptyTitle]}>No plants yet</Text>
            <Text style={[F.body, s.emptySub]}>Scan your first plant to start the dex.</Text>
          </View>
        ) : (
          <View style={s.grid}>
            {list.map((p) => (
              <Press
                key={p.scientificName || p.commonName || String(p.firstFound)}
                style={s.tile}
                onPress={() => setSelected(p)}
              >
                <View style={s.tilePhoto}>
                  {p.image ? (
                    <Image source={{ uri: p.image }} style={s.tileImage} resizeMode="cover" />
                  ) : (
                    <PlantPlaceholder size={56} />
                  )}
                  {p.timesSeen > 1 && <Tag label={`×${p.timesSeen}`} tone="gold" style={s.seenTag} />}
                </View>
                <View style={s.tileBody}>
                  <Text style={F.bodyStrong} numberOfLines={1}>{p.commonName}</Text>
                  <Text style={s.tileSci} numberOfLines={1}>{p.scientificName}</Text>
                </View>
              </Press>
            ))}
          </View>
        )}
      </ScrollView>

      <Sheet visible={!!selected} onClose={() => setSelected(null)}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {selected?.image ? (
            <Image source={{ uri: selected.image }} style={s.detailPhoto} resizeMode="cover" />
          ) : (
            <View style={[s.detailPhoto, s.detailPhotoEmpty]}>
              <PlantPlaceholder size={92} />
            </View>
          )}
          <Text style={[F.h1, { marginTop: 16 }]}>{selected?.commonName}</Text>
          <Text style={s.detailSci}>{selected?.scientificName}</Text>
          <View style={s.detailTags}>
            {!!selected?.family && <Tag label={selected.family} tone="accent" />}
            <Tag label={`${selected?.timesSeen || 1} finds`} tone="gold" />
          </View>
          {!!selected?.description && <Text style={[F.body, { marginTop: 14 }]}>{selected.description}</Text>}
          {!!selected?.scientificName && selected.scientificName !== 'Unknown' && (
            <WorldMap scientificName={selected.scientificName} />
          )}
          <Btn label="Close" kind="raised" onPress={() => setSelected(null)} style={{ marginTop: 18 }} />
        </ScrollView>
      </Sheet>
    </>
  )
}

const s = StyleSheet.create({
  scroll: { padding: 18, paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  title: { marginTop: 4 },
  countBlock: { alignItems: 'flex-end' },
  countValue: { ...F.h1, fontSize: 26, color: T.c.accent },
  section: { ...F.h2, marginBottom: 10, marginTop: 14 },
  empty: { alignItems: 'center', paddingVertical: 36 },
  emptyTitle: { marginTop: 14 },
  emptySub: { marginTop: 4, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: { width: '48.3%', backgroundColor: T.c.surface, borderRadius: T.r.md, borderWidth: 1, borderColor: T.c.line, overflow: 'hidden', marginBottom: 11 },
  tilePhoto: { height: 116, backgroundColor: T.c.photo, alignItems: 'center', justifyContent: 'center' },
  tileImage: { width: '100%', height: '100%' },
  seenTag: { position: 'absolute', top: 8, right: 8 },
  tileBody: { padding: 11 },
  tileSci: { ...F.body, fontSize: 11, fontStyle: 'italic', marginTop: 1 },
  detailPhoto: { width: '100%', height: 260, borderRadius: T.r.md, backgroundColor: T.c.photo },
  detailPhotoEmpty: { alignItems: 'center', justifyContent: 'center' },
  detailSci: { ...F.body, fontStyle: 'italic', marginTop: 3 },
  detailTags: { flexDirection: 'row', gap: 8, marginTop: 12 },
})
