import { useEffect, useRef, useState } from 'react'
import { View, Text, Image, ActivityIndicator, StyleSheet, ScrollView, Alert, Animated } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { identifyPlant } from '../services/plantnet'
import ResultCard from './ResultCard'
import { LESSON_TASKS, matchPlantToTask, missionImageForTask } from '../data/lessonTasks'
import { CameraGlyph, PlantPlaceholder } from '../components/DesignElements'
import { Press, Btn, Sheet, Tag } from '../components/ui'
import { useCollection } from '../store/useCollection'
import { T, F } from '../theme'

export default function ScanScreen({ onGoCollection, freeScan = false }) {
  const [status, setStatus] = useState('idle') // idle | scanning | result | notplant | error
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [taskStatus, setTaskStatus] = useState(null)
  const [hintOpen, setHintOpen] = useState(false)
  // Students choose what a scan counts for: the live class mission, or a
  // personal scan that just grows their own dex (no mission, no garden risk).
  const [scanMode, setScanMode] = useState('mission') // mission | me
  const activeTaskId = useCollection((s) => s.activeTaskId)
  const lessonTasks = useCollection((s) => s.lessonTasks?.length ? s.lessonTasks : LESSON_TASKS)
  const recordWrongTask = useCollection((s) => s.recordWrongTask)
  // In free mode (guests / casual use / "just for me" scans) the scanner is a
  // plain plant identifier with no classroom mission attached.
  const personal = freeScan || scanMode === 'me'
  const activeTask = personal ? null : (lessonTasks.find((task) => task.id === activeTaskId) || lessonTasks[0])

  async function pickFrom(launcher, requestPerm, source = 'camera') {
    let asset
    try {
      const perm = await requestPerm()
      if (!perm.granted) {
        Alert.alert('No access', 'Please allow camera / gallery access in settings.')
        return
      }
      const res = await launcher({ quality: 0.6 })
      if (res.canceled) return
      asset = await prepareImageForPlantNet(res.assets[0])
    } catch (e) {
      Alert.alert('Camera problem', 'Could not open the camera or gallery. Please try again.')
      return
    }
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
    <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      {status === 'idle' && (
        <View style={s.center}>
          {!freeScan && (
            <View style={s.modeRow}>
              <Press
                style={[s.modeBtn, scanMode === 'mission' && s.modeBtnOn]}
                onPress={() => setScanMode('mission')}
              >
                <Text style={[s.modeText, scanMode === 'mission' && s.modeTextOn]}>Class mission</Text>
              </Press>
              <Press
                style={[s.modeBtn, scanMode === 'me' && s.modeBtnOn]}
                onPress={() => setScanMode('me')}
              >
                <Text style={[s.modeText, scanMode === 'me' && s.modeTextOn]}>Just for me</Text>
              </Press>
            </View>
          )}

          {activeTask && (
            <Press style={s.missionPill} onPress={() => setHintOpen(true)}>
              <Tag label={`+${activeTask.points}`} tone="gold" />
              <View style={s.flex1}>
                <Text style={F.bodyStrong} numberOfLines={1}>{activeTask.title}</Text>
                <Text style={s.missionPillSub} numberOfLines={1}>{activeTask.description}</Text>
              </View>
              <View style={s.infoDot}><Text style={s.infoDotText}>i</Text></View>
            </Press>
          )}

          <Text style={[F.display, s.title]}>Find a plant</Text>
          <Text style={[F.body, s.subtitle]}>
            {freeScan
              ? 'Point the camera at any plant to identify it and add it to your collection.'
              : personal
                ? 'Personal scan — anything you find goes straight to your own dex. No mission, no garden risk.'
                : 'Correct evidence earns points. Wrong evidence wilts the class garden.'}
          </Text>

          <ScanButton onPress={takePhoto} />

          <Btn label="Choose from gallery" kind="ghost" onPress={pickGallery} style={{ marginTop: 18 }} />
        </View>
      )}

      {activeTask && <HintSheet task={activeTask} visible={hintOpen} onClose={() => setHintOpen(false)} />}

      {status === 'scanning' && (
        <View style={s.center}>
          {preview && <Image source={{ uri: preview }} style={s.preview} />}
          <View style={s.scanningRow}>
            <ActivityIndicator color={T.c.accent} size="small" />
            <Text style={s.scanningText}>Identifying…</Text>
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
          <PlantPlaceholder size={72} />
          <Text style={[F.h1, s.stateTitle]}>That doesn't look like a plant</Text>
          <Text style={[F.body, s.subtitle]}>
            {personal
              ? 'Fill the frame with a single leaf or flower and try again.'
              : 'The class seedling wilted. Fill the frame with one leaf or flower and retry.'}
          </Text>
          <Btn label="Try again" onPress={reset} style={s.stateBtn} />
        </View>
      )}

      {status === 'error' && (
        <View style={s.center}>
          <PlantPlaceholder size={72} />
          <Text style={[F.h1, s.stateTitle]}>Something went wrong</Text>
          <Text style={[F.body, s.subtitle]}>Check your connection and try again.</Text>
          <Btn label="Try again" onPress={reset} style={s.stateBtn} />
        </View>
      )}
    </ScrollView>
  )
}

