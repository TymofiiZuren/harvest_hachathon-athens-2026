import { useState } from 'react'
import { View, Text, TextInput, StyleSheet, ScrollView, Share, Alert } from 'react-native'
import { useQuiz } from '../store/useQuiz'
import { joinLink } from '../data/quizzes'
import QuizPlayer from '../components/QuizPlayer'
import QuizCreateScreen from './QuizCreateScreen'
import { Btn, Tag } from '../components/ui'
import { T, F } from '../theme'

// role: 'teacher' (build + host) or 'student' (join + play)
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

  function removeQuiz(quiz) {
    // If the quiz being deleted is currently hosted, end that session too so
    // the live card never points at a quiz that no longer exists.
    if (hosted?.quiz?.id === quiz.id) setHosted(null)
    deleteQuiz(quiz.id)
  }

  if (mode === 'play' && activeQuiz) {
    return <QuizPlayer quiz={activeQuiz} onExit={() => { setMode('list'); setActiveQuiz(null) }} />
  }

  if (mode === 'create') {
    return <QuizCreateScreen onCancel={() => setMode('list')} onCreated={() => setMode('list')} />
  }

  return (
    <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      <View style={s.headerBlock}>
        <Text style={F.micro}>{isTeacher ? 'Host live games' : 'Play & learn'}</Text>
        <Text style={[F.display, s.headerTitle]}>Quizzes</Text>
      </View>

      {isTeacher ? (
        <>
          <Btn label="+ Create new quiz" onPress={() => setMode('create')} style={s.createBtn} />

          {hosted && (
            <View style={s.liveCard}>
              <Tag label="LIVE NOW" tone="accent" />
              <Text style={[F.h2, s.liveTitle]}>{hosted.quiz.title}</Text>
              <Text style={s.pin}>{hosted.pin}</Text>
              <Text style={[F.body, s.liveHint]}>Students join with this PIN — no login needed.</Text>
              <View style={s.liveActions}>
                <Btn label="Share" small onPress={() => share(hosted.quiz, hosted.pin)} style={s.flex1} />
                <Btn label="Preview" kind="raised" small onPress={() => play(hosted.quiz)} style={s.flex1} />
                <Btn label="End" kind="danger" small onPress={() => setHosted(null)} style={s.flex1} />
              </View>
            </View>
          )}

          <Text style={s.section}>Library · {quizzes.length}</Text>
          {quizzes.map((quiz) => (
            <QuizRow
              key={quiz.id}
              quiz={quiz}
              teacher
              onHost={() => host(quiz)}
              onPreview={() => play(quiz)}
              onShare={() => share(quiz)}
              onDelete={quiz.custom ? () => removeQuiz(quiz) : null}
            />
          ))}
        </>
      ) : (
        <>
          <View style={s.joinCard}>
            <Text style={F.micro}>Have a code?</Text>
            <View style={s.joinRow}>
              <TextInput
                style={s.joinInput}
                value={code}
                onChangeText={setCode}
                placeholder="Enter code"
                placeholderTextColor={T.c.faint}
                autoCapitalize="characters"
                accessibilityLabel="Quiz code"
              />
              <Btn label="Join" onPress={joinByCode} style={s.joinBtn} />
            </View>
          </View>

          <Text style={s.section}>Practice quizzes</Text>
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
    <View style={s.row}>
      <View style={[s.emojiTile, { backgroundColor: `${quiz.accent}22` }]}>
        <Text style={s.emoji}>{quiz.emoji}</Text>
      </View>
      <View style={s.flex1}>
        <Text style={F.bodyStrong}>{quiz.title}</Text>
        <Text style={s.rowMeta}>{quiz.topic} · {quiz.questions.length} questions · {quiz.code}</Text>
        <View style={s.rowBtns}>
          {teacher ? (
            <>
              <Btn label="Host" small onPress={onHost} />
              <Btn label="Preview" kind="raised" small onPress={onPreview} />
              <Btn label="Share" kind="raised" small onPress={onShare} />
              {onDelete && <Btn label="Delete" kind="danger" small onPress={onDelete} />}
            </>
          ) : (
            <Btn label="Play" small onPress={onPlay} />
          )}
        </View>
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  scroll: { padding: 18, paddingBottom: 120 },
  headerBlock: { marginBottom: 16 },
  headerTitle: { marginTop: 4 },
  createBtn: { marginBottom: 16 },
  liveCard: { backgroundColor: T.c.surface, borderRadius: T.r.lg, borderWidth: 1, borderColor: 'rgba(74,222,128,0.3)', padding: 18, alignItems: 'center', marginBottom: 18 },
  liveTitle: { marginTop: 10 },
  pin: { color: T.c.text, fontSize: 42, fontWeight: '800', letterSpacing: 8, marginVertical: 6 },
  liveHint: { textAlign: 'center', marginBottom: 14 },
  liveActions: { flexDirection: 'row', gap: 8, alignSelf: 'stretch' },
  flex1: { flex: 1 },
  joinCard: { backgroundColor: T.c.surface, borderRadius: T.r.lg, borderWidth: 1, borderColor: T.c.line, padding: 16, marginBottom: 18 },
  joinRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  joinInput: { flex: 1, backgroundColor: T.c.raised, borderRadius: T.r.sm, borderWidth: 1, borderColor: T.c.line, paddingHorizontal: 15, paddingVertical: 12, color: T.c.text, fontWeight: '800', letterSpacing: 1.5, fontSize: 15 },
  joinBtn: { paddingHorizontal: 24 },
  section: { ...F.h2, marginBottom: 10 },
  row: { flexDirection: 'row', gap: 12, backgroundColor: T.c.surface, borderRadius: T.r.md, borderWidth: 1, borderColor: T.c.line, padding: 13, marginBottom: 9 },
  emojiTile: { width: 46, height: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 22 },
  rowMeta: { ...F.body, fontSize: 12, marginTop: 2 },
  rowBtns: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 10 },
})
