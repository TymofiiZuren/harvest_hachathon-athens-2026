// ─── Learn tab ───────────────────────────────────────────────────────────────
// Combines the two learning surfaces under one tab so the nav stays at five
// items: live/practice Quizzes and Leaving Cert prep (Study Hub).
import { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import QuizScreen from './QuizScreen'
import StudyScreen from './StudyScreen'
import { Press } from '../components/ui'
import { T } from '../theme'

export default function LearnScreen({ role = 'student' }) {
  const [mode, setMode] = useState('quizzes') // quizzes | study

  return (
    <View style={s.wrap}>
      <View style={s.switchRow}>
        <Press style={[s.switchBtn, mode === 'quizzes' && s.switchBtnOn]} onPress={() => setMode('quizzes')}>
          <Text style={[s.switchText, mode === 'quizzes' && s.switchTextOn]}>Quizzes</Text>
        </Press>
        <Press style={[s.switchBtn, mode === 'study' && s.switchBtnOn]} onPress={() => setMode('study')}>
          <Text style={[s.switchText, mode === 'study' && s.switchTextOn]}>Leaving Cert</Text>
        </Press>
      </View>
      <View style={s.body}>{mode === 'quizzes' ? <QuizScreen role={role} /> : <StudyScreen />}</View>
    </View>
  )
}

const s = StyleSheet.create({
  wrap: { flex: 1 },
  switchRow: { flexDirection: 'row', marginHorizontal: 18, marginTop: 4, backgroundColor: T.c.surface, borderRadius: T.r.full, borderWidth: 1, borderColor: T.c.line, padding: 4, gap: 4 },
  switchBtn: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: T.r.full },
  switchBtnOn: { backgroundColor: T.c.accentSoft },
  switchText: { fontSize: 12, fontWeight: '800', color: T.c.faint },
  switchTextOn: { color: T.c.accent },
  body: { flex: 1 },
})
