// ─── Geometric icon set for the Night Garden language ────────────────────────
// Pure-View glyphs (no icon font): brand mark, nav icons, camera, sprout
// placeholder, status dot, achievement seal.
import { View, Text, StyleSheet } from 'react-native'
import { T } from '../theme'

export function BrandMark({ size = 32 }) {
  const k = size / 32
  return (
    <View style={[d.brand, { width: size, height: size, borderRadius: size * 0.32 }]}>
      <View style={[d.brandStem, { height: 14 * k, width: 2.5 * k, bottom: 6 * k }]} />
      <View style={[d.brandLeafL, { width: 11 * k, height: 8 * k, left: 5 * k, top: 9 * k }]} />
      <View style={[d.brandLeafR, { width: 11 * k, height: 8 * k, right: 5 * k, top: 6 * k }]} />
    </View>
  )
}

export function NavGlyph({ type, active = false }) {
  const color = active ? T.c.accent : T.c.faint
  if (type === 'scan') return <ScanGlyph color={color} />
  if (type === 'collection') return <DexGlyph color={color} />
  if (type === 'dashboard') return <BarsGlyph color={color} />
  if (type === 'quizzes' || type === 'quiz' || type === 'join') return <QuizGlyph color={color} />
  if (type === 'study' || type === 'learn') return <CapGlyph color={color} />
  if (type === 'profile') return <PersonGlyph color={color} />
  return <LeafGlyph color={color} />
}

// Profile — head and shoulders.
function PersonGlyph({ color }) {
  return (
    <View style={d.icon}>
      <View style={[d.personHead, { backgroundColor: color }]} />
      <View style={[d.personBody, { backgroundColor: color }]} />
    </View>
  )
}

// Study — a graduation cap: flattened diamond board, base and tassel.
function CapGlyph({ color }) {
  return (
    <View style={d.icon}>
      <View style={[d.capTop, { backgroundColor: color }]} />
      <View style={[d.capBase, { backgroundColor: color }]} />
      <View style={[d.capTassel, { backgroundColor: color }]} />
    </View>
  )
}

// Home — a single solid leaf with a stem notch. On-brand and reads at 20px.
function LeafGlyph({ color }) {
  return (
    <View style={d.icon}>
      <View style={[d.leafShape, { backgroundColor: color }]} />
      <View style={[d.leafStem, { backgroundColor: color }]} />
    </View>
  )
}

function ScanGlyph({ color }) {
  return (
    <View style={d.icon}>
      <View style={[d.corner, d.cTL, { borderColor: color }]} />
      <View style={[d.corner, d.cTR, { borderColor: color }]} />
      <View style={[d.corner, d.cBL, { borderColor: color }]} />
      <View style={[d.corner, d.cBR, { borderColor: color }]} />
      <View style={[d.scanDot, { backgroundColor: color }]} />
    </View>
  )
}

// Quizzes — a speech bubble with a question mark (tintable, no emoji).
function QuizGlyph({ color }) {
  return (
    <View style={d.icon}>
      <View style={[d.qBubble, { borderColor: color }]}>
        <Text style={[d.qMark, { color }]}>?</Text>
      </View>
      <View style={[d.qTail, { backgroundColor: color }]} />
    </View>
  )
}

// Dex — four solid rounded cells, like a filled collection grid.
function DexGlyph({ color }) {
  return (
    <View style={[d.icon, d.dexGrid]}>
      {[0, 1, 2, 3].map((n) => (
        <View key={n} style={[d.dexCell, { backgroundColor: color }, n === 3 && { opacity: 0.45 }]} />
      ))}
    </View>
  )
}

function BarsGlyph({ color }) {
  return (
    <View style={[d.icon, d.bars]}>
      <View style={[d.bar, { height: 9, backgroundColor: color }]} />
      <View style={[d.bar, { height: 16, backgroundColor: color }]} />
      <View style={[d.bar, { height: 12, backgroundColor: color }]} />
    </View>
  )
}

export function CameraGlyph({ color = T.c.onAccent, small = false }) {
  const w = small ? 20 : 38
  return (
    <View style={[d.camera, { width: w, height: w * 0.74, borderColor: color, borderRadius: w * 0.18 }]}>
      <View style={[d.lens, { borderColor: color, width: w * 0.34, height: w * 0.34, borderRadius: w * 0.2 }]} />
    </View>
  )
}

export function PlantPlaceholder({ size = 72 }) {
  const k = size / 72
  return (
    <View style={[d.sprout, { width: size, height: size, borderRadius: size / 2 }]}>
      <View style={[d.sproutStem, { height: 26 * k, width: 3 * k, bottom: 14 * k }]} />
      <View style={[d.sproutLeafL, { width: 20 * k, height: 13 * k, left: 12 * k, bottom: 32 * k }]} />
      <View style={[d.sproutLeafR, { width: 20 * k, height: 13 * k, right: 12 * k, bottom: 38 * k }]} />
    </View>
  )
}

