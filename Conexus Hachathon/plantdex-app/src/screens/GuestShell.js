import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar as RNStatusBar } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import ScanScreen from './ScanScreen'
import CollectionScreen from './CollectionScreen'
import QuizScreen from './QuizScreen'
import { BrandMark, NavGlyph } from '../components/DesignElements'
import { C } from '../theme'

// Shell for guests (no login). The plant scanner stays fully usable here in
// "free" mode (no classroom missions), plus quiz joining and a local collection.
export default function GuestShell({ onExit }) {
  const [tab, setTab] = useState('scan')
  const navItems = [
    { key: 'scan', label: 'Scan' },
    { key: 'quizzes', label: 'Quizzes' },
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
            <Text style={st.userLine}>Guest mode</Text>
          </View>
        </View>
        <TouchableOpacity style={st.signInBtn} onPress={onExit}>
          <Text style={st.signInText}>Sign in</Text>
        </TouchableOpacity>
      </View>

      <View style={st.body}>
        {tab === 'scan' && <ScanScreen freeScan onGoCollection={() => setTab('collection')} />}
        {tab === 'quizzes' && <QuizScreen role="guest" />}
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
  header: { backgroundColor: C.leafDark, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 13, paddingBottom: 12 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: { color: C.cream, fontSize: 21, fontWeight: '900', letterSpacing: 0.2 },
  userLine: { color: 'rgba(246,244,236,0.75)', fontSize: 11, fontWeight: '800' },
  signInBtn: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.28)', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7 },
  signInText: { color: C.cream, fontWeight: '900', fontSize: 12 },
  body: { flex: 1 },
  nav: { flexDirection: 'row', backgroundColor: C.white, borderTopWidth: 1, borderTopColor: C.line, paddingBottom: 7, paddingTop: 5 },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 6, gap: 3 },
  navLabel: { fontSize: 11, fontWeight: '900' },
})
