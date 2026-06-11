import { useEffect, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { C } from '../theme'

// Local single-player playthrough of a quiz. Used by both the student/guest
// "play" flow and the teacher "preview" flow. Real-time multiplayer is backend.
const CHOICE_COLORS = ['#e3564a', '#2c7a47', '#4a7fb5', '#f4b942']

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

  // Per-question countdown. Auto-reveals the answer when it hits zero.
  useEffect(() => {
    if (finished || !question) return
    setTimeLeft(question.seconds || 20)
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setAnswered((wasAnswered) => {
            if (!wasAnswered) setSelected(null)
            return true
          })
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, finished])

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
        <Text style={s.bigTitle}>This quiz has no questions yet</Text>
        <TouchableOpacity style={s.exitBtn} onPress={onExit}>
          <Text style={s.exitText}>Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (finished) {
    const pct = total ? Math.round((correctCount / total) * 100) : 0
    return (
      <ScrollView contentContainerStyle={s.resultScroll}>
        <View style={[s.resultHero, { backgroundColor: quiz.accent || C.leafDark }]}>
          <Text style={s.resultEmoji}>{pct >= 80 ? '🏆' : pct >= 50 ? '🌟' : '🌱'}</Text>
          <Text style={s.resultTitle}>Quiz complete</Text>
          <Text style={s.resultScore}>{score} pts</Text>
          <Text style={s.resultSub}>{correctCount} of {total} correct ({pct}%)</Text>
        </View>
        <TouchableOpacity style={s.primaryBtn} onPress={onExit}>
          <Text style={s.primaryText}>Done</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }

  return (
    <ScrollView contentContainerStyle={s.scroll}>
      <View style={s.topRow}>
        <Text style={s.progress}>Q{index + 1} / {total}</Text>
        <View style={[s.timerPill, timeLeft <= 5 && s.timerLow]}>
          <Text style={[s.timerText, timeLeft <= 5 && s.timerTextLow]}>{timeLeft}s</Text>
        </View>
        <Text style={s.scoreText}>{score} pts</Text>
      </View>

      <View style={s.trackOuter}>
        <View style={[s.trackInner, { width: `${(timeLeft / (question.seconds || 20)) * 100}%`, backgroundColor: quiz.accent || C.leaf }]} />
      </View>

      <View style={s.questionCard}>
        <Text style={s.questionText}>{question.q}</Text>
      </View>

      <View style={s.choices}>
        {question.choices.map((choice, i) => {
          const isAnswer = i === question.answer
          const isPicked = i === selected
          let stateStyle = { backgroundColor: CHOICE_COLORS[i % CHOICE_COLORS.length] }
          if (answered) {
            if (isAnswer) stateStyle = s.choiceCorrect
            else if (isPicked) stateStyle = s.choiceWrong
            else stateStyle = s.choiceDim
          }
          return (
            <TouchableOpacity
              key={i}
              style={[s.choice, stateStyle]}
              activeOpacity={0.85}
              disabled={answered}
              onPress={() => choose(i)}
            >
              <Text style={s.choiceText}>{choice}</Text>
              {answered && isAnswer && <Text style={s.choiceMark}>✓</Text>}
              {answered && isPicked && !isAnswer && <Text style={s.choiceMark}>✕</Text>}
            </TouchableOpacity>
          )
        })}
      </View>

      {answered && (
        <View style={s.feedback}>
          <Text style={s.feedbackText}>
            {selected === question.answer
              ? 'Correct!'
              : selected === null
                ? "Time's up!"
                : 'Not quite.'}
          </Text>
          <TouchableOpacity style={[s.primaryBtn, { marginTop: 12 }]} onPress={next}>
            <Text style={s.primaryText}>{index + 1 >= total ? 'See results' : 'Next question'}</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={s.quitBtn} onPress={onExit}>
        <Text style={s.quitText}>Quit quiz</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  scroll: { padding: 18, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  progress: { color: C.bark, fontWeight: '900', fontSize: 14 },
  scoreText: { color: C.leafDark, fontWeight: '900', fontSize: 14 },
  timerPill: { backgroundColor: '#eef8f1', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 5 },
  timerLow: { backgroundColor: 'rgba(227,86,74,0.16)' },
  timerText: { color: C.leafDark, fontWeight: '900' },
  timerTextLow: { color: '#e3564a' },
  trackOuter: { height: 8, borderRadius: 999, backgroundColor: 'rgba(0,0,0,0.07)', marginTop: 12, overflow: 'hidden' },
  trackInner: { height: 8, borderRadius: 999 },
  questionCard: { backgroundColor: C.white, borderRadius: 22, padding: 22, marginTop: 16, borderWidth: 1, borderColor: C.line, minHeight: 120, justifyContent: 'center' },
  questionText: { color: C.bark, fontSize: 20, fontWeight: '900', lineHeight: 28, textAlign: 'center' },
  choices: { marginTop: 16, gap: 12 },
  choice: { borderRadius: 18, paddingVertical: 18, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  choiceText: { color: C.white, fontWeight: '900', fontSize: 16, flex: 1 },
  choiceMark: { color: C.white, fontWeight: '900', fontSize: 18, marginLeft: 10 },
  choiceCorrect: { backgroundColor: C.leafDark },
  choiceWrong: { backgroundColor: '#b5562a' },
  choiceDim: { backgroundColor: '#c8c2b6' },
  feedback: { marginTop: 18, alignItems: 'center' },
  feedbackText: { color: C.bark, fontWeight: '900', fontSize: 17 },
  primaryBtn: { backgroundColor: C.leafDark, borderRadius: 17, paddingVertical: 15, paddingHorizontal: 30, alignItems: 'center', alignSelf: 'stretch' },
  primaryText: { color: C.cream, fontWeight: '900', fontSize: 16 },
  quitBtn: { marginTop: 22, alignItems: 'center' },
  quitText: { color: C.muted, fontWeight: '800' },
  resultScroll: { padding: 20, paddingBottom: 40, flexGrow: 1, justifyContent: 'center' },
  resultHero: { borderRadius: 30, padding: 30, alignItems: 'center', marginBottom: 20 },
  resultEmoji: { fontSize: 56 },
  resultTitle: { color: C.white, fontSize: 22, fontWeight: '900', marginTop: 10 },
  resultScore: { color: C.white, fontSize: 44, fontWeight: '900', marginTop: 6 },
  resultSub: { color: 'rgba(255,255,255,0.9)', fontWeight: '800', marginTop: 4 },
  exitBtn: { marginTop: 20, backgroundColor: C.leafDark, borderRadius: 16, paddingVertical: 13, paddingHorizontal: 28 },
  exitText: { color: C.cream, fontWeight: '900' },
})
