import { useState } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { PlantPlaceholder, StatusDot } from '../components/DesignElements'
import { useCollection } from '../store/useCollection'
import { C } from '../theme'

export default function ResultCard({ result, preview, activeTask, taskStatus, onScanAgain, onGoCollection }) {
  const addSighting = useCollection((st) => st.addSighting)
  const completeTask = useCollection((st) => st.completeTask)
  const [added, setAdded] = useState(null)

  const image = preview || result.cameraPhoto || result.image
  const isTaskScan = !!activeTask && taskStatus
  const taskCorrect = isTaskScan && taskStatus.correct
  const taskWrong = isTaskScan && taskStatus.correct === false

  function handleAdd() {
    const plantWithPhoto = { ...result, image, cameraPhoto: preview || result.cameraPhoto || image }
    const sighting = addSighting(plantWithPhoto)
    let taskOutcome = null
    if (taskCorrect) taskOutcome = completeTask(activeTask, plantWithPhoto, image)
    setAdded({ ...sighting, taskOutcome })
  }

  return (
    <View style={s.wrap}>
      <View style={s.card}>
        <View style={s.photoBox}>
          {image ? (
            <Image source={{ uri: image }} style={s.photo} resizeMode="cover" />
          ) : (
            <PlantPlaceholder size={96} />
          )}
          {typeof result.confidence === 'number' && (
            <View style={s.badge}>
              <Text style={s.badgeText}>{result.confidence}% match</Text>
            </View>
          )}
        </View>

        <View style={s.body}>
          {taskStatus && (
            <View style={[s.taskResult, taskCorrect ? s.taskGood : taskWrong ? s.taskBad : s.taskPractice]}>
              <View style={s.taskResultHeader}>
                <StatusDot status={taskCorrect ? 'done' : taskWrong ? 'bad' : 'active'} />
                <Text style={s.taskResultText}>
                  {taskCorrect ? 'Correct evidence' : taskWrong ? 'Wrong evidence' : 'Plant scan'}
                </Text>
              </View>
              <Text style={s.taskResultSub}>{taskStatus.message}</Text>
            </View>
          )}
          <Text style={s.name}>{result.commonName}</Text>
          <Text style={s.sci}>{result.scientificName}</Text>
          {!!result.family && (
            <View style={s.familyChip}>
              <Text style={s.familyText}>Family: {result.family}</Text>
            </View>
          )}
          {!!result.description && <Text style={s.desc}>{result.description}</Text>}
          {result.source === 'offline' && (
            <Text style={s.note}>
              Demo mode: could not reach the API{result.reason ? ` (${result.reason})` : ''}. Showing a sample.
            </Text>
          )}
        </View>
      </View>

      {!added && taskWrong ? (
        <View style={s.failBox}>
          <Text style={s.failTitle}>No points this time</Text>
          <Text style={s.failSub}>The task answer was wrong, so the class garden lost health. Try another photo to recover.</Text>
        </View>
      ) : !added ? (
        <TouchableOpacity style={s.addBtn} onPress={handleAdd} activeOpacity={0.85}>
          <Text style={s.addText}>{taskCorrect ? `Claim ${activeTask.points} task pts and collect` : 'Add photo to collection'}</Text>
        </TouchableOpacity>
      ) : (
        <View style={s.celebrate}>
          <Text style={s.celebrateTitle}>
            {added.taskOutcome && !added.taskOutcome.alreadyCompleted
              ? 'Mission complete'
              : added.isNew ? 'New discovery' : 'Already in collection'}
          </Text>
          <Text style={s.celebrateSub}>
            +{added.pointsEarned}{added.taskOutcome?.taskPoints ? ` + ${added.taskOutcome.taskPoints} task` : ''} points
          </Text>
        </View>
      )}

      <View style={s.actions}>
        <TouchableOpacity style={s.outlineBtn} onPress={onScanAgain}>
          <Text style={s.outlineText}>Scan again</Text>
        </TouchableOpacity>
        {added && (
          <TouchableOpacity style={s.darkBtn} onPress={onGoCollection}>
            <Text style={s.darkText}>Collection</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  wrap: { width: '100%' },
  card: { backgroundColor: C.cardBg, borderRadius: 24, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
  photoBox: { height: 220, backgroundColor: '#e3f0e6', alignItems: 'center', justifyContent: 'center' },
  photo: { width: '100%', height: '100%' },
  taskResultHeader: { flexDirection: 'row', alignItems: 'center' },
  badge: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 },
  badgeText: { color: C.white, fontWeight: '700', fontSize: 13 },
  body: { padding: 18 },
  taskResult: { borderRadius: 16, padding: 12, marginBottom: 14 },
  taskGood: { backgroundColor: 'rgba(58,157,93,0.16)' },
  taskBad: { backgroundColor: 'rgba(181,86,42,0.14)' },
  taskPractice: { backgroundColor: 'rgba(244,185,66,0.18)' },
  taskResultText: { color: C.bark, fontWeight: '900' },
  taskResultSub: { color: C.muted, marginTop: 6, lineHeight: 18 },
  name: { fontSize: 24, fontWeight: '800', color: C.bark },
  sci: { fontStyle: 'italic', color: C.muted, marginTop: 2 },
  familyChip: { alignSelf: 'flex-start', backgroundColor: 'rgba(58,157,93,0.12)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4, marginTop: 10 },
  familyText: { color: C.leafDark, fontWeight: '700', fontSize: 12 },
  desc: { marginTop: 14, fontSize: 14, lineHeight: 21, color: '#444' },
  note: { marginTop: 12, fontSize: 12, color: '#b5562a' },
  addBtn: { backgroundColor: C.leaf, borderRadius: 18, paddingVertical: 16, alignItems: 'center', marginTop: 16, elevation: 3, paddingHorizontal: 10 },
  addText: { color: C.white, fontSize: 17, fontWeight: '800', textAlign: 'center' },
  failBox: { backgroundColor: 'rgba(181,86,42,0.12)', borderRadius: 18, padding: 16, alignItems: 'center', marginTop: 16 },
  failTitle: { color: '#b5562a', fontSize: 18, fontWeight: '900' },
  failSub: { color: C.muted, textAlign: 'center', marginTop: 5, lineHeight: 20 },
  celebrate: { backgroundColor: C.leafDark, borderRadius: 18, padding: 16, alignItems: 'center', marginTop: 16 },
  celebrateTitle: { color: C.cream, fontSize: 18, fontWeight: '800' },
  celebrateSub: { color: C.cream, opacity: 0.9, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 12 },
  outlineBtn: { flex: 1, borderWidth: 2, borderColor: C.leaf, borderRadius: 18, paddingVertical: 13, alignItems: 'center' },
  outlineText: { color: C.leafDark, fontWeight: '800' },
  darkBtn: { flex: 1, backgroundColor: C.bark, borderRadius: 18, paddingVertical: 13, alignItems: 'center' },
  darkText: { color: C.cream, fontWeight: '800' },
})
