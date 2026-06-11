import { useState } from 'react'
import {
  View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet, ScrollView, Alert, Modal,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { identifyPlant } from '../services/plantnet'
import ResultCard from './ResultCard'
import { LESSON_TASKS, matchPlantToTask, missionImageForTask } from '../data/lessonTasks'
import { CameraGlyph, PlantPlaceholder } from '../components/DesignElements'
import { useCollection } from '../store/useCollection'
import { C } from '../theme'

export default function ScanScreen({ onGoCollection, freeScan = false }) {
  const [status, setStatus] = useState('idle') // idle | scanning | result | notplant | error
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [taskStatus, setTaskStatus] = useState(null)
  const [hintOpen, setHintOpen] = useState(false)
  const activeTaskId = useCollection((s) => s.activeTaskId)
  const lessonTasks = useCollection((s) => s.lessonTasks?.length ? s.lessonTasks : LESSON_TASKS)
  const recordWrongTask = useCollection((s) => s.recordWrongTask)
  // In free mode (guests / casual use) the scanner is a plain plant identifier
  // with no classroom mission attached.
  const activeTask = freeScan ? null : (lessonTasks.find((task) => task.id === activeTaskId) || lessonTasks[0])

  async function pickFrom(launcher, requestPerm, source = 'camera') {
    const perm = await requestPerm()
    if (!perm.granted) {
      Alert.alert('No access', 'Please allow camera / gallery access in settings.')
      return
    }
    const res = await launcher({ quality: 0.6 })
    if (res.canceled) return
    const asset = await prepareImageForPlantNet(res.assets[0])
    setPreview(asset.uri)
    setStatus('scanning')
    try {
      const r = await identifyPlant(asset)
      if (r.notPlant) {
        if (activeTask) {
          recordWrongTask(activeTask, { commonName: 'Not a plant' }, asset.uri)
          setTaskStatus({ correct: false, message: activeTask.failText, source })
        }
        setStatus('notplant')
        return
      }

      const identified = { ...r, cameraPhoto: asset.uri, image: asset.uri }
      if (activeTask) {
        const correct = matchPlantToTask(identified, activeTask)
        setTaskStatus({
          correct,
          message: correct ? activeTask.successText : activeTask.failText,
          source,
        })
        if (!correct) recordWrongTask(activeTask, identified, asset.uri)
      }
      setResult(identified)
      setStatus('result')
    } catch (e) {
      setStatus('error')
    }
  }

  const takePhoto = () =>
    pickFrom(ImagePicker.launchCameraAsync, ImagePicker.requestCameraPermissionsAsync, 'camera')
  const pickGallery = () =>
    pickFrom(ImagePicker.launchImageLibraryAsync, ImagePicker.requestMediaLibraryPermissionsAsync, 'gallery')

  function reset() {
    setStatus('idle')
    setResult(null)
    setPreview(null)
    setTaskStatus(null)
  }

  return (
    <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
      {status === 'idle' && (
        <View style={s.center}>
          {activeTask && (
            <View style={s.taskBanner}>
              <View style={s.taskTopRow}>
                <Text style={s.taskLabel}>Classroom task</Text>
                <TouchableOpacity style={s.infoBtn} onPress={() => setHintOpen(true)}>
                  <Text style={s.infoText}>i</Text>
                </TouchableOpacity>
              </View>
              <Text style={s.taskTitle}>{activeTask.title}</Text>
              <Text style={s.taskDesc}>{activeTask.description}</Text>
              <Text style={s.taskPoints}>{activeTask.points} pts / camera or gallery evidence</Text>
            </View>
          )}
          <Text style={s.title}>Find a plant</Text>
          <Text style={s.subtitle}>
            {freeScan
              ? 'Take a photo or choose one from your gallery to identify any plant and add it to your collection.'
              : 'Take a photo or choose one from your gallery. Correct plant evidence earns points; wrong evidence makes the class garden lose health.'}
          </Text>

          <TouchableOpacity style={s.scanBtn} onPress={takePhoto} activeOpacity={0.85}>
            <CameraGlyph color={C.white} />
            <Text style={s.scanLabel}>Scan plant</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.linkBtn} onPress={pickGallery}>
            <Text style={s.linkText}>Pick from gallery</Text>
          </TouchableOpacity>
        </View>
      )}

      {activeTask && <TaskHintModal task={activeTask} visible={hintOpen} onClose={() => setHintOpen(false)} />}

      {status === 'scanning' && (
        <View style={s.center}>
          {preview && <Image source={{ uri: preview }} style={s.preview} />}
          <View style={s.row}>
            <ActivityIndicator color={C.leafDark} size="large" />
            <Text style={s.scanningText}>Identifying plant…</Text>
          </View>
        </View>
      )}

      {status === 'result' && result && (
        <ResultCard
          result={result}
          preview={preview}
          activeTask={activeTask}
          taskStatus={taskStatus}
          onScanAgain={reset}
          onGoCollection={onGoCollection}
        />
      )}

      {status === 'notplant' && (
        <View style={s.center}>
          {preview && <Image source={{ uri: preview }} style={s.previewSmall} />}
          <PlantPlaceholder size={78} />
          <Text style={s.title}>That does not look like a plant</Text>
          <Text style={s.subtitle}>
            {freeScan
              ? 'Point the camera at a single leaf or flower, fill the frame, and try again.'
              : 'Bad outcome: the classroom seedling wilted. Point the camera at a single leaf or flower and try again.'}
          </Text>
          <TouchableOpacity style={s.scanBtnSmall} onPress={reset}>
            <Text style={s.scanLabel}>Try again</Text>
          </TouchableOpacity>
        </View>
      )}

      {status === 'error' && (
        <View style={s.center}>
          <PlantPlaceholder size={78} />
          <Text style={s.title}>Something went wrong</Text>
          <Text style={s.subtitle}>Check your connection and try again.</Text>
          <TouchableOpacity style={s.scanBtnSmall} onPress={reset}>
            <Text style={s.scanLabel}>Try again</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  )
}

function TaskHintModal({ task, visible, onClose }) {
  const image = missionImageForTask(task)
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.modalShade}>
        <View style={s.hintCard}>
          <View style={s.hintTopRow}>
            <Text style={s.hintLabel}>Plant hint</Text>
            <TouchableOpacity style={s.closeCircle} onPress={onClose}>
              <Text style={s.closeCircleText}>×</Text>
            </TouchableOpacity>
          </View>
          <Text style={s.hintTitle}>{task.title}</Text>
          {image ? (
            <Image source={{ uri: image }} style={s.hintImage} resizeMode="contain" />
          ) : (
            <View style={s.hintImage}><PlantPlaceholder size={92} /></View>
          )}
          <Text style={s.hintBody}>{task.hint}</Text>
          <TouchableOpacity style={s.hintCloseBtn} onPress={onClose}>
            <Text style={s.hintCloseText}>Back to scan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

async function prepareImageForPlantNet(asset) {
  try {
    const largestSide = Math.max(asset.width || 0, asset.height || 0)
    const resize = largestSide > 1600
      ? [asset.width >= asset.height ? { resize: { width: 1600 } } : { resize: { height: 1600 } }]
      : []

    // Internet images saved to the gallery are often WEBP/PNG/HEIC or very large.
    // Convert everything to a normal JPEG file so Pl@ntNet receives a format it reliably accepts.
    const converted = await ImageManipulator.manipulateAsync(asset.uri, resize, {
      compress: 0.85,
      format: ImageManipulator.SaveFormat.JPEG,
    })

    return {
      ...asset,
      uri: converted.uri,
      width: converted.width,
      height: converted.height,
      fileName: 'plant-photo.jpg',
      mimeType: 'image/jpeg',
    }
  } catch (e) {
    return {
      ...asset,
      fileName: asset.fileName || 'plant-photo.jpg',
      mimeType: asset.mimeType || 'image/jpeg',
    }
  }
}

const s = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40, flexGrow: 1 },
  center: { alignItems: 'center', paddingTop: 24 },
  taskBanner: { width: '100%', backgroundColor: C.white, borderRadius: 20, padding: 16, borderWidth: 2, borderColor: 'rgba(58,157,93,0.22)', marginBottom: 18 },
  taskTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  taskLabel: { color: C.leafDark, fontWeight: '900', fontSize: 12, textTransform: 'uppercase' },
  infoBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: C.leafDark, alignItems: 'center', justifyContent: 'center' },
  infoText: { color: C.cream, fontWeight: '900', fontSize: 16, fontStyle: 'italic' },
  taskTitle: { color: C.bark, fontSize: 19, fontWeight: '900', marginTop: 4 },
  taskDesc: { color: C.muted, marginTop: 5, lineHeight: 19 },
  taskPoints: { color: C.bark, fontWeight: '800', marginTop: 8 },
  title: { fontSize: 22, fontWeight: '800', color: C.bark, marginTop: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: C.muted, textAlign: 'center', marginTop: 6, maxWidth: 300, lineHeight: 20 },
  scanBtn: {
    width: 180, height: 180, borderRadius: 90, backgroundColor: C.leaf,
    alignItems: 'center', justifyContent: 'center', marginTop: 36,
    shadowColor: C.leafDark, shadowOpacity: 0.4, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 8,
  },
  scanBtnSmall: {
    paddingHorizontal: 32, paddingVertical: 14, borderRadius: 999, backgroundColor: C.leaf, marginTop: 24,
  },
  scanLabel: { color: C.white, fontSize: 18, fontWeight: '900', marginTop: 12 },
  linkBtn: { marginTop: 28 },
  linkText: { color: C.leafDark, fontWeight: '700', fontSize: 15 },
  preview: { width: 240, height: 240, borderRadius: 28, marginBottom: 24 },
  previewSmall: { width: 140, height: 140, borderRadius: 20, marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  scanningText: { color: C.leafDark, fontWeight: '700', fontSize: 16 },
  modalShade: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', padding: 22 },
  hintCard: { backgroundColor: C.white, borderRadius: 26, padding: 18, maxHeight: '86%' },
  hintTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  hintLabel: { color: C.leafDark, fontWeight: '900', textTransform: 'uppercase', fontSize: 12, letterSpacing: 0.8 },
  closeCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' },
  closeCircleText: { color: C.bark, fontSize: 22, fontWeight: '900', lineHeight: 24 },
  hintTitle: { color: C.bark, fontWeight: '900', fontSize: 22, marginTop: 8 },
  hintImage: { width: '100%', height: 230, borderRadius: 18, backgroundColor: '#e3f0e6', marginTop: 14, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  hintBody: { color: C.muted, lineHeight: 21, marginTop: 14, fontWeight: '700' },
  hintCloseBtn: { backgroundColor: C.leafDark, borderRadius: 16, alignItems: 'center', paddingVertical: 14, marginTop: 16 },
  hintCloseText: { color: C.cream, fontWeight: '900' },
})
