import { useState } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { PlantPlaceholder, StatusDot } from '../components/DesignElements'
import WorldMap from '../components/WorldMap'
import { Btn, Tag } from '../components/ui'
import { useCollection } from '../store/useCollection'
import { T, F } from '../theme'

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
            <PlantPlaceholder size={92} />
          )}
          {typeof result.confidence === 'number' && (
            <View style={s.confidence}>
              <Text style={s.confidenceText}>{result.confidence}% match</Text>
            </View>
          )}
        </View>

        <View style={s.body}>
          {taskStatus && (
            <View style={[s.verdict, taskCorrect ? s.verdictGood : taskWrong ? s.verdictBad : s.verdictNeutral]}>
              <View style={s.verdictHead}>
                <StatusDot status={taskCorrect ? 'done' : taskWrong ? 'bad' : 'active'} />
                <Text style={s.verdictTitle}>
                  {taskCorrect ? 'Correct evidence' : taskWrong ? 'Wrong evidence' : 'Plant scan'}
                </Text>
              </View>
              <Text style={[F.body, s.verdictSub]}>{taskStatus.message}</Text>
            </View>
          )}

          <Text style={s.name}>{result.commonName}</Text>
          <Text style={s.sci}>{result.scientificName}</Text>
          {!!result.family && <Tag label={result.family} tone="accent" style={s.familyTag} />}
          {!!result.description && <Text style={[F.body, s.desc]}>{result.description}</Text>}
          {result.source !== 'offline' && !!result.scientificName && result.scientificName !== 'Unknown' && (
            <WorldMap scientificName={result.scientificName} />
          )}
          {result.source === 'offline' && (
            <Text style={s.offlineNote}>
              Demo mode: could not reach the API{result.reason ? ` (${result.reason})` : ''}. Showing a sample.
            </Text>
          )}
        </View>
      </View>

      {!added && taskWrong ? (
        <View style={s.failBox}>
          <Text style={s.failTitle}>No points this time</Text>
          <Text style={[F.body, s.failSub]}>
            Wrong evidence — the class garden lost health. Try another photo to recover.
          </Text>
        </View>
      ) : !added ? (
        <Btn
          label={taskCorrect ? `Claim ${activeTask.points} pts & collect` : 'Add to collection'}
          onPress={handleAdd}
          style={s.cta}
        />
      ) : (
        <View style={s.celebrate}>
          <Text style={s.celebrateTitle}>
            {added.taskOutcome && !added.taskOutcome.alreadyCompleted
              ? 'Mission complete'
              : added.isNew ? 'New discovery' : 'Already in your dex'}
          </Text>
          <Text style={s.celebrateSub}>
            +{added.pointsEarned}
            {added.taskOutcome?.taskPoints ? ` + ${added.taskOutcome.taskPoints} mission` : ''}
            {added.taskOutcome?.streakBonus ? ` + ${added.taskOutcome.streakBonus} streak` : ''} pts
          </Text>
          {!!added.taskOutcome?.streakBonus && (
            <Text style={s.streakNote}>Mission streak: day {added.taskOutcome.streak} 🔥</Text>
          )}
        </View>
      )}

      <View style={s.actions}>
        <Btn label="Scan again" kind="raised" onPress={onScanAgain} style={s.flex1} />
        {added && !!onGoCollection && <Btn label="Open dex" onPress={onGoCollection} style={s.flex1} />}
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  wrap: { width: '100%' },
  card: { backgroundColor: T.c.surface, borderRadius: T.r.lg, borderWidth: 1, borderColor: T.c.line, overflow: 'hidden' },
  photoBox: { height: 230, backgroundColor: T.c.photo, alignItems: 'center', justifyContent: 'center' },
  photo: { width: '100%', height: '100%' },
  confidence: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(4,8,5,0.75)', borderRadius: T.r.full, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: 'rgba(74,222,128,0.4)' },
  confidenceText: { color: T.c.accent, fontWeight: '800', fontSize: 12 },
  body: { padding: 18 },
  verdict: { borderRadius: T.r.sm, padding: 12, marginBottom: 16, borderWidth: 1 },
  verdictGood: { backgroundColor: T.c.accentSoft, borderColor: 'rgba(74,222,128,0.3)' },
  verdictBad: { backgroundColor: T.c.dangerSoft, borderColor: 'rgba(248,113,113,0.3)' },
  verdictNeutral: { backgroundColor: T.c.goldSoft, borderColor: 'rgba(245,192,78,0.3)' },
  verdictHead: { flexDirection: 'row', alignItems: 'center' },
  verdictTitle: { ...F.bodyStrong, fontSize: 14 },
  verdictSub: { marginTop: 5 },
  name: { ...F.h1, fontSize: 24 },
  sci: { ...F.body, fontStyle: 'italic', marginTop: 2 },
  familyTag: { marginTop: 10 },
  desc: { marginTop: 14 },
  offlineNote: { fontSize: 12, color: T.c.gold, marginTop: 12 },
  cta: { marginTop: 14 },
  failBox: { backgroundColor: T.c.dangerSoft, borderWidth: 1, borderColor: 'rgba(248,113,113,0.3)', borderRadius: T.r.md, padding: 16, alignItems: 'center', marginTop: 14 },
  failTitle: { color: T.c.danger, fontSize: 17, fontWeight: '800' },
  failSub: { textAlign: 'center', marginTop: 4 },
  celebrate: { backgroundColor: T.c.accentSoft, borderWidth: 1, borderColor: 'rgba(74,222,128,0.3)', borderRadius: T.r.md, padding: 16, alignItems: 'center', marginTop: 14 },
  celebrateTitle: { color: T.c.accent, fontSize: 17, fontWeight: '800' },
  celebrateSub: { color: T.c.text, fontWeight: '700', marginTop: 3 },
  streakNote: { color: T.c.gold, fontWeight: '800', fontSize: 12, marginTop: 4 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 10 },
  flex1: { flex: 1 },
})