export function StatusDot({ status = 'neutral' }) {
  const color =
    status === 'done' ? T.c.accent : status === 'active' ? T.c.gold : status === 'bad' ? T.c.danger : T.c.lineStrong
  return <View style={[d.dot, { backgroundColor: color }]} />
}

export function AchievementGlyph({ unlocked = false }) {
  return (
    <View
      style={[
        d.seal,
        { borderColor: unlocked ? T.c.gold : T.c.line, backgroundColor: unlocked ? T.c.goldSoft : T.c.raised },
      ]}
    >
      <View style={[d.sealCore, { backgroundColor: unlocked ? T.c.gold : T.c.faint }]} />
    </View>
  )
}

const d = StyleSheet.create({
  brand: { backgroundColor: T.c.accentSoft, borderWidth: 1, borderColor: 'rgba(74,222,128,0.35)', overflow: 'hidden' },
  brandStem: { position: 'absolute', alignSelf: 'center', borderRadius: 2, backgroundColor: T.c.accent },
  brandLeafL: { position: 'absolute', backgroundColor: T.c.accent, borderTopLeftRadius: 99, borderBottomRightRadius: 99, transform: [{ rotate: '-30deg' }], opacity: 0.95 },
  brandLeafR: { position: 'absolute', backgroundColor: '#86EFAC', borderTopRightRadius: 99, borderBottomLeftRadius: 99, transform: [{ rotate: '30deg' }] },

  icon: { width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },

  leafShape: { width: 15, height: 15, borderTopRightRadius: 14, borderBottomLeftRadius: 14, borderTopLeftRadius: 3, borderBottomRightRadius: 3, transform: [{ rotate: '-8deg' }], marginBottom: 2 },
  leafStem: { position: 'absolute', bottom: 0, width: 2, height: 6, borderRadius: 1, transform: [{ rotate: '24deg' }] },

  corner: { position: 'absolute', width: 7, height: 7, borderColor: 'transparent' },
  cTL: { top: 1, left: 1, borderTopWidth: 2, borderLeftWidth: 2, borderTopLeftRadius: 3 },
  cTR: { top: 1, right: 1, borderTopWidth: 2, borderRightWidth: 2, borderTopRightRadius: 3 },
  cBL: { bottom: 1, left: 1, borderBottomWidth: 2, borderLeftWidth: 2, borderBottomLeftRadius: 3 },
  cBR: { bottom: 1, right: 1, borderBottomWidth: 2, borderRightWidth: 2, borderBottomRightRadius: 3 },
  scanDot: { width: 6, height: 6, borderRadius: 3 },

  personHead: { width: 8, height: 8, borderRadius: 4, marginBottom: 2 },
  personBody: { width: 16, height: 9, borderTopLeftRadius: 8, borderTopRightRadius: 8 },

  capTop: { position: 'absolute', top: 3, width: 15, height: 15, borderRadius: 3, transform: [{ scaleY: 0.55 }, { rotate: '45deg' }] },
  capBase: { position: 'absolute', bottom: 4, width: 9, height: 6, borderRadius: 2 },
  capTassel: { position: 'absolute', top: 8, right: 2, width: 2, height: 7, borderRadius: 1, opacity: 0.7 },

  qBubble: { width: 17, height: 15, borderWidth: 2, borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginBottom: 3 },
  qMark: { fontSize: 9, fontWeight: '900', lineHeight: 11 },
  qTail: { position: 'absolute', bottom: 2, left: 6, width: 4, height: 4, borderRadius: 1, transform: [{ rotate: '45deg' }] },

  dexGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 3, width: 19, height: 19 },
  dexCell: { width: 8, height: 8, borderRadius: 2.5 },

  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 3 },
  bar: { width: 4, borderRadius: 2 },

  camera: { borderWidth: 2.4, alignItems: 'center', justifyContent: 'center' },
  lens: { borderWidth: 2.2 },

  sprout: { backgroundColor: T.c.photo, alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden' },
  sproutStem: { position: 'absolute', borderRadius: 2, backgroundColor: T.c.accent },
  sproutLeafL: { position: 'absolute', backgroundColor: T.c.accent, borderTopLeftRadius: 99, borderBottomRightRadius: 99, transform: [{ rotate: '-28deg' }], opacity: 0.9 },
  sproutLeafR: { position: 'absolute', backgroundColor: '#86EFAC', borderTopRightRadius: 99, borderBottomLeftRadius: 99, transform: [{ rotate: '28deg' }] },

  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },

  seal: { width: 34, height: 34, borderRadius: 17, borderWidth: 1.6, alignItems: 'center', justifyContent: 'center' },
  sealCore: { width: 12, height: 12, borderRadius: 6 },
})
