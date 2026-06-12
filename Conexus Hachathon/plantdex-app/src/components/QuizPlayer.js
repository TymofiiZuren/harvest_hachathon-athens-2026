import { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Press, Btn, Bar } from './ui'
import { useCollection } from '../store/useCollection'
import { T, F } from '../theme'

// Local single-player playthrough of a quiz. Used by both the student/guest
// "play" flow and the teacher "preview" flow. Real-time multiplayer is backend.
const MARKERS = ['A', 'B', 'C', 'D']

export default function QuizPlayer({ quiz, onExit }) {
  const questions = quiz?.questions || []
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)
  const question = questions[index]
  const total = questions.length
  const [timeLeft, setTimeLeft] = useState(question?.seconds || 20)
  const timerRef = useRef(null)
  const addPoints = useCollection((s) => s.addPoints)
  const awardedRef = useRef(false) // credit the score exactly once per playthrough

  // Per-question countdown.
  useEffect(() => {
    if (finished || !question) return
    setTimeLeft(question.seconds || 20)
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, finished])

  // Auto-reveal the answer when the countdown hits zero. Kept outside the
  // interval updater so we never set one state from inside another's setter.
  useEffect(() => {
    if (timeLeft === 0 && !answered && !finished && question) {
      setSelected(null)
      setAnswered(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft])

  function choose(choiceIndex) {
    if (answered) return
    clearInterval(timerRef.current)
    const isCorrect = choiceIndex === question.answer
    // Faster answers score more, like Kahoot (base 100 + time bonus).
    const bonus = Math.round((timeLeft / (question.seconds || 20)) * 100)
    setSelected(choiceIndex)
    setAnswered(true)
    if (isCorrect) {
      setScore((sc) => sc + 100 + bonus)
      setCorrectCount((c) => c + 1)
    }
  }

  function next() {
    if (index + 1 >= total) {
      if (!awardedRef.current && score > 0) {
        addPoints(score)
        awardedRef.current = true
      }
      setFinished(true)
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
    setAnswered(false)
  }

  if (!question && !finished) {
    return (
      <View style={s.center}>
        <Text style={F.h1}>This quiz has no questions yet</Text>
        <Btn label="Back" kind="raised" onPress={onExit} style={{ marginTop: 18 }} />
      </View>
    )
  }

  if (finished) {
    const pct = total ? Math.round((correctCount / total) * 100) : 0
    return (
      <ScrollView contentContainerStyle={s.resultScroll} showsVerticalScrollIndicator={false}>
        <View style={s.resultCard}>
          <Text style={s.resultEmoji}>{pct >= 80 ? '🏆' : pct >= 50 ? '🌟' : '🌱'}</Text>
          <Text style={F.micro}>Quiz complete</Text>
          <Text style={s.resultScore}>{score}</Text>
          <Text style={[F.body, s.resultSub]}>{correctCount} of {total} correct · {pct}%</Text>
          {score > 0 && (
            <View style={s.creditChip}>
              <Text style={s.creditText}>+{score} pts added to your total</Text>
            </View>
          )}
          <Bar value={pct / 100} style={s.resultBar} />
        </View>
        <Btn label="Done" onPress={onExit} style={{ marginTop: 16 }} />
      </ScrollView>
    )
  }

  return (
    <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      <View style={s.topRow}>
        <Text style={s.progressText}>{index + 1} / {total}</Text>
        <View style={[s.timer, timeLeft <= 5 && s.timerLow]}>
          <Text style={[s.timerText, timeLeft <= 5 && { color: T.c.danger }]}>{timeLeft}s</Text>
        </View>
        <Text style={s.scoreText}>{score} pts</Text>
      </View>

      <Bar
        value={timeLeft / (question.seconds || 20)}
        color={timeLeft <= 5 ? T.c.danger : T.c.accent}
        height={6}
        style={s.timeBar}
      />

      <View style={s.questionCard}>
        <Text style={s.questionText}>{question.q}</Text>
      </View>

      <View style={s.choices}>
        {question.choices.map((choice, i) => {
          const isAnswer = i === question.answer
          const isPicked = i === selected
          let rowStyle = null
          let markerStyle = null
          if (answered) {
            if (isAnswer) { rowStyle = s.choiceCorrect; markerStyle = s.markerCorrect }
            else if (isPicked) { rowStyle = s.choiceWrong; markerStyle = s.markerWrong }
            else rowStyle = s.choiceDim
          }
          return (
            <Press key={i} style={[s.choice, rowStyle]} disabled={answered} onPress={() => choose(i)}>
              <View style={[s.marker, markerStyle]}>
                <Text style={[s.markerText, (markerStyle === s.markerCorrect || markerStyle === s.markerWrong) && { color: T.c.onAccent }]}>
                  {answered && isAnswer ? '✓' : answered && isPicked ? '✕' : MARKERS[i] || '·'}
                </Text>
              </View>
              <Text style={s.choiceText}>{choice}</Text>
            </Press>
          )
        })}
      </View>

      {answered && (
        <View style={s.feedback}>
          <Text style={[s.feedbackText, selected === question.answer ? { color: T.c.accent } : { color: T.c.danger }]}>
            {selected === question.answer ? 'Correct!' : selected === null ? "Time's up" : 'Not quite'}
          </Text>
          <Btn label={index + 1 >= total ? 'See results' : 'Next question'} onPress={next} style={{ marginTop: 12, alignSelf: 'stretch' }} />
        </View>
      )}

      <Btn label="Quit quiz" kind="ghost" onPress={onExit} style={{ marginTop: 14 }} />
    </ScrollView>
  )
}

const s = StyleSheet.create({
  scroll: { padding: 18, paddingBottom: 120 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: T.c.bg },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  progressText: { ...F.bodyStrong, fontSize: 13 },
  timer: { backgroundColor: T.c.accentSoft, borderRadius: T.r.full, paddingHorizontal: 14, paddingVertical: 5 },
  timerLow: { backgroundColor: T.c.dangerSoft },
  timerText: { color: T.c.accent, fontWeight: '800', fontSize: 13 },
  scoreText: { color: T.c.gold, fontWeight: '800', fontSize: 13 },
  timeBar: { marginTop: 12 },
  questionCard: { backgroundColor: T.c.surface, borderRadius: T.r.lg, borderWidth: 1, borderColor: T.c.line, padding: 22, marginTop: 16, minHeight: 110, justifyContent: 'center' },
  questionText: { ...F.h1, fontSize: 19, textAlign: 'center', lineHeight: 26 },
  choices: { marginTop: 14, gap: 9 },
  choice: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: T.c.raised, borderRadius: T.r.sm, borderWidth: 1, borderColor: T.c.line, padding: 14 },
  choiceCorrect: { backgroundColor: T.c.accentSoft, borderColor: 'rgba(74,222,128,0.45)' },
  choiceWrong: { backgroundColor: T.c.dangerSoft, borderColor: 'rgba(248,113,113,0.45)' },
  choiceDim: { opacity: 0.35 },
  marker: { width: 30, height: 30, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.07)', alignItems: 'center', justifyContent: 'center' },
  markerCorrect: { backgroundColor: T.c.accent },
  markerWrong: { backgroundColor: T.c.danger },
  markerText: { color: T.c.sub, fontWeight: '800', fontSize: 13 },
  choiceText: { ...F.bodyStrong, fontSize: 15, flex: 1 },
  feedback: { marginTop: 16, alignItems: 'center' },
  feedbackText: { fontSize: 17, fontWeight: '800' },
  resultScroll: { padding: 20, paddingBottom: 120, flexGrow: 1, justifyContent: 'center' },
  resultCard: { backgroundColor: T.c.surface, borderRadius: T.r.xl, borderWidth: 1, borderColor: 'rgba(74,222,128,0.25)', padding: 30, alignItems: 'center' },
  resultEmoji: { fontSize: 52, marginBottom: 10 },
  resultScore: { fontSize: 56, fontWeight: '800', color: T.c.accent, letterSpacing: -2, marginTop: 2 },
  resultSub: { marginTop: 4 },
  creditChip: { backgroundColor: T.c.goldSoft, borderRadius: T.r.full, paddingHorizontal: 14, paddingVertical: 6, marginTop: 12 },
  creditText: { color: T.c.gold, fontWeight: '800', fontSize: 13 },
  resultBar: { alignSelf: 'stretch', marginTop: 18 },
})
