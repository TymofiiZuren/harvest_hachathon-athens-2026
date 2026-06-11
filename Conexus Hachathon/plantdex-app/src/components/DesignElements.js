import { View, Text, StyleSheet } from 'react-native'
import { C } from '../theme'

export function BrandMark({ size = 34, dark = false }) {
  const scale = size / 34
  const leafColor = dark ? C.leafDark : C.leaf
  const stemColor = dark ? C.bark : C.cream
  return (
    <View style={[d.brand, { width: size, height: size, borderRadius: size / 2, backgroundColor: dark ? '#eaf5ed' : 'rgba(255,255,255,0.16)' }]}> 
      <View style={[d.stem, { height: 18 * scale, backgroundColor: stemColor }]} />
      <View style={[d.leafLeft, { width: 15 * scale, height: 10 * scale, backgroundColor: leafColor }]} />
      <View style={[d.leafRight, { width: 15 * scale, height: 10 * scale, backgroundColor: C.leafLight }]} />
    </View>
  )
}

export function PlantPlaceholder({ size = 74 }) {
  return (
    <View style={[d.plantWrap, { width: size, height: size }]}> 
      <View style={d.soil} />
      <View style={d.plantStem} />
      <View style={d.plantLeafA} />
      <View style={d.plantLeafB} />
      <View style={d.plantLeafC} />
    </View>
  )
}

export function NavGlyph({ type, active = false }) {
  const color = active ? C.leafDark : '#b9b0a2'
  let glyph
  if (type === 'scan') glyph = <CameraGlyph color={color} small />
  else if (type === 'collection') glyph = <BookGlyph color={color} />
  else if (type === 'dashboard') glyph = <DashboardGlyph color={color} />
  else if (type === 'quizzes' || type === 'quiz' || type === 'join') glyph = <QuizGlyph color={color} />
  else glyph = <ClassGlyph color={color} />
  return <View style={[d.navGlyphFrame, active && d.navGlyphFrameActive]}>{glyph}</View>
}

export function CameraGlyph({ color = C.leafDark, small = false }) {
  const w = small ? 21 : 42
  return (
    <View style={[d.camera, { width: w, height: w * 0.72, borderColor: color }]}> 
      <View style={[d.cameraTop, { borderBottomColor: color }]} />
      <View style={[d.lens, { borderColor: color }]} />
    </View>
  )
}

export function BookGlyph({ color = C.leafDark }) {
  return (
    <View style={[d.book, { borderColor: color }]}> 
      <View style={[d.bookLine, { backgroundColor: color }]} />
      <View style={[d.bookLineSmall, { backgroundColor: color }]} />
    </View>
  )
}

export function ClassGlyph({ color = C.leafDark }) {
  return (
    <View style={d.classIcon}> 
      <View style={[d.person, { backgroundColor: color }]} />
      <View style={[d.personSmall, { backgroundColor: color }]} />
      <View style={[d.board, { borderColor: color }]} />
    </View>
  )
}

export function DashboardGlyph({ color = C.leafDark }) {
  return (
    <View style={d.dashIcon}> 
      {[0, 1, 2, 3].map((n) => <View key={n} style={[d.dashCell, { backgroundColor: color }]} />)}
    </View>
  )
}

export function QuizGlyph({ color = C.leafDark }) {
  return (
    <View style={[d.quiz, { borderColor: color }]}>
      <View style={[d.quizDot, { backgroundColor: color }]} />
      <View style={[d.quizDot, { backgroundColor: color }]} />
      <View style={[d.quizDot, { backgroundColor: color }]} />
      <View style={[d.quizDotWide, { backgroundColor: color }]} />
    </View>
  )
}

export function StatusDot({ status = 'neutral' }) {
  const color = status === 'done' ? C.leaf : status === 'active' ? C.sun : status === 'bad' ? '#b5562a' : C.line
  return <View style={[d.dot, { backgroundColor: color }]} />
}

export function AchievementGlyph({ unlocked = false }) {
  return (
    <View style={[d.achievement, { borderColor: unlocked ? C.sun : C.line, backgroundColor: unlocked ? 'rgba(244,185,66,0.16)' : '#f2eee5' }]}> 
      <View style={[d.achievementCore, { backgroundColor: unlocked ? C.sun : '#c9c0b2' }]} />
    </View>
  )
}

