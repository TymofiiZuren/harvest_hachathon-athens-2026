import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { BrandMark } from '../components/DesignElements'
import { useCollection } from '../store/useCollection'
import { C } from '../theme'

export default function LoginScreen() {
  const login = useCollection((s) => s.login)
  const classroom = useCollection((s) => s.classroom)
  const [role, setRole] = useState('student')
  const [name, setName] = useState('')
  const [code, setCode] = useState(classroom?.code || 'LEAF-204')

  function submit() {
    login({
      name: name.trim() || (role === 'teacher' ? 'Teacher' : 'Student'),
      role,
      classCode: code.trim() || classroom?.code || 'LEAF-204',
    })
  }

  return (
    <SafeAreaView style={s.safe} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <View style={s.wrap}>
        <View style={s.heroCard}>
          <BrandMark size={58} dark />
          <Text style={s.logo}>PlantDex Classroom</Text>
          <Text style={s.sub}>Sign in as a student or teacher to identify plants, complete missions, and manage lessons.</Text>
        </View>

        <View style={s.card}>
          <Text style={s.label}>Choose your role</Text>
          <View style={s.roleRow}>
            <RoleButton label="Student" active={role === 'student'} onPress={() => setRole('student')} />
            <RoleButton label="Teacher" active={role === 'teacher'} onPress={() => setRole('teacher')} />
          </View>

          <Text style={s.inputLabel}>Name</Text>
          <TextInput style={s.input} value={name} onChangeText={setName} placeholder="Enter your name" placeholderTextColor="#a79f91" />

          <Text style={s.inputLabel}>{role === 'teacher' ? 'Class code to manage' : 'Class code to join'}</Text>
          <TextInput style={s.input} value={code} onChangeText={setCode} autoCapitalize="characters" placeholder="Class code" placeholderTextColor="#a79f91" />

          <TouchableOpacity style={s.loginBtn} onPress={submit} activeOpacity={0.86}>
            <Text style={s.loginText}>{role === 'teacher' ? 'Open teacher dashboard' : 'Enter classroom'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

function RoleButton({ label, active, onPress }) {
  return (
    <TouchableOpacity style={[s.roleBtn, active && s.roleActive]} onPress={onPress} activeOpacity={0.82}>
      <View style={[s.roleDot, active && s.roleDotActive]} />
      <Text style={[s.roleText, active && s.roleTextActive]}>{label}</Text>
    </TouchableOpacity>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.cream },
  wrap: { flex: 1, padding: 20, justifyContent: 'center' },
  heroCard: { backgroundColor: '#eaf5ed', borderRadius: 32, padding: 26, alignItems: 'center', marginBottom: 18, borderWidth: 1, borderColor: 'rgba(44,122,71,0.14)' },
  logo: { color: C.bark, fontSize: 30, fontWeight: '900', marginTop: 16, textAlign: 'center' },
  sub: { color: C.muted, textAlign: 'center', lineHeight: 21, marginTop: 8, maxWidth: 300 },
  card: { backgroundColor: C.white, borderRadius: 28, padding: 20, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 3 },
  label: { color: C.bark, fontWeight: '900', marginBottom: 12, textAlign: 'center' },
  roleRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  roleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5, borderColor: C.line, borderRadius: 16, paddingVertical: 14 },
  roleActive: { borderColor: C.leaf, backgroundColor: '#eef8f1' },
  roleDot: { width: 14, height: 14, borderRadius: 999, backgroundColor: '#d8d0c3' },
  roleDotActive: { backgroundColor: C.leaf },
  roleText: { color: C.muted, fontWeight: '900' },
  roleTextActive: { color: C.leafDark },
  inputLabel: { color: C.bark, fontWeight: '800', marginBottom: 6, marginTop: 8 },
  input: { backgroundColor: C.cream, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 13, color: C.bark, fontWeight: '700', borderWidth: 1, borderColor: C.line },
  loginBtn: { backgroundColor: C.leafDark, borderRadius: 18, alignItems: 'center', paddingVertical: 16, marginTop: 18 },
  loginText: { color: C.cream, fontWeight: '900', fontSize: 16 },
})
