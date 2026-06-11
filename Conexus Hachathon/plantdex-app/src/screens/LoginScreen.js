import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar as RNStatusBar } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { BrandMark } from '../components/DesignElements'
import { C } from '../theme'

// Login is now a mockup. The Google button hands a mock profile to onGoogle;
// the real OAuth + accounts DB are wired by the backend team. Role selection
// (student / teacher) happens AFTER login on RoleSelectScreen.
//
// A guest can skip login entirely and still use the plant scanner + join quizzes.
const MOCK_GOOGLE_PROFILE = {
  name: 'Alex Green',
  email: 'alex.green@school.edu',
  avatarColor: '#3a9d5d',
}

export default function LoginScreen({ onGoogle, onGuest }) {
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="dark" />
      <View style={s.wrap}>
        <View style={s.heroCard}>
          <BrandMark size={58} dark />
          <Text style={s.logo}>PlantDex Classroom</Text>
          <Text style={s.sub}>Plant identification, lesson missions, and interactive quizzes in one field-learning app.</Text>
        </View>

        <View style={s.card}>
          <Text style={s.label}>Sign in to teach or join a class</Text>

          <TouchableOpacity style={s.googleBtn} onPress={() => onGoogle?.(MOCK_GOOGLE_PROFILE)} activeOpacity={0.85}>
            <GoogleMark />
            <Text style={s.googleText}>Continue with Google</Text>
          </TouchableOpacity>

          <Text style={s.demoNote}>Demo sign-in — connects to real Google accounts once the backend is wired up.</Text>

          <View style={s.divider}>
            <View style={s.line} />
            <Text style={s.or}>or</Text>
            <View style={s.line} />
          </View>

          <TouchableOpacity style={s.guestBtn} onPress={() => onGuest?.()} activeOpacity={0.85}>
            <Text style={s.guestText}>Continue as guest</Text>
          </TouchableOpacity>
          <Text style={s.guestNote}>Use the plant scanner and join quizzes — no account needed.</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

// Simple Google "G" built from shapes (no image asset / extra dependency).
function GoogleMark() {
  return (
    <View style={s.gWrap}>
      <Text style={s.gText}>G</Text>
    </View>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.cream, paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0 },
  wrap: { flex: 1, padding: 20, justifyContent: 'center' },
  heroCard: { backgroundColor: '#eaf5ed', borderRadius: 32, padding: 26, alignItems: 'center', marginBottom: 18, borderWidth: 1, borderColor: 'rgba(44,122,71,0.14)' },
  logo: { color: C.bark, fontSize: 30, fontWeight: '900', marginTop: 16, textAlign: 'center' },
  sub: { color: C.muted, textAlign: 'center', lineHeight: 21, marginTop: 8, maxWidth: 300 },
  card: { backgroundColor: C.white, borderRadius: 28, padding: 20, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 3 },
  label: { color: C.bark, fontWeight: '900', marginBottom: 14, textAlign: 'center' },
  googleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: C.white, borderWidth: 1.5, borderColor: C.line, borderRadius: 16, paddingVertical: 15 },
  googleText: { color: C.bark, fontWeight: '900', fontSize: 16 },
  gWrap: { width: 26, height: 26, borderRadius: 999, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#4285F4' },
  gText: { color: '#4285F4', fontWeight: '900', fontSize: 16 },
  demoNote: { color: C.muted, fontSize: 12, textAlign: 'center', marginTop: 10, lineHeight: 17 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 18 },
  line: { flex: 1, height: 1, backgroundColor: C.line },
  or: { color: C.muted, fontWeight: '800' },
  guestBtn: { backgroundColor: C.leafDark, borderRadius: 16, paddingVertical: 15, alignItems: 'center' },
  guestText: { color: C.cream, fontWeight: '900', fontSize: 16 },
  guestNote: { color: C.muted, fontSize: 12, textAlign: 'center', marginTop: 10, lineHeight: 17 },
})
