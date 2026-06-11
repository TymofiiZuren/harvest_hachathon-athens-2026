import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import ScanScreen from './src/screens/ScanScreen'
import CollectionScreen from './src/screens/CollectionScreen'
import ClassroomScreen from './src/screens/ClassroomScreen'
import LoginScreen from './src/screens/LoginScreen'
import TeacherDashboardScreen from './src/screens/TeacherDashboardScreen'
import QuizScreen from './src/screens/QuizScreen'
import { useCollection, DEX_GOAL } from './src/store/useCollection'
import { unlockedAchievementCount } from './src/data/achievements'
import { BrandMark, NavGlyph } from './src/components/DesignElements'
import { C } from './src/theme'

export default function App() {
  const currentUser = useCollection((s) => s.currentUser)
  const logout = useCollection((s) => s.logout)
  const [tab, setTab] = useState('classroom')
  const points = useCollection((s) => s.points)
  const count = useCollection((s) => Object.keys(s.plants || {}).length)
  const gardenHealth = useCollection((s) => s.gardenHealth)
  const completedTaskCount = useCollection((s) => Object.keys(s.completedTasks || {}).length)
  const lessonTaskCount = useCollection((s) => (s.lessonTasks || []).length)
  const achievementCount = useCollection((s) => unlockedAchievementCount(s))

  function handleLogout() {
    logout()
  }

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

  const navItems = currentUser.role === 'teacher'
    ? [
        { key: 'dashboard', label: 'Dashboard' },
        { key: 'quizzes', label: 'Quizzes' },
        { key: 'classroom', label: 'Classroom' },
        { key: 'collection', label: 'Collection' },
      ]
    : [
        { key: 'classroom', label: 'Classroom' },
        { key: 'quizzes', label: 'Quizzes' },
        { key: 'scan', label: 'Scan' },
        { key: 'collection', label: 'Collection' },
      ]

  return (
    <SafeAreaProvider>
      <SafeAreaView style={st.safe} edges={['top', 'left', 'right']}>
      <StatusBar style="light" />

      <View style={st.header}>
        <View style={st.brandRow}>
          <BrandMark size={34} />
          <View>
            <Text style={st.logo}>PlantDex</Text>
            <Text style={st.userLine}>{currentUser.name} / {currentUser.role}</Text>
          </View>
        </View>
        <TouchableOpacity style={st.logoutBtn} onPress={handleLogout}>
          <Text style={st.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>

      <View style={st.statsPanel}>
        <View style={st.progressCard}>
          <View>
            <Text style={st.progressLabel}>Class progress</Text>
            <Text style={st.progressTitle}>{completedTaskCount}/{lessonTaskCount} missions complete</Text>
          </View>
          <View style={st.pointsBubble}>
            <Text style={st.pointsValue}>{points}</Text>
            <Text style={st.pointsLabel}>PTS</Text>
          </View>
        </View>
        <View style={st.miniStatsRow}>
          <StatPill label="Dex" value={`${count}/${DEX_GOAL}`} />
          <StatPill label="Tasks" value={`${completedTaskCount}/${lessonTaskCount}`} />
          <StatPill label="Badges" value={achievementCount} />
          <StatPill label="Health" value={`${gardenHealth}/3`} />
        </View>
      </View>

      <View style={st.body}>
        {tab === 'dashboard' && <TeacherDashboardScreen />}
        {tab === 'quizzes' && <QuizScreen role={currentUser.role} />}
        {tab === 'scan' && <ScanScreen onGoCollection={() => setTab('collection')} />}
        {tab === 'classroom' && <ClassroomScreen role={currentUser.role} onGoScan={() => setTab('scan')} onGoDashboard={() => setTab('dashboard')} />}
        {tab === 'collection' && <CollectionScreen />}
      </View>

      <View style={st.nav}>
        {navItems.map((item) => (
          <NavItem key={item.key} label={item.label} type={item.key} active={tab === item.key} onPress={() => setTab(item.key)} />
        ))}
      </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

function StatPill({ label, value }) {
  return (
    <View style={st.pill}>
      <Text style={st.pillValue}>{value}</Text>
      <Text style={st.pillLabel}>{label}</Text>
    </View>
  )
}

function NavItem({ label, type, active, onPress }) {
  return (
    <TouchableOpacity style={st.navItem} onPress={onPress} activeOpacity={0.75}>
      <NavGlyph type={type} active={active} />
      <Text style={[st.navLabel, { color: active ? C.leafDark : '#a8a194' }]}>{label}</Text>
    </TouchableOpacity>
  )
}

const st = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.cream },
  header: { backgroundColor: C.leafDark, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 14, paddingBottom: 12 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: { color: C.cream, fontSize: 21, fontWeight: '900', letterSpacing: 0.2 },
  userLine: { color: 'rgba(246,244,236,0.75)', fontSize: 11, fontWeight: '800', textTransform: 'capitalize' },
  logoutBtn: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.28)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
  logoutText: { color: C.cream, fontWeight: '900', fontSize: 12 },
  statsPanel: { backgroundColor: C.leafDark, paddingHorizontal: 16, paddingBottom: 14 },
  progressCard: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 22, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  progressLabel: { color: 'rgba(246,244,236,0.72)', fontWeight: '900', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.7 },
  progressTitle: { color: C.cream, fontWeight: '900', fontSize: 16, marginTop: 3 },
  pointsBubble: { minWidth: 70, height: 58, borderRadius: 18, backgroundColor: C.sun, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  pointsValue: { color: C.barkDark, fontWeight: '900', fontSize: 20 },
  pointsLabel: { color: C.barkDark, fontWeight: '900', fontSize: 10, opacity: 0.74 },
  miniStatsRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  pill: { flex: 1, backgroundColor: 'rgba(255,255,255,0.10)', borderRadius: 16, paddingVertical: 10, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center', minHeight: 54 },
  pillValue: { color: C.cream, fontWeight: '900', fontSize: 14 },
  pillLabel: { color: 'rgba(246,244,236,0.68)', fontWeight: '900', fontSize: 10, marginTop: 2 },
  body: { flex: 1 },
  nav: { flexDirection: 'row', backgroundColor: C.white, borderTopWidth: 1, borderTopColor: C.line, paddingBottom: 4, paddingTop: 3, minHeight: 50 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 1, gap: 0 },
  navLabel: { fontSize: 8, fontWeight: '900', lineHeight: 10 },
})
