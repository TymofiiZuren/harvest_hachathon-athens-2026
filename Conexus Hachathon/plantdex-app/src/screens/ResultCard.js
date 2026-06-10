import { useState } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { useCollection } from '../store/useCollection'
import { C } from '../theme'

export default function ResultCard({ result, preview, onScanAgain, onGoCollection }) {
  const addSighting = useCollection((st) => st.addSighting)
  const [added, setAdded] = useState(null)

  const image = result.image || preview

  function handleAdd() {
    const { isNew } = addSighting(result)
    setAdded({ isNew })
  }

  return (
    <View style={s.wrap}>
      <View style={s.card}>
        <View style={s.photoBox}>
          {image ? (
            <Image source={{ uri: image }} style={s.photo} resizeMode="cover" />
          ) : (
            <Text style={s.emoji}>{result.emoji || '🌿'}</Text>
          )}
          {typeof result.confidence === 'number' && (
            <View style={s.badge}>
              <Text style={s.badgeText}>{result.confidence}% match</Text>
            </View>
          )}
        </View>

        <View style={s.body}>
          <Text style={s.name}>{result.commonName}</Text>
          <Text style={s.sci}>{result.scientificName}</Text>
          {!!result.family && (
            <View style={s.familyChip}>
              <Text style={s.familyText}>Family: {result.family}</Text>
            </View>
          )}
          {!!result.description && <Text style={s.desc}>{result.description}</Text>}
          {result.source === 'offline' && (
            <Text style={s.note}>
              ⚠ Demo mode — couldn't reach the API{result.reason ? ` (${result.reason})` : ''}. Showing a sample.
            </Text>
          )}
        </View>
      </View>

      {!added ? (
        <TouchableOpacity style={s.addBtn} onPress={handleAdd} activeOpacity={0.85}>
          <Text style={s.addText}>➕  Add to collection</Text>
        </TouchableOpacity>
      ) : (
        <View style={s.celebrate}>
          <Text style={s.celebrateTitle}>
            {added.isNew ? '🎉 New discovery!' : '✓ Already in collection'}
          </Text>
          <Text style={s.celebrateSub}>
            {added.isNew ? '+100 points' : '+10 points for a repeat find'}
          </Text>
        </View>
      )}

      <View style={s.actions}>
        <TouchableOpacity style={s.outlineBtn} onPress={onScanAgain}>
          <Text style={s.outlineText}>📷  Again</Text>
        </TouchableOpacity>
        {added && (
          <TouchableOpacity style={s.darkBtn} onPress={onGoCollection}>
            <Text style={s.darkText}>📖  Collection</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  wrap: { width: '100%' },
  card: { backgroundColor: C.cardBg, borderRadius: 24, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
  photoBox: { height: 220, backgroundColor: '#e3f0e6', alignItems: 'center', justifyContent: 'center' },
  photo: { width: '100%', height: '100%' },
  emoji: { fontSize: 80 },
  badge: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 },
  badgeText: { color: C.white, fontWeight: '700', fontSize: 13 },
  body: { padding: 18 },
  name: { fontSize: 24, fontWeight: '800', color: C.bark },
  sci: { fontStyle: 'italic', color: C.muted, marginTop: 2 },
  familyChip: { alignSelf: 'flex-start', backgroundColor: 'rgba(58,157,93,0.12)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4, marginTop: 10 },
  familyText: { color: C.leafDark, fontWeight: '700', fontSize: 12 },
  desc: { marginTop: 14, fontSize: 14, lineHeight: 21, color: '#444' },
  note: { marginTop: 12, fontSize: 12, color: '#b5562a' },
  addBtn: { backgroundColor: C.leaf, borderRadius: 18, paddingVertical: 16, alignItems: 'center', marginTop: 16, elevation: 3 },
  addText: { color: C.white, fontSize: 17, fontWeight: '800' },
  celebrate: { backgroundColor: C.leafDark, borderRadius: 18, padding: 16, alignItems: 'center', marginTop: 16 },
  celebrateTitle: { color: C.cream, fontSize: 18, fontWeight: '800' },
  celebrateSub: { color: C.cream, opacity: 0.9, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 12 },
  outlineBtn: { flex: 1, borderWidth: 2, borderColor: C.leaf, borderRadius: 18, paddingVertical: 13, alignItems: 'center' },
  outlineText: { color: C.leafDark, fontWeight: '800' },
  darkBtn: { flex: 1, backgroundColor: C.bark, borderRadius: 18, paddingVertical: 13, alignItems: 'center' },
  darkText: { color: C.cream, fontWeight: '800' },
})