// Big circular shutter with a slow pulsing halo.
function ScanButton({ onPress }) {
  const pulse = useRef(new Animated.Value(0)).current
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    )
    loop.start()
    return () => loop.stop()
  }, [])

  return (
    <View style={s.shutterWrap}>
      <Animated.View
        style={[
          s.halo,
          {
            opacity: pulse.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0.35, 0.08, 0] }),
            transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.45] }) }],
          },
        ]}
      />
      <Press style={s.shutter} onPress={onPress}>
        <CameraGlyph color={T.c.onAccent} />
        <Text style={s.shutterText}>Scan</Text>
      </Press>
    </View>
  )
}

function HintSheet({ task, visible, onClose }) {
  const image = missionImageForTask(task)
  return (
    <Sheet visible={visible} onClose={onClose}>
      <Text style={F.micro}>What to look for</Text>
      <Text style={[F.h1, { marginTop: 4 }]}>{task.title}</Text>
      {image ? (
        <Image source={{ uri: image }} style={s.hintImage} resizeMode="cover" />
      ) : (
        <View style={[s.hintImage, s.hintImageEmpty]}>
          <PlantPlaceholder size={84} />
        </View>
      )}
      <Text style={[F.body, { marginTop: 14 }]}>{task.hint}</Text>
      <Btn label="Back to scan" onPress={onClose} style={{ marginTop: 18 }} />
    </Sheet>
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
  scroll: { padding: 18, paddingBottom: 120, flexGrow: 1 },
  center: { alignItems: 'center', paddingTop: 10 },
  flex1: { flex: 1 },
  modeRow: { flexDirection: 'row', alignSelf: 'stretch', backgroundColor: T.c.surface, borderRadius: T.r.full, borderWidth: 1, borderColor: T.c.line, padding: 4, gap: 4, marginBottom: 14 },
  modeBtn: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: T.r.full },
  modeBtnOn: { backgroundColor: T.c.accentSoft },
  modeText: { fontSize: 12, fontWeight: '800', color: T.c.faint },
  modeTextOn: { color: T.c.accent },
  missionPill: { flexDirection: 'row', alignItems: 'center', gap: 10, alignSelf: 'stretch', backgroundColor: T.c.surface, borderRadius: T.r.md, borderWidth: 1, borderColor: T.c.line, padding: 12, marginBottom: 26 },
  missionPillSub: { ...F.body, fontSize: 12, marginTop: 1 },
  infoDot: { width: 26, height: 26, borderRadius: 13, backgroundColor: T.c.accentSoft, alignItems: 'center', justifyContent: 'center' },
  infoDotText: { color: T.c.accent, fontWeight: '800', fontStyle: 'italic', fontSize: 14 },
  title: { textAlign: 'center', marginTop: 8 },
  subtitle: { textAlign: 'center', marginTop: 8, maxWidth: 290 },
  shutterWrap: { marginTop: 38, alignItems: 'center', justifyContent: 'center' },
  halo: { position: 'absolute', width: 168, height: 168, borderRadius: 84, backgroundColor: T.c.accent },
  shutter: { width: 168, height: 168, borderRadius: 84, backgroundColor: T.c.accent, alignItems: 'center', justifyContent: 'center', gap: 8 },
  shutterText: { color: T.c.onAccent, fontSize: 17, fontWeight: '800' },
  preview: { width: 230, height: 230, borderRadius: T.r.lg, marginBottom: 22 },
  previewSmall: { width: 130, height: 130, borderRadius: T.r.md, marginBottom: 16 },
  scanningRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  scanningText: { ...F.bodyStrong, fontSize: 15 },
  stateTitle: { textAlign: 'center', marginTop: 12 },
  stateBtn: { marginTop: 22, alignSelf: 'stretch' },
  hintImage: { width: '100%', height: 210, borderRadius: T.r.md, backgroundColor: T.c.photo, marginTop: 14 },
  hintImageEmpty: { alignItems: 'center', justifyContent: 'center' },
})
