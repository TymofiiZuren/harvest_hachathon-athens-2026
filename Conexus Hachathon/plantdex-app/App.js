import { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, Animated, PanResponder } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import ScanScreen from './src/screens/ScanScreen'
import CollectionScreen from './src/screens/CollectionScreen'
import ClassroomScreen from './src/screens/ClassroomScreen'
import LoginScreen from './src/screens/LoginScreen'
import TeacherDashboardScreen from './src/screens/TeacherDashboardScreen'
import QuizScreen from './src/screens/QuizScreen'
import LearnScreen from './src/screens/LearnScreen'
import ProfileScreen from './src/screens/ProfileScreen'
import { useCollection } from './src/store/useCollection'
import { BrandMark, NavGlyph } from './src/components/DesignElements'
import { Press } from './src/components/ui'
import { T, F } from './src/theme'

export default function App() {
  const currentUser = useCollection((s) => s.currentUser)
  const points = useCollection((s) => s.points)
  const pfp = useCollection((s) => s.profile?.pfp)
  const [tab, setTab] = useState('classroom')

  useEffect(() => {
    if (currentUser?.role === 'teacher') setTab('dashboard')
    if (currentUser?.role === 'student') setTab('classroom')
  }, [currentUser?.role])

  if (!currentUser) {
    return (
      <SafeAreaProvider>
        <LoginScreen />
      </SafeAreaProvider>
    )
  }

  const navItems =
    currentUser.role === 'teacher'
      ? [
          { key: 'dashboard', label: 'Dashboard' },
          { key: 'quizzes', label: 'Quizzes' },
          { key: 'classroom', label: 'Class' },
          { key: 'collection', label: 'Dex' },
          { key: 'profile', label: 'Profile' },
        ]
      : [
          { key: 'classroom', label: 'Home' },
          { key: 'scan', label: 'Scan' },
          { key: 'learn', label: 'Learn' },
          { key: 'collection', label: 'Dex' },
          { key: 'profile', label: 'Profile' },
        ]

  return (
    <SafeAreaProvider>
      <SafeAreaView style={st.safe} edges={['top', 'left', 'right', 'bottom']}>
        <StatusBar style="light" />

        <View style={st.topBar}>
          <View style={st.brandRow}>
            <BrandMark size={30} />
            <Text style={st.brand}>PlantDex</Text>
          </View>
          <Press style={st.userChip} onPress={() => setTab('profile')}>
            <View style={st.avatar}>
              {pfp ? (
                <Text style={st.avatarPfp}>{pfp}</Text>
              ) : (
                <Text style={st.avatarText}>{(currentUser.name || '?').charAt(0).toUpperCase()}</Text>
              )}
            </View>
            <View>
              <Text style={st.userName} numberOfLines={1}>{currentUser.name}</Text>
              <Text style={st.userPoints}>
                {currentUser.role === 'teacher' ? 'View profile' : `${points} pts`}
              </Text>
            </View>
          </Press>
        </View>

        <View style={st.body}>
          {tab === 'dashboard' && <TeacherDashboardScreen />}
          {tab === 'quizzes' && <QuizScreen role={currentUser.role} />}
          {tab === 'learn' && <LearnScreen role={currentUser.role} />}
          {tab === 'scan' && <ScanScreen onGoCollection={() => setTab('collection')} />}
          {tab === 'classroom' && (
            <ClassroomScreen
              role={currentUser.role}
              onGoScan={() => setTab('scan')}
              onGoDashboard={() => setTab('dashboard')}
            />
          )}
          {tab === 'collection' && <CollectionScreen />}
          {tab === 'profile' && <ProfileScreen />}
        </View>

        <View style={st.navWrap} pointerEvents="box-none">
          <GlassNav items={navItems} tab={tab} onSelect={setTab} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

// ─── Liquid-glass tab bar ─────────────────────────────────────────────────────
// A frosted pill slides on a spring to the active tab. You can also drag your
// finger along the bar — the pill tracks the touch and snaps to the nearest
// tab on release, iOS-26 liquid-glass style.
const NAV_PAD = 6
const NAV_GAP = 4

function GlassNav({ items, tab, onSelect }) {
  const [navW, setNavW] = useState(0)
  const slide = useRef(new Animated.Value(NAV_PAD)).current
  const grab = useRef(new Animated.Value(1)).current
  const navRef = useRef(null)
  const navX = useRef(0)
  // Latest geometry/callback for the PanResponder (created once) to read.
  const geom = useRef({ itemW: 0, navW: 0, keys: [] })
  const selRef = useRef(onSelect)
  selRef.current = onSelect

  const itemW = navW > 0 ? (navW - NAV_PAD * 2 - NAV_GAP * (items.length - 1)) / items.length : 0
  const index = Math.max(0, items.findIndex((it) => it.key === tab))
  geom.current = { itemW, navW, keys: items.map((it) => it.key) }

  const slideTo = (idx, iw) =>
    Animated.spring(slide, {
      toValue: NAV_PAD + idx * (iw + NAV_GAP),
      useNativeDriver: true,
      speed: 16,
      bounciness: 9,
    }).start()

  useEffect(() => {
    if (itemW > 0) slideTo(index, itemW)
  }, [index, itemW])

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10,
      onMoveShouldSetPanResponderCapture: (_, g) => Math.abs(g.dx) > 10,
      onPanResponderGrant: () => {
        Animated.spring(grab, { toValue: 1.07, useNativeDriver: true, speed: 20, bounciness: 6 }).start()
      },
      onPanResponderMove: (_, g) => {
        const { itemW: iw, navW: nw } = geom.current
        if (iw <= 0) return
        const x = g.moveX - navX.current - iw / 2
        slide.setValue(Math.min(nw - NAV_PAD - iw, Math.max(NAV_PAD, x)))
      },
      onPanResponderRelease: (_, g) => releasePill(g.moveX),
      onPanResponderTerminate: (_, g) => releasePill(g.moveX),
    })
  ).current

  function releasePill(moveX) {
    const { itemW: iw, keys } = geom.current
    if (iw <= 0) return
    const rel = moveX - navX.current - NAV_PAD
    const idx = Math.min(keys.length - 1, Math.max(0, Math.round((rel - iw / 2) / (iw + NAV_GAP))))
    Animated.spring(grab, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 6 }).start()
    slideTo(idx, iw)
    selRef.current(keys[idx])
  }

  return (
    <View
      ref={navRef}
      style={st.nav}
      onLayout={(e) => {
        setNavW(e.nativeEvent.layout.width)
        navRef.current?.measureInWindow((x) => {
          navX.current = x
        })
      }}
      {...pan.panHandlers}
    >
      {itemW > 0 && (
        <Animated.View
          style={[st.glassPill, { width: itemW, transform: [{ translateX: slide }, { scale: grab }] }]}
        >
          <View style={st.glassSheen} />
        </Animated.View>
      )}
      {items.map((item) => {
        const active = tab === item.key
        return (
          <Press key={item.key} style={st.navItem} onPress={() => onSelect(item.key)}>
            <NavGlyph type={item.key} active={active} />
            <Text style={[st.navLabel, active && st.navLabelActive]}>{item.label}</Text>
          </Press>
        )
      })}
    </View>
  )
}

