import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native'
import { useQuiz } from '../store/useQuiz'
import { blankQuestion, QUIZ_ACCENTS } from '../data/quizzes'
import { C } from '../theme'

// Kahoot-style quiz builder: title + topic, then any number of questions,
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
    <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
      <View style={s.headerRow}>
        <TouchableOpacity onPress={onCancel}><Text style={s.cancel}>Cancel</Text></TouchableOpacity>
        <Text style={s.headerTitle}>New quiz</Text>
        <TouchableOpacity onPress={save}><Text style={s.save}>Save</Text></TouchableOpacity>
      </View>

      <View style={s.card}>
        <Text style={s.label}>Quiz title</Text>
        <TextInput style={s.input} value={title} onChangeText={setTitle} placeholder="e.g. Soil Heroes" placeholderTextColor="#a79f91" />
        <Text style={[s.label, { marginTop: 12 }]}>Topic</Text>
        <TextInput style={s.input} value={topic} onChangeText={setTopic} placeholder="e.g. Agronomy" placeholderTextColor="#a79f91" />
        <Text style={[s.label, { marginTop: 14 }]}>Accent color</Text>
        <View style={s.swatchRow}>
          {QUIZ_ACCENTS.map((color) => (
            <TouchableOpacity
              key={color}
              style={[s.swatch, { backgroundColor: color }, accent === color && s.swatchActive]}
              onPress={() => setAccent(color)}
            />
          ))}
        </View>
      </View>

      {questions.map((question, qi) => (
        <View key={question.id} style={s.qCard}>
          <View style={s.qHeader}>
            <Text style={s.qNumber}>Question {qi + 1}</Text>
            {questions.length > 1 && (
              <TouchableOpacity onPress={() => removeQuestion(qi)}>
                <Text style={s.remove}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
          <TextInput
            style={[s.input, s.qInput]}
            value={question.q}
            onChangeText={(v) => updateQuestion(qi, { q: v })}
            placeholder="Type the question"
            placeholderTextColor="#a79f91"
            multiline
          />
          <Text style={s.hint}>Tap a circle to mark the correct answer</Text>
          {question.choices.map((choice, ci) => {
            const isAnswer = question.answer === ci
            return (
              <View key={ci} style={s.choiceRow}>
                <TouchableOpacity
                  style={[s.radio, isAnswer && s.radioActive]}
                  onPress={() => updateQuestion(qi, { answer: ci })}
                >
                  {isAnswer && <Text style={s.radioCheck}>✓</Text>}
                </TouchableOpacity>
                <TextInput
                  style={[s.input, s.choiceInput]}
                  value={choice}
                  onChangeText={(v) => updateChoice(qi, ci, v)}
                  placeholder={`Option ${ci + 1}`}
                  placeholderTextColor="#a79f91"
                />
              </View>
            )
          })}
        </View>
      ))}

      <TouchableOpacity style={s.addBtn} onPress={addQuestion}>
        <Text style={s.addText}>+ Add question</Text>
      </TouchableOpacity>

      <TouchableOpacity style={s.saveBtn} onPress={save}>
        <Text style={s.saveBtnText}>Save quiz</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 44 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  headerTitle: { color: C.bark, fontWeight: '900', fontSize: 18 },
  cancel: { color: C.muted, fontWeight: '800' },
  save: { color: C.leafDark, fontWeight: '900' },
  card: { backgroundColor: C.white, borderRadius: 22, padding: 16, borderWidth: 1, borderColor: C.line, marginBottom: 14 },
  label: { color: C.bark, fontWeight: '800', marginBottom: 6 },
  input: { backgroundColor: C.cream, borderRadius: 14, paddingHorizontal: 13, paddingVertical: 12, color: C.bark, fontWeight: '700', borderWidth: 1, borderColor: C.line },
  swatchRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  swatch: { width: 34, height: 34, borderRadius: 999, borderWidth: 3, borderColor: 'transparent' },
  swatchActive: { borderColor: C.bark },
  qCard: { backgroundColor: C.white, borderRadius: 22, padding: 16, borderWidth: 1, borderColor: C.line, marginBottom: 14 },
  qHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  qNumber: { color: C.leafDark, fontWeight: '900' },
  remove: { color: '#b5562a', fontWeight: '800', fontSize: 13 },
  qInput: { minHeight: 56, textAlignVertical: 'top' },
  hint: { color: C.muted, fontSize: 12, marginTop: 10, marginBottom: 6, fontWeight: '700' },
  choiceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  radio: { width: 30, height: 30, borderRadius: 999, borderWidth: 2, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  radioActive: { backgroundColor: C.leafDark, borderColor: C.leafDark },
  radioCheck: { color: C.cream, fontWeight: '900' },
  choiceInput: { flex: 1 },
  addBtn: { borderWidth: 2, borderColor: C.leaf, borderStyle: 'dashed', borderRadius: 18, paddingVertical: 15, alignItems: 'center', marginBottom: 16 },
  addText: { color: C.leafDark, fontWeight: '900' },
  saveBtn: { backgroundColor: C.leafDark, borderRadius: 18, paddingVertical: 16, alignItems: 'center' },
  saveBtnText: { color: C.cream, fontWeight: '900', fontSize: 16 },
})
