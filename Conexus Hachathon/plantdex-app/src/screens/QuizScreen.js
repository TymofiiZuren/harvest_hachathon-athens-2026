import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Share, Alert } from 'react-native'
import { useQuiz } from '../store/useQuiz'
import { joinLink } from '../data/quizzes'
import QuizPlayer from '../components/QuizPlayer'
import QuizCreateScreen from './QuizCreateScreen'
import { C } from '../theme'

// role: 'teacher' (build + host) or 'student' / 'guest' (join + play)
export default function QuizScreen({ role = 'student' }) {
  const quizzes = useQuiz((s) => s.quizzes)
  const hostQuiz = useQuiz((s) => s.hostQuiz)
  const findQuiz = useQuiz((s) => s.findQuiz)
  const deleteQuiz = useQuiz((s) => s.deleteQuiz)

  const [mode, setMode] = useState('list') // list | create | play
  const [activeQuiz, setActiveQuiz] = useState(null)
  const [hosted, setHosted] = useState(null) // { pin, quiz }
  const [code, setCode] = useState('')

  const isTeacher = role === 'teacher'

  function play(quiz) {
    setActiveQuiz(quiz)
    setMode('play')
  }

  function host(quiz) {
    const session = hostQuiz(quiz.id)
    if (session) setHosted(session)
  }

  async function share(quiz, pin) {
    const link = joinLink(pin || quiz.code)
    try {
      await Share.share({
        message: `Join my "${quiz.title}" quiz on PlantDex!\nCode: ${pin || quiz.code}\n${link}`,
      })
    } catch (e) {
      // user dismissed the share sheet — nothing to do
    }
  }

  function joinByCode() {
    const quiz = findQuiz(code)
    if (!quiz) {
      Alert.alert('Not found', 'No quiz matches that code. Check it and try again.')
      return
    }
    play(quiz)
  }

  if (mode === 'play' && activeQuiz) {
    return <QuizPlayer quiz={activeQuiz} onExit={() => { setMode('list'); setActiveQuiz(null) }} />
  }

  if (mode === 'create') {
    return <QuizCreateScreen onCancel={() => setMode('list')} onCreated={() => setMode('list')} />
  }

  return (
    <ScrollView contentContainerStyle={s.scroll}>
      {isTeacher ? (
        <>
          <View style={s.hero}>
            <Text style={s.eyebrow}>Interactive quizzes</Text>
            <Text style={s.heroTitle}>Host a live quiz</Text>
            <Text style={s.heroSub}>Build Kahoot-style quizzes and share a join code. Students or guests join without an account.</Text>
            <TouchableOpacity style={s.createBtn} onPress={() => setMode('create')}>
              <Text style={s.createText}>+ Create new quiz</Text>
            </TouchableOpacity>
          </View>

          {hosted && (
            <View style={[s.hostCard, { borderColor: hosted.quiz.accent }]}>
              <Text style={s.hostLabel}>Live now · {hosted.quiz.title}</Text>
              <Text style={s.pin}>{hosted.pin}</Text>
              <Text style={s.hostHint}>Players join at plantdex.app/join with this PIN — no login needed.</Text>
              <View style={s.hostActions}>
                <TouchableOpacity style={s.shareBtn} onPress={() => share(hosted.quiz, hosted.pin)}>
                  <Text style={s.shareText}>Share link</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.previewBtn} onPress={() => play(hosted.quiz)}>
                  <Text style={s.previewText}>Preview</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => setHosted(null)}>
                <Text style={s.endText}>End session</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={s.sectionTitle}>Quiz library ({quizzes.length})</Text>
          {quizzes.map((quiz) => (
            <QuizRow
              key={quiz.id}
              quiz={quiz}
              teacher
              onHost={() => host(quiz)}
              onPreview={() => play(quiz)}
              onShare={() => share(quiz)}
              onDelete={quiz.custom ? () => deleteQuiz(quiz.id) : null}
            />
          ))}
        </>
      ) : (
        <>
          <View style={s.hero}>
            <Text style={s.eyebrow}>Interactive quizzes</Text>
            <Text style={s.heroTitle}>Join a quiz</Text>
            <Text style={s.heroSub}>Enter the code your teacher shared, or pick an agriculture quiz below to practice.</Text>
            <View style={s.joinRow}>
              <TextInput
                style={s.joinInput}
                value={code}
                onChangeText={setCode}
                placeholder="Enter code"
                placeholderTextColor="#a79f91"
                autoCapitalize="characters"
              />
              <TouchableOpacity style={s.joinBtn} onPress={joinByCode}>
                <Text style={s.joinText}>Join</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={s.sectionTitle}>Agriculture quizzes</Text>
          {quizzes.map((quiz) => (
            <QuizRow key={quiz.id} quiz={quiz} onPlay={() => play(quiz)} />
          ))}
        </>
      )}
    </ScrollView>
  )
}