const st = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.c.bg },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 10, paddingBottom: 8 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brand: { ...F.h2, fontSize: 18, letterSpacing: -0.3 },
  userChip: { flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: T.c.surface, borderWidth: 1, borderColor: T.c.line, borderRadius: T.r.full, paddingVertical: 5, paddingLeft: 5, paddingRight: 14, maxWidth: 180 },
  avatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: T.c.accentSoft, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: T.c.accent, fontWeight: '800', fontSize: 13 },
  avatarPfp: { fontSize: 15 },
  userName: { ...F.bodyStrong, fontSize: 12, lineHeight: 15 },
  userPoints: { fontSize: 10, color: T.c.gold, fontWeight: '800' },
  body: { flex: 1 },
  navWrap: { position: 'absolute', left: 16, right: 16, bottom: 14 },
  nav: { flexDirection: 'row', backgroundColor: 'rgba(28,40,32,0.92)', borderRadius: T.r.lg, borderWidth: 1, borderColor: T.c.lineStrong, padding: NAV_PAD, gap: NAV_GAP, shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 12 },
  glassPill: { position: 'absolute', top: NAV_PAD, bottom: NAV_PAD, left: 0, borderRadius: T.r.md, backgroundColor: 'rgba(74,222,128,0.14)', borderWidth: 1, borderColor: 'rgba(74,222,128,0.35)', overflow: 'hidden' },
  glassSheen: { position: 'absolute', top: 1.5, left: 10, right: 10, height: 9, borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.09)' },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: T.r.md, paddingVertical: 8, gap: 3 },
  navLabel: { fontSize: 10, fontWeight: '700', color: T.c.faint },
  navLabelActive: { color: T.c.accent },
})
