import { useState } from 'react'
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native'
import { useCollection, DEX_GOAL, collectionList } from '../store/useCollection'
import { getAchievements } from '../data/achievements'
import { AchievementGlyph, PlantPlaceholder } from '../components/DesignElements'
import { C } from '../theme'

export default function CollectionScreen() {
  const collectionState = useCollection()
  const plants = collectionState.plants
  const achievements = getAchievements(collectionState)
  const [selected, setSelected] = useState(null)
  const list = collectionList(plants)
  const count = list.length
  const pct = Math.min(100, Math.round((count / DEX_GOAL) * 100))

  return (
    <>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.header}>
          <Text style={s.title}>My collection</Text>
          <Text style={s.counter}>{count}/{DEX_GOAL}</Text>
        </View>
        <View style={s.barTrack}>
          <View style={[s.barFill, { width: `${pct}%` }]} />
        </View>

        <Text style={s.section}>Achievements</Text>
        <View style={s.achievements}>
          {achievements.map((achievement) => (
            <View key={achievement.id} style={[s.achievement, !achievement.unlocked && s.locked]}>
              <AchievementGlyph unlocked={achievement.unlocked} />
              <Text style={s.achievementTitle}>{achievement.title}</Text>
              <Text style={s.achievementDesc}>{achievement.description}</Text>
            </View>
          ))}
        </View>

        <Text style={s.section}>Camera photo evidence</Text>
        {count === 0 ? (
          <View style={s.empty}>
            <PlantPlaceholder size={82} />
            <Text style={s.emptyTitle}>Your collection is empty</Text>
            <Text style={s.emptySub}>Scan your first plant on the Scan tab to start your dex.</Text>
          </View>
        ) : (
          <View style={s.grid}>
            {list.map((p) => (
              <TouchableOpacity key={p.scientificName} style={s.tile} onPress={() => setSelected(p)} activeOpacity={0.82}>
                <View style={s.tilePhoto}>
                  {p.image ? (
                    <Image source={{ uri: p.image }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                  ) : (
                    <PlantPlaceholder size={62} />
                  )}
                  <View style={s.tapChip}><Text style={s.tapText}>Tap</Text></View>
                </View>
                <View style={s.tileBody}>
                  <Text style={s.tileName} numberOfLines={1}>{p.commonName}</Text>
                  <Text style={s.tileSci} numberOfLines={1}>{p.scientificName}</Text>
                  {p.timesSeen > 1 && (
                    <View style={s.seenChip}><Text style={s.seenText}>×{p.timesSeen} finds</Text></View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal visible={!!selected} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
        <View style={s.modalShade}>
          <View style={s.modalCard}>
            {selected?.image ? (
              <Image source={{ uri: selected.image }} style={s.modalPhoto} resizeMode="cover" />
            ) : (
              <View style={[s.modalPhoto, s.modalEmoji]}><PlantPlaceholder size={96} /></View>
            )}
            <View style={s.modalBody}>
              <Text style={s.modalName}>{selected?.commonName}</Text>
              <Text style={s.modalSci}>{selected?.scientificName}</Text>
              {!!selected?.family && <Text style={s.modalMeta}>Family: {selected.family}</Text>}
              <Text style={s.modalMeta}>Camera finds: {selected?.timesSeen || 1}</Text>
              {!!selected?.description && <Text style={s.modalDesc}>{selected.description}</Text>}
              <TouchableOpacity style={s.closeBtn} onPress={() => setSelected(null)}>
                <Text style={s.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

const s = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 },
  title: { fontSize: 20, fontWeight: '800', color: C.bark },
  counter: { fontSize: 14, fontWeight: '800', color: C.leafDark },
  barTrack: { height: 12, borderRadius: 999, backgroundColor: 'rgba(0,0,0,0.10)', overflow: 'hidden', marginBottom: 18 },
  barFill: { height: '100%', backgroundColor: C.leaf, borderRadius: 999 },
  section: { fontSize: 17, fontWeight: '900', color: C.bark, marginBottom: 10, marginTop: 4 },
  achievements: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 18 },
  achievement: { width: '48%', backgroundColor: C.white, borderRadius: 16, padding: 12, marginBottom: 10, minHeight: 122 },
  locked: { opacity: 0.45 },
  achievementTitle: { color: C.bark, fontWeight: '900', marginTop: 4 },
  achievementDesc: { color: C.muted, fontSize: 12, lineHeight: 16, marginTop: 3 },
  empty: { alignItems: 'center', paddingTop: 40 },
  emptyTitle: { fontWeight: '800', color: C.muted, marginTop: 14, fontSize: 16 },
  emptySub: { color: C.muted, textAlign: 'center', marginTop: 6, maxWidth: 280, lineHeight: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: { width: '48%', backgroundColor: C.cardBg, borderRadius: 18, overflow: 'hidden', marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
  tilePhoto: { height: 110, backgroundColor: '#e3f0e6', alignItems: 'center', justifyContent: 'center' },
  tapChip: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  tapText: { color: C.white, fontSize: 11, fontWeight: '900' },
  tileBody: { padding: 10 },
  tileName: { fontWeight: '800', color: C.bark },
  tileSci: { fontStyle: 'italic', color: C.muted, fontSize: 12 },
  seenChip: { alignSelf: 'flex-start', backgroundColor: 'rgba(244,185,66,0.25)', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2, marginTop: 6 },
  seenText: { fontSize: 11, fontWeight: '800', color: C.bark },
  modalShade: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: C.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden', maxHeight: '88%' },
  modalPhoto: { width: '100%', height: 280, backgroundColor: '#e3f0e6' },
  modalEmoji: { alignItems: 'center', justifyContent: 'center' },
  modalBody: { padding: 18 },
  modalName: { color: C.bark, fontSize: 24, fontWeight: '900' },
  modalSci: { color: C.muted, fontStyle: 'italic', marginTop: 2 },
  modalMeta: { color: C.leafDark, fontWeight: '800', marginTop: 8 },
  modalDesc: { color: '#444', marginTop: 12, lineHeight: 21 },
  closeBtn: { backgroundColor: C.bark, borderRadius: 16, alignItems: 'center', paddingVertical: 13, marginTop: 18 },
  closeText: { color: C.cream, fontWeight: '900' },
})