function QuizRow({ quiz, teacher = false, onPlay, onHost, onPreview, onShare, onDelete }) {
  return (
    <View style={[s.row, { borderLeftColor: quiz.accent }]}>
      <Text style={s.rowEmoji}>{quiz.emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={s.rowTitle}>{quiz.title}</Text>
        <Text style={s.rowMeta}>{quiz.topic} · {quiz.questions.length} questions · {quiz.code}</Text>
        {teacher ? (
          <View style={s.rowBtns}>
            <SmallBtn label="Host" onPress={onHost} solid />
            <SmallBtn label="Preview" onPress={onPreview} />
            <SmallBtn label="Share" onPress={onShare} />
            {onDelete && <SmallBtn label="Delete" onPress={onDelete} danger />}
          </View>
        ) : (
          <View style={s.rowBtns}>
            <SmallBtn label="Play" onPress={onPlay} solid />
          </View>
        )}
      </View>
    </View>
  )
}

function SmallBtn({ label, onPress, solid = false, danger = false }) {
  return (
    <TouchableOpacity
      style={[s.smallBtn, solid && s.smallBtnSolid, danger && s.smallBtnDanger]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={[s.smallText, solid && s.smallTextSolid, danger && s.smallTextDanger]}>{label}</Text>
    </TouchableOpacity>
  )
}

const s = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 42 },
  hero: { backgroundColor: C.barkDark, borderRadius: 26, padding: 20, marginBottom: 16 },
  eyebrow: { color: C.leafLight, fontWeight: '900', textTransform: 'uppercase', fontSize: 12 },
  heroTitle: { color: C.cream, fontSize: 26, fontWeight: '900', marginTop: 5 },
  heroSub: { color: 'rgba(246,244,236,0.8)', lineHeight: 20, marginTop: 8 },
  createBtn: { backgroundColor: C.leaf, borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginTop: 16 },
  createText: { color: C.white, fontWeight: '900', fontSize: 15 },
  joinRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  joinInput: { flex: 1, backgroundColor: C.white, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, color: C.bark, fontWeight: '900', letterSpacing: 1 },
  joinBtn: { backgroundColor: C.sun, borderRadius: 14, paddingHorizontal: 22, justifyContent: 'center' },
  joinText: { color: C.barkDark, fontWeight: '900', fontSize: 15 },
  hostCard: { backgroundColor: C.white, borderRadius: 24, padding: 20, marginBottom: 18, borderWidth: 2, alignItems: 'center' },
  hostLabel: { color: C.bark, fontWeight: '900', fontSize: 14 },
  pin: { color: C.bark, fontSize: 44, fontWeight: '900', letterSpacing: 6, marginVertical: 6 },
  hostHint: { color: C.muted, textAlign: 'center', lineHeight: 18, marginBottom: 14 },
  hostActions: { flexDirection: 'row', gap: 10, alignSelf: 'stretch' },
  shareBtn: { flex: 1, backgroundColor: C.leafDark, borderRadius: 14, paddingVertical: 13, alignItems: 'center' },
  shareText: { color: C.cream, fontWeight: '900' },
  previewBtn: { flex: 1, borderWidth: 2, borderColor: C.leaf, borderRadius: 14, paddingVertical: 11, alignItems: 'center' },
  previewText: { color: C.leafDark, fontWeight: '900' },
  endText: { color: '#b5562a', fontWeight: '800', marginTop: 14 },
  sectionTitle: { color: C.bark, fontSize: 18, fontWeight: '900', marginBottom: 10, marginTop: 2 },
  row: { flexDirection: 'row', gap: 12, backgroundColor: C.white, borderRadius: 18, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: C.line, borderLeftWidth: 5 },
  rowEmoji: { fontSize: 30 },
  rowTitle: { color: C.bark, fontWeight: '900', fontSize: 16 },
  rowMeta: { color: C.muted, fontWeight: '700', fontSize: 12, marginTop: 3 },
  rowBtns: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  smallBtn: { borderWidth: 1.5, borderColor: C.line, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8 },
  smallBtnSolid: { backgroundColor: C.leafDark, borderColor: C.leafDark },
  smallBtnDanger: { borderColor: '#b5562a' },
  smallText: { color: C.bark, fontWeight: '900', fontSize: 13 },
  smallTextSolid: { color: C.cream },
  smallTextDanger: { color: '#b5562a' },
})
