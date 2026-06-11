import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native'
import { useCollection } from '../store/useCollection'
import { LESSON_TASKS } from '../data/lessonTasks'
import { StatusDot } from '../components/DesignElements'
import { C } from '../theme'

export default function TeacherDashboardScreen() {
  const classroom = useCollection((s) => s.classroom)
  const lessonTasks = useCollection((s) => s.lessonTasks?.length ? s.lessonTasks : LESSON_TASKS)
  const activeTaskId = useCollection((s) => s.activeTaskId)
  const setActiveTask = useCollection((s) => s.setActiveTask)
  const setLessonInfo = useCollection((s) => s.setLessonInfo)
  const addLessonTask = useCollection((s) => s.addLessonTask)
  const completedTasks = useCollection((s) => s.completedTasks)

  const [lesson, setLesson] = useState({
    name: classroom?.name || 'Biology Class',
    code: classroom?.code || 'LEAF-204',
    topic: classroom?.topic || '',
    title: classroom?.title || '',
    description: classroom?.description || '',
  })
  const [mission, setMission] = useState({
    title: '',
    targetPlant: '',
    points: '100',
    question: '',
    answer: '',
  })

  function updateLesson(key, value) {
    setLesson((old) => ({ ...old, [key]: value }))
  }

  function updateMission(key, value) {
    setMission((old) => ({ ...old, [key]: value }))
  }

  function saveLesson() {
    setLessonInfo(lesson)
    Alert.alert('Lesson saved', 'Students will now see the updated classroom lesson.')
  }

  function createMission() {
    if (!mission.title.trim() || !mission.targetPlant.trim()) {
      Alert.alert('Missing details', 'Add a mission title and target plant name.')
      return
    }
    addLessonTask({
      title: mission.title.trim(),
      topic: lesson.topic || classroom?.topic,
      description: `Collect photo evidence for: ${mission.targetPlant.trim()}.`,
      targetPlant: mission.targetPlant.trim(),
      targetCommonNames: [mission.targetPlant.trim()],
      points: mission.points,
      question: mission.question.trim() || `Which plant did you identify for ${mission.title.trim()}?`,
      answer: mission.answer.trim() || mission.targetPlant.trim(),
      choices: [mission.answer.trim() || mission.targetPlant.trim(), 'Different leaf type', 'Different flower', 'Different family'],
      hint: `Search for ${mission.targetPlant.trim()} and compare the photo result before submitting.`,
    })
    setMission({ title: '', targetPlant: '', points: '100', question: '', answer: '' })
    Alert.alert('Mission created', 'The new mission is now live for students.')
  }

  return (
    <ScrollView contentContainerStyle={s.scroll}>
      <View style={s.hero}>
        <Text style={s.eyebrow}>Teacher dashboard</Text>
        <Text style={s.title}>Build the class lesson</Text>
        <Text style={s.sub}>Create the lesson context, publish plant-photo missions, and choose which mission is live.</Text>
      </View>

      <View style={s.card}>
        <Text style={s.section}>Class lesson</Text>
        <Field label="Class name" value={lesson.name} onChangeText={(v) => updateLesson('name', v)} />
        <Field label="Class code" value={lesson.code} onChangeText={(v) => updateLesson('code', v)} autoCapitalize="characters" />
        <Field label="Lesson topic" value={lesson.topic} onChangeText={(v) => updateLesson('topic', v)} />
        <Field label="Lesson title" value={lesson.title} onChangeText={(v) => updateLesson('title', v)} />
        <Field label="Description" value={lesson.description} onChangeText={(v) => updateLesson('description', v)} multiline />
        <TouchableOpacity style={s.primaryBtn} onPress={saveLesson}>
          <Text style={s.primaryText}>Save lesson</Text>
        </TouchableOpacity>
      </View>

      <View style={s.card}>
        <Text style={s.section}>Create plant mission</Text>
        <Field label="Mission title" value={mission.title} onChangeText={(v) => updateMission('title', v)} placeholder="Find a lavender plant" />
        <Field label="Target plant common name" value={mission.targetPlant} onChangeText={(v) => updateMission('targetPlant', v)} placeholder="lavender" />
        <Field label="Points" value={mission.points} onChangeText={(v) => updateMission('points', v)} keyboardType="number-pad" />
        <Field label="Quiz question" value={mission.question} onChangeText={(v) => updateMission('question', v)} placeholder="What adaptation helps this plant?" />
        <Field label="Correct answer" value={mission.answer} onChangeText={(v) => updateMission('answer', v)} placeholder="Aromatic leaves" />
        <TouchableOpacity style={s.primaryBtn} onPress={createMission}>
          <Text style={s.primaryText}>Create and publish mission</Text>
        </TouchableOpacity>
      </View>

      <Text style={s.sectionOutside}>Live mission bank</Text>
      {lessonTasks.map((task) => {
        const isActive = task.id === activeTaskId
        const complete = !!completedTasks[task.id]
        return (
          <View key={task.id} style={[s.taskCard, isActive && s.taskCardActive]}>
            <StatusDot status={complete ? 'done' : isActive ? 'active' : 'neutral'} />
            <View style={{ flex: 1 }}>
              <Text style={s.taskTitle}>{task.title}</Text>
              <Text style={s.taskMeta}>{task.topic} / {task.points} points</Text>
              <Text style={s.taskDesc}>{task.description}</Text>
            </View>
            <TouchableOpacity style={[s.setBtn, isActive && s.setBtnActive]} onPress={() => setActiveTask(task.id)}>
              <Text style={[s.setText, isActive && s.setTextActive]}>{isActive ? 'Live' : 'Set live'}</Text>
            </TouchableOpacity>
          </View>
        )
      })}
    </ScrollView>
  )
}

