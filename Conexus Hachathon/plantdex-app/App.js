import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar as RNStatusBar } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import ScanScreen from './src/screens/ScanScreen'
import CollectionScreen from './src/screens/CollectionScreen'
import { useCollection, DEX_GOAL } from './src/store/useCollection'
import { C } from './src/theme'

export default function App() {
  const [tab, setTab] = useState('scan') // 'scan' | 'collection'
  const points = useCollection((s) => s.points)
  const count = useCollection((s) => Object.keys(s.plants).length)

  return (
    <SafeAreaView style={st.safe}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={st.header}>
        <View style={st.row}>
          <Text style={{ fontSize: 22 }}>🌿</Text>
          <Text style={st.logo}>PlantDex</Text>
        </View>
        <View style={st.row}>
          <View style={st.pill}><Text style={st.pillText}>📖 {count}/{DEX_GOAL}</Text></View>
          <View style={[st.pill, st.pillSun]}><Text style={st.pillTextDark}>⭐ {points}</Text></View>
        </View>
      </View>

      {/* Active screen */}
      <View style={st.body}>
        {tab === 'scan'
          ? <ScanScreen onGoCollection={() => setTab('collection')} />
          : <CollectionScreen />}
      </View>

      {/* Bottom nav */}
      <View style={st.nav}>
        <NavItem label="Scan" icon="📷" active={tab === 'scan'} onPress={() => setTab('scan')} />
        <NavItem label="Collection" icon="📖" active={tab === 'collection'} onPress={() => setTab('collection')} />
      </View>
    </SafeAreaView>
  )
}

function NavItem({ label, icon, active, onPress }) {
  return (
    <TouchableOpacity style={st.navItem} onPress={onPress} activeOpacity={0.7}>
      <Text style={[st.navIcon, active && st.navIconActive]}>{icon}</Text>
      <Text style={[st.navLabel, { color: active ? C.leafDark : '#a8a194' }]}>{label}</Text>
    </TouchableOpacity>
  )
}

const st = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.cream, paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0 },
  header: {
    backgroundColor: C.leafDark, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: { color: C.cream, fontSize: 20, fontWeight: '800' },
  pill: { backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 },
  pillSun: { backgroundColor: C.sun },
  pillText: { color: C.cream, fontWeight: '800', fontSize: 13 },
  pillTextDark: { color: C.barkDark, fontWeight: '800', fontSize: 13 },
  body: { flex: 1 },
  nav: { flexDirection: 'row', backgroundColor: C.white, borderTopWidth: 1, borderTopColor: C.line, paddingBottom: 6 },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 8, gap: 2 },
  navIcon: { fontSize: 24, opacity: 0.6 },
  navIconActive: { opacity: 1 },
  navLabel: { fontSize: 12, fontWeight: '700' },
})
