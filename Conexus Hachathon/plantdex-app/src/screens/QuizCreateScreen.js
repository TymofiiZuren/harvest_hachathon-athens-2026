import { useState } from 'react'
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native'
import { useQuiz } from '../store/useQuiz'
import { blankQuestion, QUIZ_ACCENTS } from '../data/quizzes'
import { Press, Btn } from '../components/ui'
import { T, F } from '../theme'

// Quiz builder: title + topic, then any number of questions,
// each with 2-4 choices and one correct answer.
export default function QuizCreateScreen({ onCancel, onCreated }) {
  const createQuiz = useQuiz((s) => s.createQuiz)
  const [title, setTitle] = useState('')
  const [topic, setTopic] = useState('')
  const [accent, setAccent] = useState(QUIZ_ACCENTS[0])
  const [questions, setQuestions] = useState([blankQuestion()])

  function updateQuestion(qi, patch) {
    setQuestions((list) => list.map((q, i) => (i === qi ? { ...q, ...patch } : q)))
  }

  function updateChoice(qi, ci, value) {
    setQuestions((list) =>
      list.map((q, i) => (i === qi ? { ...q, choices: q.choices.map((c, j) => (j === ci ? value : c)) } : q))
    )
  }

  function addQuestion() {
    setQuestions((list) => [...list, blankQuestion()])
  }

  function removeQuestion(qi) {
    setQuestions((list) => (list.length <= 1 ? list : list.filter((_, i) => i !== qi)))
  }

  function save() {
    if (!title.trim()) {
      Alert.alert('Add a title', 'Give your quiz a name first.')
      return
    }
    const valid = questions.filter((q) => q.q.trim() && q.choices.filter((c) => c.trim()).length >= 2)
    if (!valid.length) {
      Alert.alert('Add a question', 'Each question needs text and at least two answer options.')
      return
    }
    const quiz = createQuiz({ title, topic, accent, questions })
    Alert.alert('Quiz created', `"${quiz.title}" is ready to host. Join code: ${quiz.code}`)
    onCreated?.(quiz)
  }

  return (
    <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <View style={s.headerRow}>
        <Btn label="Cancel" kind="ghost" small onPress={onCancel} />
        <Text style={F.h2}>New quiz</Text>
        <Btn label="Save" small onPress={save} />
      </View>

      <View style={s.card}>
        <Text style={s.label}>Quiz title</Text>
        <TextInput
          style={s.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Soil Heroes"
          placeholderTextColor={T.c.faint}
        />
        <Text style={s.label}>Topic</Text>
        <TextInput
          style={s.input}
          value={topic}
          onChangeText={setTopic}
          placeholder="e.g. Agronomy"
          placeholderTextColor={T.c.faint}
        />
        <Text style={s.label}>Accent color</Text>
        <View style={s.swatchRow}>
          {QUIZ_ACCENTS.map((color) => (
            <Press
              key={color}
              style={[s.swatch, { backgroundColor: color }, accent === color && s.swatchActive]}
              onPress={() => setAccent(color)}
            />
          ))}
        </View>
      </View>

      {questions.map((question, qi) => (
        <View key={question.id} style={s.card}>
          <View style={s.qHeader}>
            <Text style={s.qNumber}>Question {qi + 1}</Text>
            {questions.length > 1 && (
              <Btn label="Remove" kind="danger" small onPress={() => removeQuestion(qi)} />
            )}
          </View>
          <TextInput
            style={[s.input, s.qInput]}
            value={question.q}
            onChangeText={(v) => updateQuestion(qi, { q: v })}
            placeholder="Type the question"
            placeholderTextColor={T.c.faint}
            multiline
          />
          <Text style={s.hint}>Tap a circle to mark the correct answer</Text>
          {question.choices.map((choice, ci) => {
            const isAnswer = question.answer === ci
            return (
              <View key={ci} style={s.choiceRow}>
                <Press
                  style={[s.radio, isAnswer && s.radioActive]}
                  onPress={() => updateQuestion(qi, { answer: ci })}
                >
                  {isAnswer && <Text style={s.radioCheck}>✓</Text>}
                </Press>
                <TextInput
                  style={[s.input, s.choiceInput]}
                  value={choice}
                  onChangeText={(v) => updateChoice(qi, ci, v)}
                  placeholder={`Option ${ci + 1}`}
                  placeholderTextColor={T.c.faint}
                />
              </View>
            )
          })}
        </View>
      ))}

      <Press style={s.addBtn} onPress={addQuestion}>
        <Text style={s.addText}>+ Add question</Text>
      </Press>

      <Btn label="Save quiz" onPress={save} />
    </ScrollView>
  )
}

const s = StyleSheet.create({
  scroll: { padding: 18, paddingBottom: 120 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  card: { backgroundColor: T.c.surface, borderRadius: T.r.lg, borderWidth: 1, borderColor: T.c.line, padding: 16, marginBottom: 14 },
  label: { ...F.micro, marginBottom: 7, marginTop: 8 },
  input: { backgroundColor: T.c.raised, borderRadius: T.r.sm, borderWidth: 1, borderColor: T.c.line, paddingHorizontal: 14, paddingVertical: 12, color: T.c.text, fontSize: 15, fontWeight: '600', marginBottom: 4 },
  swatchRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  swatch: { width: 34, height: 34, borderRadius: 17, borderWidth: 3, borderColor: 'transparent' },
  swatchActive: { borderColor: T.c.text },
  qHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  qNumber: { ...F.bodyStrong, color: T.c.accent },
  qInput: { minHeight: 58, textAlignVertical: 'top' },
  hint: { ...F.body, fontSize: 12, marginTop: 10, marginBottom: 4 },
  choiceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  radio: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: T.c.lineStrong, alignItems: 'center', justifyContent: 'center' },
  radioActive: { backgroundColor: T.c.accent, borderColor: T.c.accent },
  radioCheck: { color: T.c.onAccent, fontWeight: '800', fontSize: 14 },
  choiceInput: { flex: 1, marginBottom: 0 },
  addBtn: { borderWidth: 1.5, borderColor: 'rgba(74,222,128,0.4)', borderStyle: 'dashed', borderRadius: T.r.sm, paddingVertical: 15, alignItems: 'center', marginBottom: 14 },
  addText: { color: T.c.accent, fontWeight: '800', fontSize: 14 },
})
