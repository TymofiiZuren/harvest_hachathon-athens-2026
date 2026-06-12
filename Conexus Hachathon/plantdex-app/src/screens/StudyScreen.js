// ─── Leaving Cert study hub ──────────────────────────────────────────────────
// Student exam prep tied to the botany theme: revision notes per LC Biology
// topic, plus driving-theory-style MCQ tests — pick an answer, get instant
// feedback with the why, and pass at 80% like the real theory test.
import { useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { LC_TOPICS, PASS_MARK, EXAM_SIZE, buildMockExam } from '../data/leavingCert'
import { useCollection } from '../store/useCollection'
import { Btn, Tag, Bar, Press } from '../components/ui'
import { T, F } from '../theme'

const passOf = (n) => Math.ceil(n * PASS_MARK)

export default function StudyScreen() {
  const [view, setView] = useState({ name: 'home' })
  // Best scores persist in the store; first-time passes pay a point bonus
  // that feeds the profile-cosmetics economy.
  const best = useCollection((s) => s.studyBest || {})
  const record = useCollection((s) => s.recordStudyResult)

  const goHome = () => setView({ name: 'home' })

  if (view.name === 'learn') {
    return (
      <TopicNotes
        topic={view.topic}
        onBack={goHome}
        onTest={() => setView({ name: 'test', topic: view.topic })}
      />
    )
  }

  if (view.name === 'test') {
    const t = view.topic
    return (
      <TestPlayer
        title={t.title}
        subtitle={`${t.questions.length} questions · pass ${passOf(t.questions.length)}/${t.questions.length}`}
        questions={t.questions}
        onDone={(c, n) => record(t.id, c, n)}
        onExit={goHome}
      />
    )
  }

  if (view.name === 'exam') {
    return (
      <TestPlayer
        title="Mock Test"
        subtitle={`${view.questions.length} questions · all topics · pass ${passOf(view.questions.length)}/${view.questions.length}`}
        questions={view.questions}
        onDone={(c, n) => record('exam', c, n)}
        onExit={goHome}
      />
    )
  }

  return (
    <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      <View style={s.headerBlock}>
        <Text style={F.micro}>Leaving Cert · Biology</Text>
        <Text style={[F.display, s.headerTitle]}>Study Hub</Text>
        <Text style={[F.body, s.headerBlurb]}>
          Plant-science topics straight from the LC syllabus. Learn the notes, then test
          yourself driving-theory style — instant feedback, and {Math.round(PASS_MARK * 100)}% to pass.
        </Text>
      </View>

      <View style={s.examCard}>
        <Tag label="MOCK TEST" tone="gold" />
        <Text style={[F.h2, s.examTitle]}>Exam simulator</Text>
        <Text style={[F.body, s.examBlurb]}>
          {EXAM_SIZE} random questions from every topic, just like the theory test.
          Pass mark {passOf(EXAM_SIZE)}/{EXAM_SIZE}. First pass earns +60 pts — topic
          tests pay +30.
        </Text>
        <BestTag result={best.exam} />
        <Btn
          label="Start mock test"
          onPress={() => setView({ name: 'exam', questions: buildMockExam() })}
          style={s.examBtn}
        />
      </View>

      <Text style={s.section}>Topics · {LC_TOPICS.length}</Text>
      {LC_TOPICS.map((t) => (
        <View key={t.id} style={s.row}>
          <View style={[s.emojiTile, { backgroundColor: `${t.accent}22` }]}>
            <Text style={s.emoji}>{t.emoji}</Text>
          </View>
          <View style={s.flex1}>
            <Text style={F.bodyStrong}>{t.title}</Text>
            <Text style={s.rowMeta}>
              {t.tag} · {t.notes.length} notes · {t.questions.length} questions
            </Text>
            <BestTag result={best[t.id]} />
            <View style={s.rowBtns}>
              <Btn label="Learn" small onPress={() => setView({ name: 'learn', topic: t })} />
              <Btn label="Test" kind="raised" small onPress={() => setView({ name: 'test', topic: t })} />
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  )
}

function BestTag({ result }) {
  if (!result) return null
  const passed = result.correct / result.total >= PASS_MARK
  return (
    <Tag
      label={`Best ${result.correct}/${result.total} · ${passed ? 'PASSED' : 'NOT PASSED'}`}
      tone={passed ? 'accent' : 'danger'}
      style={s.bestTag}
    />
  )
}

// Revision notes for one topic, with a jump straight into its test.
function TopicNotes({ topic, onBack, onTest }) {
  return (
    <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      <Btn label="← Back" kind="ghost" small onPress={onBack} style={s.backBtn} />
      <View style={s.headerBlock}>
        <Text style={F.micro}>{topic.tag}</Text>
        <Text style={[F.h1, s.headerTitle]}>
          {topic.emoji} {topic.title}
        </Text>
      </View>

      {topic.notes.map((n, i) => (
        <View key={i} style={s.noteCard}>
          <Text style={s.noteHead}>{n.h}</Text>
          <Text style={[F.body, s.noteBody]}>{n.body}</Text>
        </View>
      ))}

      <Btn label="Test yourself" onPress={onTest} style={s.testBtn} />
    </ScrollView>
  )
}

// Driving-theory-style MCQ player: lock in an answer, see right/wrong with an
// explanation, then move on. Ends with a pass/fail result card.
function TestPlayer({ title, subtitle, questions, onDone, onExit }) {
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState(null)
  const [right, setRight] = useState(0)
  const [done, setDone] = useState(false)
  const [bonus, setBonus] = useState(0)
  const q = questions[i]
  const last = i + 1 >= questions.length

  function choose(idx) {
    if (picked != null) return
    setPicked(idx)
    if (idx === q.answer) setRight((r) => r + 1)
  }

  function next() {
    if (last) {
      const res = onDone(right, questions.length)
      setBonus(res?.bonus || 0)
      setDone(true)
    } else {
      setI(i + 1)
      setPicked(null)
    }
  }

  function restart() {
    setI(0)
    setPicked(null)
    setRight(0)
    setBonus(0)
    setDone(false)
  }

  if (done) {
    const passed = right / questions.length >= PASS_MARK
    return (
      <View style={s.resultWrap}>
        <Tag label={passed ? 'PASSED' : 'NOT YET'} tone={passed ? 'accent' : 'danger'} />
        <Text style={s.resultScore}>
          {right}/{questions.length}
        </Text>
        {bonus > 0 && <Tag label={`First pass · +${bonus} pts earned`} tone="gold" style={s.bonusTag} />}
        <Text style={[F.body, s.resultHint]}>
          {passed
            ? 'Exam standard — you would pass this section. Keep it sharp with the mock test.'
            : `You need ${passOf(questions.length)}/${questions.length} to pass. Re-read the notes and go again.`}
        </Text>
        <View style={s.resultBtns}>
          <Btn label="Try again" onPress={restart} style={s.flex1} />
          <Btn label="Done" kind="raised" onPress={onExit} style={s.flex1} />
        </View>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      <Btn label="← Exit test" kind="ghost" small onPress={onExit} style={s.backBtn} />
      <View style={s.headerBlock}>
        <Text style={F.micro}>{subtitle}</Text>
        <Text style={[F.h1, s.headerTitle]}>{title}</Text>
      </View>

      <Text style={s.progress}>
        Question {i + 1} of {questions.length}
      </Text>
      <Bar value={(i + (picked != null ? 1 : 0)) / questions.length} style={s.progressBar} />

      {q.topic && <Tag label={`${q.emoji} ${q.topic}`} style={s.topicTag} />}
      <View style={s.qCard}>
        <Text style={F.h2}>{q.q}</Text>
      </View>

      {q.options.map((opt, idx) => {
        const reveal = picked != null
        const isAnswer = idx === q.answer
        const isPicked = idx === picked
        return (
          <Press
            key={idx}
            onPress={() => choose(idx)}
            style={[
              s.option,
              reveal && isAnswer && s.optionRight,
              reveal && isPicked && !isAnswer && s.optionWrong,
            ]}
          >
            <View
              style={[
                s.optionKey,
                reveal && isAnswer && { backgroundColor: T.c.accent },
                reveal && isPicked && !isAnswer && { backgroundColor: T.c.danger },
              ]}
            >
              <Text
                style={[
                  s.optionKeyText,
                  reveal && (isAnswer || isPicked) && { color: T.c.onAccent },
                ]}
              >
                {'ABCD'[idx]}
              </Text>
            </View>
            <Text style={[F.bodyStrong, s.flex1]}>{opt}</Text>
          </Press>
        )
      })}

      {picked != null && (
        <View style={[s.whyCard, picked === q.answer ? s.whyRight : s.whyWrong]}>
          <Text style={[s.whyTitle, { color: picked === q.answer ? T.c.accent : T.c.danger }]}>
            {picked === q.answer ? 'Correct ✓' : `Not quite — the answer is ${'ABCD'[q.answer]}`}
          </Text>
          <Text style={[F.body, s.whyBody]}>{q.why}</Text>
          <Btn label={last ? 'See result' : 'Next question'} small onPress={next} style={s.nextBtn} />
        </View>
      )}
    </ScrollView>
  )
}

const s = StyleSheet.create({
  scroll: { padding: 18, paddingBottom: 120 },
  flex1: { flex: 1 },
  headerBlock: { marginBottom: 16 },
  headerTitle: { marginTop: 4 },
  headerBlurb: { marginTop: 6 },
  backBtn: { alignSelf: 'flex-start', paddingHorizontal: 0, marginBottom: 2 },
  section: { ...F.h2, marginBottom: 10 },

  examCard: { backgroundColor: T.c.surface, borderRadius: T.r.lg, borderWidth: 1, borderColor: 'rgba(245,192,78,0.3)', padding: 18, marginBottom: 18 },
  examTitle: { marginTop: 10 },
  examBlurb: { marginTop: 4 },
  examBtn: { marginTop: 12 },
  bestTag: { marginTop: 8 },

  row: { flexDirection: 'row', gap: 12, backgroundColor: T.c.surface, borderRadius: T.r.md, borderWidth: 1, borderColor: T.c.line, padding: 13, marginBottom: 9 },
  emojiTile: { width: 46, height: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 22 },
  rowMeta: { ...F.body, fontSize: 12, marginTop: 2 },
  rowBtns: { flexDirection: 'row', gap: 7, marginTop: 10 },

  noteCard: { backgroundColor: T.c.surface, borderRadius: T.r.md, borderWidth: 1, borderColor: T.c.line, padding: 15, marginBottom: 9 },
  noteHead: { ...F.bodyStrong, fontSize: 15 },
  noteBody: { marginTop: 4 },
  testBtn: { marginTop: 10 },

  progress: { ...F.micro, marginBottom: 7 },
  progressBar: { marginBottom: 16 },
  topicTag: { marginBottom: 10 },
  qCard: { backgroundColor: T.c.surface, borderRadius: T.r.md, borderWidth: 1, borderColor: T.c.lineStrong, padding: 16, marginBottom: 12 },

  option: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: T.c.raised, borderRadius: T.r.sm, borderWidth: 1, borderColor: T.c.line, padding: 13, marginBottom: 8 },
  optionRight: { borderColor: 'rgba(74,222,128,0.55)', backgroundColor: T.c.accentSoft },
  optionWrong: { borderColor: 'rgba(248,113,113,0.55)', backgroundColor: T.c.dangerSoft },
  optionKey: { width: 28, height: 28, borderRadius: 9, backgroundColor: T.c.press, alignItems: 'center', justifyContent: 'center' },
  optionKeyText: { color: T.c.sub, fontWeight: '800', fontSize: 13 },

  whyCard: { borderRadius: T.r.md, borderWidth: 1, padding: 15, marginTop: 4 },
  whyRight: { backgroundColor: T.c.accentSoft, borderColor: 'rgba(74,222,128,0.35)' },
  whyWrong: { backgroundColor: T.c.dangerSoft, borderColor: 'rgba(248,113,113,0.35)' },
  whyTitle: { fontSize: 14, fontWeight: '800' },
  whyBody: { marginTop: 3 },
  nextBtn: { marginTop: 12, alignSelf: 'flex-start' },

  bonusTag: { marginBottom: 10 },
  resultWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  resultScore: { color: T.c.text, fontSize: 58, fontWeight: '800', letterSpacing: -1, marginVertical: 10 },
  resultHint: { textAlign: 'center', marginBottom: 22 },
  resultBtns: { flexDirection: 'row', gap: 10, alignSelf: 'stretch' },
})
