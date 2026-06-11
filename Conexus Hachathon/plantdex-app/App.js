import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar as RNStatusBar } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import ScanScreen from './src/screens/ScanScreen'
import CollectionScreen from './src/screens/CollectionScreen'
import ClassroomScreen from './src/screens/ClassroomScreen'
import LoginScreen from './src/screens/LoginScreen'
import TeacherDashboardScreen from './src/screens/TeacherDashboardScreen'
import { useCollection, DEX_GOAL } from './src/store/useCollection'
import { unlockedAchievementCount } from './src/data/achievements'
import { BrandMark, NavGlyph, StatIcon } from './src/components/DesignElements'
import { C } from './src/theme'

export default function App() {
  const currentUser = useCollection((s) => s.currentUser)
  const logout = useCollection((s) => s.logout)
  const [tab, setTab] = useState('classroom')
  const points = useCollection((s) => s.points)
  const count = useCollection((s) => Object.keys(s.plants || {}).length)
  const gardenHealth = useCollection((s) => s.gardenHealth)
  const achievementCount = useCollection((s) => unlockedAchievementCount(s))

  useEffect(() => {
    if (currentUser?.role === 'teacher') setTab('dashboard')
    if (currentUser?.role === 'student') setTab('classroom')
  }, [currentUser?.role])

  if (!currentUser) return <LoginScreen />

  const navItems = currentUser.role === 'teacher'
    ? [
        { key: 'dashboard', label: 'Dashboard' },
        { key: 'classroom', label: 'Classroom' },
        { key: 'collection', label: 'Collection' },
      ]
    : [
        { key: 'classroom', label: 'Classroom' },
        { key: 'scan', label: 'Scan' },
        { key: 'collection', label: 'Collection' },
      ]

  return (
    <SafeAreaView style={st.safe}>
      <StatusBar style="light" />

      <View style={st.header}>
        <View style={st.brandRow}>
          <BrandMark size={34} />
          <View>
            <Text style={st.logo}>PlantDex</Text>
            <Text style={st.userLine}>{currentUser.name} / {currentUser.role}</Text>
          </View>
        </View>
        <TouchableOpacity style={st.logoutBtn} onPress={logout}>
          <Text style={st.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>

      <View style={st.statsBar}>
        <StatPill label="DEX" value={`${count}/${DEX_GOAL}`} />
        <StatPill label="ACH" value={achievementCount} />
        <StatPill label="HLT" value={gardenHealth} />
        <StatPill label="PTS" value={points} sun />
      </View>

      <View style={st.body}>
        {tab === 'dashboard' && <TeacherDashboardScreen />}
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
  )
}

function StatPill({ label, value, sun = false }) {
  return (
    <View style={[st.pill, sun && st.pillSun]}>
      <StatIcon label={label} tone={sun ? 'dark' : 'light'} />
      <Text style={sun ? st.pillTextDark : st.pillText}>{value}</Text>
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
  safe: { flex: 1, backgroundColor: C.cream, paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0 },
  header: { backgroundColor: C.leafDark, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 13, paddingBottom: 10 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: { color: C.cream, fontSize: 21, fontWeight: '900', letterSpacing: 0.2 },
  userLine: { color: 'rgba(246,244,236,0.75)', fontSize: 11, fontWeight: '800', textTransform: 'capitalize' },
  logoutBtn: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.28)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
  logoutText: { color: C.cream, fontWeight: '900', fontSize: 12 },
  statsBar: { flexDirection: 'row', gap: 8, backgroundColor: C.leafDark, paddingHorizontal: 16, paddingBottom: 12 },
  pill: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.13)', borderRadius: 999, paddingVertical: 6 },
  pillSun: { backgroundColor: C.sun },
  pillText: { color: C.cream, fontWeight: '900', fontSize: 12 },
  pillTextDark: { color: C.barkDark, fontWeight: '900', fontSize: 12 },
  body: { flex: 1 },
  nav: { flexDirection: 'row', backgroundColor: C.white, borderTopWidth: 1, borderTopColor: C.line, paddingBottom: 7, paddingTop: 5 },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 6, gap: 3 },
  navLabel: { fontSize: 11, fontWeight: '900' },
})
