import { useState } from 'react'
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, Image } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { useCollection } from '../store/useCollection'
import { LESSON_TASKS, missionImageForTask } from '../data/lessonTasks'
import { PlantPlaceholder, StatusDot } from '../components/DesignElements'
import { Press, Btn, Tile } from '../components/ui'
import { T, F } from '../theme'

function MissionThumb({ task }) {
  const image = missionImageForTask(task)
  if (!image) {
    return (
      <View style={s.thumb}>
        <PlantPlaceholder size={34} />
      </View>
    )
  }
  return <Image source={{ uri: image }} style={s.thumb} resizeMode="cover" />
}

export default function TeacherDashboardScreen() {
  const classroom = useCollection((s) => s.classroom)
  const lessonTasks = useCollection((s) => s.lessonTasks?.length ? s.lessonTasks : LESSON_TASKS)
  const activeTaskId = useCollection((s) => s.activeTaskId)
  const setActiveTask = useCollection((s) => s.setActiveTask)
  const setLessonInfo = useCollection((s) => s.setLessonInfo)
  const addLessonTask = useCollection((s) => s.addLessonTask)
  const deleteLessonTask = useCollection((s) => s.deleteLessonTask)
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
    imageUri: '',
    points: '100',
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

  async function chooseReferenceImage() {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!perm.granted) {
        Alert.alert('No access', 'Please allow photo library access to choose a mission image.')
        return
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        quality: 0.75,
        mediaTypes: ['images'],
      })
      if (res.canceled) return
      updateMission('imageUri', res.assets[0].uri)
    } catch (e) {
      Alert.alert('Gallery problem', 'Could not open the photo library. Please try again.')
    }
  }

  function confirmDeleteTask(task) {
    Alert.alert(
      'Delete mission?',
      `Remove "${task.title}" from the class mission bank?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteLessonTask(task.id) },
      ]
    )
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
      targetImage: mission.imageUri,
      points: mission.points,
      hint: `Search for ${mission.targetPlant.trim()} and compare your find with the mission image before submitting.`,
    })
    setMission({ title: '', targetPlant: '', imageUri: '', points: '100' })
    Alert.alert('Mission created', 'The new mission is now live for students.')
  }

  const completedCount = Object.keys(completedTasks || {}).length

  return (
    <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      <View style={s.headerBlock}>
        <Text style={F.micro}>Teacher studio</Text>
        <Text style={[F.display, s.headerTitle]}>Dashboard</Text>
      </View>

      <View style={s.statsRow}>
        <Tile value={lessonTasks.length} label="Missions" tone="accent" />
        <Tile value={completedCount} label="Completed" />
        <Tile value={classroom?.students?.length || 0} label="Students" />
      </View>

      <View style={s.card}>
        <Text style={F.h2}>Class lesson</Text>
        <Field label="Class name" value={lesson.name} onChangeText={(v) => updateLesson('name', v)} />
        <Field label="Class code" value={lesson.code} onChangeText={(v) => updateLesson('code', v)} autoCapitalize="characters" />
        <Field label="Lesson topic" value={lesson.topic} onChangeText={(v) => updateLesson('topic', v)} />
        <Field label="Lesson title" value={lesson.title} onChangeText={(v) => updateLesson('title', v)} />
        <Field label="Description" value={lesson.description} onChangeText={(v) => updateLesson('description', v)} multiline />
        <Btn label="Save lesson" onPress={saveLesson} style={s.cardBtn} />
      </View>

      <View style={s.card}>
        <Text style={F.h2}>Create plant mission</Text>
        <Field label="Mission title" value={mission.title} onChangeText={(v) => updateMission('title', v)} placeholder="Find a lavender plant" />
        <Text style={s.label}>Reference picture</Text>
        <Press style={s.imagePick} onPress={chooseReferenceImage}>
          {mission.imageUri ? (
            <Image source={{ uri: mission.imageUri }} style={s.imagePickPhoto} resizeMode="cover" />
          ) : (
            <View style={s.imagePickEmpty}>
              <PlantPlaceholder size={48} />
              <Text style={s.imagePickText}>Tap to upload a reference photo</Text>
            </View>
          )}
        </Press>
        <Field label="Target plant common name" value={mission.targetPlant} onChangeText={(v) => updateMission('targetPlant', v)} placeholder="lavender" />
        <Field label="Points" value={mission.points} onChangeText={(v) => updateMission('points', v)} keyboardType="number-pad" />
        <Btn label="Create & publish mission" onPress={createMission} style={s.cardBtn} />
      </View>

      <Text style={s.section}>Mission bank</Text>
      {lessonTasks.map((task) => {
        const isActive = task.id === activeTaskId
        const complete = !!completedTasks[task.id]
        return (
          <View key={task.id} style={[s.taskCard, isActive && s.taskCardActive]}>
            <StatusDot status={complete ? 'done' : isActive ? 'active' : 'neutral'} />
            <MissionThumb task={task} />
            <View style={s.flex1}>
              <Text style={F.bodyStrong}>{task.title}</Text>
              <Text style={s.taskMeta}>{task.topic} · {task.points} pts</Text>
            </View>
            <View style={s.taskActions}>
              <Btn
                label={isActive ? 'Live' : 'Set live'}
                kind={isActive ? 'primary' : 'raised'}
                small
                onPress={() => setActiveTask(task.id)}
              />
              <Btn label="Delete" kind="danger" small onPress={() => confirmDeleteTask(task)} />
            </View>
          </View>
        )
      })}
    </ScrollView>
  )
}

function Field({ label, multiline = false, ...props }) {
  return (
    <View style={s.fieldWrap}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        style={[s.input, multiline && s.multiline]}
        placeholderTextColor={T.c.faint}
        multiline={multiline}
        {...props}
      />
    </View>
  )
}

const s = StyleSheet.create({
  scroll: { padding: 18, paddingBottom: 120 },
  headerBlock: { marginBottom: 16 },
  headerTitle: { marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  card: { backgroundColor: T.c.surface, borderRadius: T.r.lg, borderWidth: 1, borderColor: T.c.line, padding: 16, marginBottom: 16 },
  cardBtn: { marginTop: 14 },
  fieldWrap: { marginTop: 10 },
  label: { ...F.micro, marginBottom: 6, marginTop: 10 },
  input: { backgroundColor: T.c.raised, borderRadius: T.r.sm, borderWidth: 1, borderColor: T.c.line, paddingHorizontal: 14, paddingVertical: 12, color: T.c.text, fontSize: 15, fontWeight: '600' },
  multiline: { minHeight: 90, textAlignVertical: 'top' },
  imagePick: { height: 170, borderRadius: T.r.md, backgroundColor: T.c.raised, borderWidth: 1, borderColor: T.c.line, overflow: 'hidden' },
  imagePickPhoto: { width: '100%', height: '100%' },
  imagePickEmpty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  imagePickText: { ...F.body, fontSize: 12 },
  section: { ...F.h2, marginBottom: 10 },
  taskCard: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: T.c.surface, borderRadius: T.r.md, borderWidth: 1, borderColor: T.c.line, padding: 13, marginBottom: 9 },
  taskCardActive: { borderColor: 'rgba(245,192,78,0.4)' },
  taskMeta: { ...F.body, fontSize: 12, marginTop: 1 },
  taskActions: { gap: 6 },
  flex1: { flex: 1 },
  thumb: { width: 46, height: 46, borderRadius: 12, backgroundColor: T.c.photo, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
})