export function StatIcon({ label, tone = 'light' }) {
  return (
    <View style={[d.statIcon, tone === 'dark' && d.statIconDark]}>
      <Text style={[d.statLabel, tone === 'dark' && d.statLabelDark]}>{label}</Text>
    </View>
  )
}

const d = StyleSheet.create({
  brand: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  stem: { position: 'absolute', width: 3, bottom: 7, borderRadius: 3 },
  leafLeft: { position: 'absolute', left: 8, top: 11, borderTopLeftRadius: 14, borderBottomRightRadius: 14, transform: [{ rotate: '-28deg' }] },
  leafRight: { position: 'absolute', right: 7, top: 8, borderTopRightRadius: 14, borderBottomLeftRadius: 14, transform: [{ rotate: '28deg' }] },
  plantWrap: { alignItems: 'center', justifyContent: 'flex-end' },
  soil: { width: '74%', height: 10, borderRadius: 999, backgroundColor: 'rgba(91,70,54,0.20)', marginBottom: 5 },
  plantStem: { position: 'absolute', width: 5, height: '58%', bottom: 13, borderRadius: 999, backgroundColor: C.leafDark },
  plantLeafA: { position: 'absolute', width: '40%', height: '20%', left: '17%', bottom: '44%', borderTopLeftRadius: 999, borderBottomRightRadius: 999, backgroundColor: C.leaf, transform: [{ rotate: '-24deg' }] },
  plantLeafB: { position: 'absolute', width: '42%', height: '21%', right: '15%', bottom: '55%', borderTopRightRadius: 999, borderBottomLeftRadius: 999, backgroundColor: C.leafLight, transform: [{ rotate: '24deg' }] },
  plantLeafC: { position: 'absolute', width: '35%', height: '18%', right: '21%', bottom: '34%', borderTopRightRadius: 999, borderBottomLeftRadius: 999, backgroundColor: C.leaf, transform: [{ rotate: '16deg' }] },
  camera: { borderWidth: 2.5, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  cameraTop: { position: 'absolute', top: -6, left: 5, width: 11, height: 7, borderLeftWidth: 5, borderRightWidth: 5, borderBottomWidth: 7, borderLeftColor: 'transparent', borderRightColor: 'transparent' },
  lens: { width: 12, height: 12, borderRadius: 8, borderWidth: 2 },
  navGlyphFrame: { width: 28, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  navGlyphFrameActive: { backgroundColor: 'rgba(58,157,93,0.12)' },
  book: { width: 21, height: 20, borderWidth: 2, borderRadius: 5, paddingTop: 4, paddingHorizontal: 4 },
  bookLine: { height: 2, borderRadius: 3, width: '86%', marginBottom: 4 },
  bookLineSmall: { height: 2, borderRadius: 3, width: '58%' },
  classIcon: { width: 23, height: 21 },
  person: { position: 'absolute', width: 8, height: 8, borderRadius: 8, left: 2, top: 1 },
  personSmall: { position: 'absolute', width: 7, height: 7, borderRadius: 7, left: 13, top: 4, opacity: 0.55 },
  board: { position: 'absolute', width: 22, height: 10, borderWidth: 2, borderRadius: 4, bottom: 0, left: 1 },
  dashIcon: { width: 21, height: 21, flexDirection: 'row', flexWrap: 'wrap', gap: 3 },
  dashCell: { width: 9, height: 9, borderRadius: 3, opacity: 0.86 },
  quiz: { width: 21, height: 21, borderWidth: 2, borderRadius: 6, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 2, padding: 3 },
  quizDot: { width: 5, height: 5, borderRadius: 5 },
  quizDotWide: { width: 13, height: 3, borderRadius: 3 },
  dot: { width: 14, height: 14, borderRadius: 14, marginRight: 10 },
  achievement: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  achievementCore: { width: 14, height: 14, borderRadius: 14 },
  statIcon: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.18)' },
  statIconDark: { backgroundColor: C.sun },
  statLabel: { color: C.cream, fontSize: 10, fontWeight: '900' },
  statLabelDark: { color: C.barkDark },
})
