import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image, Modal } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { useCollection } from '../store/useCollection'
import { LESSON_TASKS, missionImageForTask } from '../data/lessonTasks'
import { PlantPlaceholder, StatusDot } from '../components/DesignElements'
import { C } from '../theme'

function MissionThumb({ task }) {
  const image = missionImageForTask(task)
  if (!image) {
    return <View style={s.thumb}><PlantPlaceholder size={38} /></View>
  }
  return <Image source={{ uri: image }} style={s.thumb} resizeMode="contain" />
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
        <Text style={s.inputLabel}>Reference picture</Text>
        <ReferenceImagePicker image={mission.imageUri} onPress={chooseReferenceImage} />
        <Field label="Target plant common name" value={mission.targetPlant} onChangeText={(v) => updateMission('targetPlant', v)} placeholder="lavender" />
        <Field label="Points" value={mission.points} onChangeText={(v) => updateMission('points', v)} keyboardType="number-pad" />
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
            <MissionThumb task={task} />
            <View style={{ flex: 1 }}>
              <Text style={s.taskTitle}>{task.title}</Text>
              <Text style={s.taskMeta}>{task.topic} / {task.points} points</Text>
              <Text style={s.taskDesc}>{task.description}</Text>
            </View>
            <View style={s.taskActions}>
              <TouchableOpacity style={[s.setBtn, isActive && s.setBtnActive]} onPress={() => setActiveTask(task.id)}>
                <Text style={[s.setText, isActive && s.setTextActive]}>{isActive ? 'Live' : 'Set'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.deleteBtn} onPress={() => confirmDeleteTask(task)}>
                <Text style={s.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      })}
    </ScrollView>
  )
}

function ReferenceImagePicker({ image, onPress }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <TouchableOpacity style={s.autoPreview} onPress={onPress} activeOpacity={0.85}>
        {image ? (
          <>
            <Image source={{ uri: image }} style={s.autoPreviewImage} resizeMode="contain" />
            <TouchableOpacity style={s.previewInfoBtn} onPress={() => setOpen(true)} activeOpacity={0.82}>
              <Text style={s.previewInfoText}>i</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={s.autoPreviewEmpty}>
            <PlantPlaceholder size={54} />
            <Text style={s.autoPreviewTitle}>Upload image</Text>
            <Text style={s.autoPreviewSub}>Pick a reference photo from your phone.</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={s.modalShade}>
          <View style={s.previewModalCard}>
            <View style={s.previewModalTop}>
              <Text style={s.previewModalTitle}>Reference image</Text>
              <TouchableOpacity style={s.previewClose} onPress={() => setOpen(false)}>
                <Text style={s.previewCloseText}>×</Text>
              </TouchableOpacity>
            </View>
            {!!image && <Image source={{ uri: image }} style={s.previewModalImage} resizeMode="contain" />}
            <TouchableOpacity style={s.replaceImageBtn} onPress={() => { setOpen(false); onPress?.() }}>
              <Text style={s.replaceImageText}>Choose another photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  )
}

function Field({ label, multiline = false, ...props }) {
  return (
    <View style={s.fieldWrap}>
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
  fieldWrap: { marginTop: 10, alignSelf: 'stretch' },
  inputLabel: { color: C.bark, fontWeight: '800', marginBottom: 6, alignSelf: 'flex-start', textAlign: 'left' },
  input: { backgroundColor: C.cream, borderRadius: 15, paddingHorizontal: 13, paddingVertical: 12, color: C.bark, fontWeight: '700', borderWidth: 1, borderColor: C.line },
  multiline: { minHeight: 92, textAlignVertical: 'top' },
  autoPreview: { width: '100%', height: 190, marginTop: 8, marginBottom: 4, borderRadius: 18, overflow: 'hidden', backgroundColor: '#e3f0e6', borderWidth: 1.5, borderColor: C.line },
  autoPreviewImage: { width: '100%', height: 190 },
  autoPreviewEmpty: { height: 190, alignItems: 'center', justifyContent: 'center', padding: 14 },
  previewInfoBtn: { position: 'absolute', right: 8, top: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: C.leafDark, alignItems: 'center', justifyContent: 'center' },
  previewInfoText: { color: C.cream, fontWeight: '900', fontSize: 15, fontStyle: 'italic' },
  modalShade: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', padding: 22 },
  previewModalCard: { backgroundColor: C.white, borderRadius: 24, padding: 16 },
  previewModalTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  previewModalTitle: { color: C.bark, fontWeight: '900', fontSize: 18, flex: 1 },
  previewClose: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' },
  previewCloseText: { color: C.bark, fontSize: 22, fontWeight: '900', lineHeight: 24 },
  previewModalImage: { width: '100%', height: 310, borderRadius: 18, backgroundColor: '#e3f0e6' },
  replaceImageBtn: { backgroundColor: C.leafDark, borderRadius: 16, alignItems: 'center', paddingVertical: 13, marginTop: 14 },
  replaceImageText: { color: C.cream, fontWeight: '900' },
  autoPreviewTitle: { color: C.bark, fontWeight: '900', marginTop: 5, textAlign: 'center', fontSize: 12 },
  autoPreviewSub: { color: C.muted, fontSize: 10, textAlign: 'center', marginTop: 3, lineHeight: 13 },
  primaryBtn: { backgroundColor: C.leafDark, borderRadius: 17, paddingVertical: 14, alignItems: 'center', marginTop: 14 },
  primaryText: { color: C.cream, fontWeight: '900', textAlign: 'center' },
  taskCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.white, borderRadius: 18, padding: 13, marginBottom: 10, borderWidth: 1.5, borderColor: C.line },
  thumb: { width: 58, height: 58, borderRadius: 14, backgroundColor: '#e3f0e6', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  taskCardActive: { borderColor: C.sun, backgroundColor: '#fffaf0' },
  taskTitle: { color: C.bark, fontWeight: '900', fontSize: 15, textAlign: 'left' },
  taskMeta: { color: C.leafDark, fontWeight: '800', fontSize: 12, marginTop: 2, textAlign: 'left' },
  taskDesc: { color: C.muted, lineHeight: 18, marginTop: 5, fontSize: 12, textAlign: 'left' },
  taskActions: { alignSelf: 'stretch', justifyContent: 'center', gap: 8 },
  setBtn: { borderWidth: 1.5, borderColor: C.leafDark, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, alignItems: 'center' },
  setBtnActive: { backgroundColor: C.leafDark },
  setText: { color: C.leafDark, fontWeight: '900', fontSize: 12 },
  setTextActive: { color: C.cream },
  deleteBtn: { borderWidth: 1.5, borderColor: '#b5562a', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, alignItems: 'center' },
  deleteText: { color: '#b5562a', fontWeight: '900', fontSize: 12 },
})
