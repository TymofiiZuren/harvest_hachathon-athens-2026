import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar as RNStatusBar } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { BrandMark } from '../components/DesignElements'
import { useCollection } from '../store/useCollection'
import { C } from '../theme'

// Shown AFTER Google sign-in. The signed-in person chooses how they join the app.
export default function RoleSelectScreen({ profile, onBack }) {
  const login = useCollection((s) => s.login)
  const classroom = useCollection((s) => s.classroom)
  const [role, setRole] = useState('student')
  const [code, setCode] = useState(classroom?.code || 'LEAF-204')

  function confirm() {
    login({
      name: profile?.name || (role === 'teacher' ? 'Teacher' : 'Student'),
      email: profile?.email || '',
      role,
      classCode: code.trim() || classroom?.code || 'LEAF-204',
    })
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="dark" />
      <View style={s.wrap}>
        <View style={s.profileCard}>
          <View style={[s.avatar, { backgroundColor: profile?.avatarColor || C.leaf }]}>
            <Text style={s.avatarText}>{(profile?.name || 'U').slice(0, 1).toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.signedIn}>Signed in</Text>
            <Text style={s.name}>{profile?.name || 'PlantDex user'}</Text>
            {!!profile?.email && <Text style={s.email}>{profile.email}</Text>}
          </View>
        </View>

        <View style={s.card}>
          <BrandMark size={40} dark />
          <Text style={s.title}>How will you use PlantDex?</Text>
          <Text style={s.sub}>You can switch later by logging out.</Text>

          <RoleCard
            active={role === 'student'}
            onPress={() => setRole('student')}
            title="Student"
            desc="Join a class, complete plant missions, and play quizzes."
          />
          <RoleCard
            active={role === 'teacher'}
            onPress={() => setRole('teacher')}
            title="Teacher"
            desc="Build lessons, publish missions, and host live quizzes."
          />

          <Text style={s.inputLabel}>{role === 'teacher' ? 'Class code to manage' : 'Class code to join'}</Text>
          <TextInput style={s.input} value={code} onChangeText={setCode} autoCapitalize="characters" placeholder="Class code" placeholderTextColor="#a79f91" />

          <TouchableOpacity style={s.continueBtn} onPress={confirm} activeOpacity={0.86}>
            <Text style={s.continueText}>{role === 'teacher' ? 'Open teacher dashboard' : 'Enter classroom'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onBack}>
            <Text style={s.back}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

function RoleCard({ active, onPress, title, desc }) {
  return (
    <TouchableOpacity style={[s.roleCard, active && s.roleCardActive]} onPress={onPress} activeOpacity={0.85}>
      <View style={[s.roleDot, active && s.roleDotActive]}>{active && <Text style={s.roleCheck}>✓</Text>}</View>
      <View style={{ flex: 1 }}>
        <Text style={[s.roleTitle, active && s.roleTitleActive]}>{title}</Text>
        <Text style={s.roleDesc}>{desc}</Text>
      </View>
    </TouchableOpacity>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.cream, paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0 },
  wrap: { flex: 1, padding: 20, justifyContent: 'center' },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#eaf5ed', borderRadius: 22, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(44,122,71,0.14)' },
  avatar: { width: 50, height: 50, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: C.white, fontWeight: '900', fontSize: 22 },
  signedIn: { color: C.leafDark, fontWeight: '900', fontSize: 11, textTransform: 'uppercase' },
  name: { color: C.bark, fontWeight: '900', fontSize: 18, marginTop: 2 },
  email: { color: C.muted, fontWeight: '700', fontSize: 13 },
  card: { backgroundColor: C.white, borderRadius: 28, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 3 },
  title: { color: C.bark, fontSize: 21, fontWeight: '900', marginTop: 12, textAlign: 'center' },
  sub: { color: C.muted, marginTop: 5, marginBottom: 16, textAlign: 'center' },
  roleCard: { flexDirection: 'row', alignItems: 'center', gap: 12, alignSelf: 'stretch', borderWidth: 1.5, borderColor: C.line, borderRadius: 18, padding: 14, marginBottom: 12 },
  roleCardActive: { borderColor: C.leaf, backgroundColor: '#eef8f1' },
  roleDot: { width: 26, height: 26, borderRadius: 999, borderWidth: 2, borderColor: '#d8d0c3', alignItems: 'center', justifyContent: 'center' },
  roleDotActive: { backgroundColor: C.leaf, borderColor: C.leaf },
  roleCheck: { color: C.white, fontWeight: '900', fontSize: 14 },
  roleTitle: { color: C.bark, fontWeight: '900', fontSize: 16 },
  roleTitleActive: { color: C.leafDark },
  roleDesc: { color: C.muted, fontSize: 13, marginTop: 2, lineHeight: 18 },
  inputLabel: { alignSelf: 'flex-start', color: C.bark, fontWeight: '800', marginBottom: 6, marginTop: 4 },
  input: { alignSelf: 'stretch', backgroundColor: C.cream, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 13, color: C.bark, fontWeight: '700', borderWidth: 1, borderColor: C.line },
  continueBtn: { alignSelf: 'stretch', backgroundColor: C.leafDark, borderRadius: 18, alignItems: 'center', paddingVertical: 16, marginTop: 18 },
  continueText: { color: C.cream, fontWeight: '900', fontSize: 16 },
  back: { color: C.muted, fontWeight: '800', marginTop: 16 },
})