function Field({ label, multiline = false, ...props }) {
  return (
    <View style={{ marginTop: 10 }}>
      <Text style={s.inputLabel}>{label}</Text>
      <TextInput
        style={[s.input, multiline && s.multiline]}
        placeholderTextColor="#a79f91"
        multiline={multiline}
        {...props}
      />
    </View>
  )
}

const s = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 42 },
  hero: { backgroundColor: C.barkDark, borderRadius: 28, padding: 20, marginBottom: 14 },
  eyebrow: { color: C.leafLight, fontWeight: '900', textTransform: 'uppercase', fontSize: 12 },
  title: { color: C.cream, fontSize: 27, fontWeight: '900', marginTop: 5 },
  sub: { color: 'rgba(246,244,236,0.78)', lineHeight: 20, marginTop: 8 },
  card: { backgroundColor: C.white, borderRadius: 24, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: C.line },
  section: { color: C.bark, fontSize: 18, fontWeight: '900', marginBottom: 4 },
  sectionOutside: { color: C.bark, fontSize: 18, fontWeight: '900', marginBottom: 10, marginTop: 4 },
  inputLabel: { color: C.bark, fontWeight: '800', marginBottom: 6 },
  input: { backgroundColor: C.cream, borderRadius: 15, paddingHorizontal: 13, paddingVertical: 12, color: C.bark, fontWeight: '700', borderWidth: 1, borderColor: C.line },
  multiline: { minHeight: 92, textAlignVertical: 'top' },
  primaryBtn: { backgroundColor: C.leafDark, borderRadius: 17, paddingVertical: 14, alignItems: 'center', marginTop: 14 },
  primaryText: { color: C.cream, fontWeight: '900' },
  taskCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.white, borderRadius: 18, padding: 13, marginBottom: 10, borderWidth: 1.5, borderColor: C.line },
  taskCardActive: { borderColor: C.sun, backgroundColor: '#fffaf0' },
  taskTitle: { color: C.bark, fontWeight: '900', fontSize: 15 },
  taskMeta: { color: C.leafDark, fontWeight: '800', fontSize: 12, marginTop: 2 },
  taskDesc: { color: C.muted, lineHeight: 18, marginTop: 5, fontSize: 12 },
  setBtn: { borderWidth: 1.5, borderColor: C.leafDark, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  setBtnActive: { backgroundColor: C.leafDark },
  setText: { color: C.leafDark, fontWeight: '900', fontSize: 12 },
  setTextActive: { color: C.cream },
})
