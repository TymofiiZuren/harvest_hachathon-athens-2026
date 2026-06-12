import { useState } from 'react'
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { BrandMark } from '../components/DesignElements'
import { Press, Btn } from '../components/ui'
import { useCollection } from '../store/useCollection'
import ScanScreen from './ScanScreen'
import { T, F } from '../theme'

export default function LoginScreen() {
  const login = useCollection((s) => s.login)
  const classroom = useCollection((s) => s.classroom)
  const [role, setRole] = useState('student')
  const [name, setName] = useState('')
  const [code, setCode] = useState(classroom?.code || 'LEAF-204')
  const [guestMode, setGuestMode] = useState(false)

  function submit() {
    login({
      name: name.trim() || (role === 'teacher' ? 'Teacher' : 'Student'),
      role,
      classCode: code.trim() || classroom?.code || 'LEAF-204',
    })
  }

  // No-account mode: just the plant scanner, nothing else.
  if (guestMode) {
    return (
      <SafeAreaView style={s.safe} edges={['top', 'left', 'right', 'bottom']}>
        <StatusBar style="light" />
        <View style={s.guestBar}>
          <View style={s.guestBrand}>
            <BrandMark size={28} />
            <Text style={s.guestTitle}>Guest scanner</Text>
          </View>
          <Btn label="Sign in" kind="raised" small onPress={() => setGuestMode(false)} />
        </View>
        <ScanScreen freeScan />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={s.safe} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={s.wrap}>
          <View style={s.hero}>
            <View style={s.glow} />
            <BrandMark size={64} />
            <Text style={s.logo}>PlantDex</Text>
            <Text style={s.tagline}>
              Identify real plants, complete class missions, grow a shared collection.
            </Text>
          </View>

          <View style={s.card}>
            <View style={s.segment}>
              <Press
                style={[s.segmentBtn, role === 'student' && s.segmentActive]}
                onPress={() => setRole('student')}
              >
                <Text style={[s.segmentText, role === 'student' && s.segmentTextActive]}>Student</Text>
              </Press>
              <Press
                style={[s.segmentBtn, role === 'teacher' && s.segmentActive]}
                onPress={() => setRole('teacher')}
              >
                <Text style={[s.segmentText, role === 'teacher' && s.segmentTextActive]}>Teacher</Text>
              </Press>
            </View>

            <Text style={s.label}>Name</Text>
            <TextInput
              style={s.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={T.c.faint}
              accessibilityLabel="Name"
            />

            <Text style={s.label}>{role === 'teacher' ? 'Class code to manage' : 'Class code to join'}</Text>
            <TextInput
              style={s.input}
              value={code}
              onChangeText={setCode}
              autoCapitalize="characters"
              placeholder="Class code"
              placeholderTextColor={T.c.faint}
              accessibilityLabel="Class code"
            />

            <Btn
              label={role === 'teacher' ? 'Open dashboard' : 'Enter classroom'}
              onPress={submit}
              style={{ marginTop: 20 }}
            />
          </View>

          <Btn
            label="Skip login — just scan plants"
            kind="ghost"
            onPress={() => setGuestMode(true)}
            style={s.guestBtn}
          />

          <Text style={s.footer}>Powered by Pl@ntNet · no account required</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.c.bg },
  flex: { flex: 1 },
  wrap: { flex: 1, paddingHorizontal: 22, justifyContent: 'center' },
  hero: { alignItems: 'center', marginBottom: 28 },
  glow: { position: 'absolute', top: -40, width: 220, height: 220, borderRadius: 110, backgroundColor: T.c.accent, opacity: 0.07 },
  logo: { ...F.display, fontSize: 34, marginTop: 18 },
  tagline: { ...F.body, textAlign: 'center', marginTop: 8, maxWidth: 280 },
  card: { backgroundColor: T.c.surface, borderRadius: T.r.lg, borderWidth: 1, borderColor: T.c.line, padding: 20 },
  segment: { flexDirection: 'row', backgroundColor: T.c.bg, borderRadius: T.r.sm, padding: 4, gap: 4, marginBottom: 18 },
  segmentBtn: { flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: T.r.xs },
  segmentActive: { backgroundColor: T.c.accent },
  segmentText: { ...F.bodyStrong, fontSize: 14, color: T.c.faint },
  segmentTextActive: { color: T.c.onAccent },
  label: { ...F.micro, marginBottom: 7, marginTop: 6 },
  input: { backgroundColor: T.c.raised, borderRadius: T.r.sm, borderWidth: 1, borderColor: T.c.line, paddingHorizontal: 15, paddingVertical: 13, color: T.c.text, fontSize: 15, fontWeight: '600', marginBottom: 8 },
  footer: { ...F.micro, textAlign: 'center', marginTop: 14, letterSpacing: 0.6 },
  guestBtn: { marginTop: 10 },
  guestBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 10, paddingBottom: 6 },
  guestBrand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  guestTitle: { ...F.h2, fontSize: 17 },
})
