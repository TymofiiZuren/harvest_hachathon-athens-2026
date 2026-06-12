import { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'
import { CLASSROOM, LESSON_TASKS, missionImageForTask } from '../data/lessonTasks'
import { useCollection, dayKey } from '../store/useCollection'
import { PlantPlaceholder, StatusDot } from '../components/DesignElements'
import { StreakTile } from '../components/StreakFlame'
import { Press, Btn, Sheet, Tile, Tag } from '../components/ui'
import { T, F } from '../theme'

// Demo bonus added to each roster student per completed class mission.
const STUDENT_MISSION_BONUS = 20

export default function ClassroomScreen({ role = 'student', onGoScan, onGoDashboard }) {
  const collectionState = useCollection()
  const classroom = collectionState.classroom || CLASSROOM
  const lessonTasks = collectionState.lessonTasks?.length ? collectionState.lessonTasks : LESSON_TASKS
  const activeTaskId = collectionState.activeTaskId
  const setActiveTask = collectionState.setActiveTask
  const completedTasks = collectionState.completedTasks || {}
  const gardenHealth = collectionState.gardenHealth ?? 3
  const points = collectionState.points || 0
  const dexCount = Object.keys(collectionState.plants || {}).length
  const taskStreak = collectionState.taskStreak || 0
  const litToday = (collectionState.lastTaskDay || '') === dayKey(Date.now())
  const activeTask = lessonTasks.find((task) => task.id === activeTaskId) || lessonTasks[0]

  function chooseTask(taskId) {
    setActiveTask(taskId)
    if (role === 'student') onGoScan?.()
  }

  return (
    <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      <View style={s.headerBlock}>
        <Text style={F.micro}>{classroom.name} · {classroom.code}</Text>
        <Text style={[F.display, s.headerTitle]}>{classroom.title}</Text>
        <Text style={F.body}>{classroom.description}</Text>
      </View>

      {role === 'teacher' ? (
        <TeacherPanel
          activeTask={activeTask}
          completedTasks={completedTasks}
          lessonTasks={lessonTasks}
          classroom={classroom}
          chooseTask={chooseTask}
          onGoDashboard={onGoDashboard}
        />
      ) : (
        <StudentPanel
          activeTask={activeTask}
          completedTasks={completedTasks}
          gardenHealth={gardenHealth}
          points={points}
          dexCount={dexCount}
          taskStreak={taskStreak}
          litToday={litToday}
          lessonTasks={lessonTasks}
          chooseTask={chooseTask}
          onGoScan={onGoScan}
        />
      )}
    </ScrollView>
  )
}

function StudentPanel({ activeTask, completedTasks, gardenHealth, points, dexCount, taskStreak, litToday, lessonTasks, chooseTask, onGoScan }) {
  const [hintOpen, setHintOpen] = useState(false)

  return (
    <>
      <View style={s.statsRow}>
        <Tile value={points} label="Points" tone="gold" />
        <Tile value={dexCount} label="Dex" tone="accent" />
        <StreakTile streak={taskStreak} lit={litToday} />
        <Tile value={`${gardenHealth}/3`} label="Garden" />
      </View>

      <View style={s.missionCard}>
        <View style={s.missionTop}>
          <Tag label="LIVE MISSION" tone="accent" />
          <Tag label={`+${activeTask.points} pts`} tone="gold" />
        </View>
        <Text style={s.missionTitle}>{activeTask.title}</Text>
        <Text style={F.body}>{activeTask.description}</Text>

        <View style={s.healthRow}>
          <Text style={s.healthLabel}>Class garden</Text>
          <View style={s.healthBars}>
            {[0, 1, 2].map((n) => (
              <View key={n} style={[s.healthBar, n < gardenHealth && s.healthBarOn]} />
            ))}
          </View>
        </View>

        <View style={s.missionActions}>
          <Btn label="Open camera" onPress={onGoScan} style={s.flexBtn} />
          <Btn label="Hint" kind="raised" onPress={() => setHintOpen(true)} style={s.hintBtn} />
        </View>
      </View>

      <Text style={s.section}>Missions</Text>
      {lessonTasks.map((task) => {
        const done = !!completedTasks[task.id]
        const active = task.id === activeTask.id
        return (
          <Press key={task.id} style={[s.taskRow, active && s.taskRowActive]} onPress={() => chooseTask(task.id)}>
            <StatusDot status={done ? 'done' : active ? 'active' : 'neutral'} />
            <View style={s.flex1}>
              <Text style={F.bodyStrong}>{task.title}</Text>
              <Text style={s.taskMeta}>{task.topic} · {task.points} pts</Text>
            </View>
            <Text style={[s.taskState, done && { color: T.c.accent }, active && !done && { color: T.c.gold }]}>
              {done ? 'Done' : active ? 'Live' : 'Start'}
            </Text>
          </Press>
        )
      })}

      <HintSheet task={activeTask} visible={hintOpen} onClose={() => setHintOpen(false)} />
    </>
  )
}

function TeacherPanel({ activeTask, completedTasks, lessonTasks, classroom, chooseTask, onGoDashboard }) {
  const completedCount = Object.keys(completedTasks).length
  return (
    <>
      <View style={s.statsRow}>
        <Tile value={lessonTasks.length} label="Missions" tone="accent" />
        <Tile value={completedCount} label="Done" />
        <Tile value={classroom.students?.length || 0} label="Students" />
      </View>

      <View style={s.missionCard}>
        <Tag label="LIVE MISSION" tone="accent" />
        <Text style={s.missionTitle}>{activeTask.title}</Text>
        <Text style={F.body}>
          The live mission controls what students see on their scan screen. Manage the lesson and
          create missions from the dashboard.
        </Text>
        <Btn label="Open dashboard" onPress={onGoDashboard} style={{ marginTop: 16 }} />
      </View>

      <Text style={s.section}>Mission bank</Text>
      {lessonTasks.map((task) => {
        const active = task.id === activeTask.id
        return (
          <View key={task.id} style={[s.taskRow, active && s.taskRowActive]}>
            <MissionThumb task={task} />
            <View style={s.flex1}>
              <Text style={F.bodyStrong}>{task.title}</Text>
              <Text style={s.taskMeta}>{task.topic} · {task.points} pts</Text>
            </View>
            <Btn
              label={active ? 'Live' : 'Set live'}
              kind={active ? 'primary' : 'raised'}
              small
              onPress={() => chooseTask(task.id)}
            />
          </View>
        )
      })}

      <Text style={s.section}>Leaderboard</Text>
      {(classroom.students || []).map((student, index) => (
        <View key={student.id} style={s.studentRow}>
          <Text style={s.rank}>{index + 1}</Text>
          <Text style={[F.bodyStrong, s.flex1]}>{student.name}</Text>
          <Text style={s.studentPts}>{student.points + completedCount * STUDENT_MISSION_BONUS} pts</Text>
        </View>
      ))}
    </>
  )
}

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

function HintSheet({ task, visible, onClose }) {
  const image = missionImageForTask(task)
  return (
    <Sheet visible={visible} onClose={onClose}>
      <Text style={F.micro}>What to look for</Text>
      <Text style={[F.h1, { marginTop: 4 }]}>{task?.title}</Text>
      {image ? (
        <Image source={{ uri: image }} style={s.hintImage} resizeMode="cover" />
      ) : (
        <View style={[s.hintImage, s.hintImageEmpty]}>
          <PlantPlaceholder size={84} />
        </View>
      )}
      <Text style={[F.body, { marginTop: 14 }]}>{task?.hint}</Text>
      <Btn label="Got it" onPress={onClose} style={{ marginTop: 18 }} />
    </Sheet>
  )
}

const s = StyleSheet.create({
  scroll: { padding: 18, paddingBottom: 120 },
  headerBlock: { marginBottom: 18 },
  headerTitle: { marginTop: 6, marginBottom: 6 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  missionCard: { backgroundColor: T.c.surface, borderRadius: T.r.lg, borderWidth: 1, borderColor: 'rgba(74,222,128,0.22)', padding: 18, marginBottom: 22 },
  missionTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  missionTitle: { ...F.h1, marginTop: 12, marginBottom: 6 },
  healthRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16 },
  healthLabel: { ...F.micro },
  healthBars: { flex: 1, flexDirection: 'row', gap: 5 },
  healthBar: { flex: 1, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.08)' },
  healthBarOn: { backgroundColor: T.c.accent },
  missionActions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  flexBtn: { flex: 1 },
  hintBtn: { paddingHorizontal: 22 },
  section: { ...F.h2, marginBottom: 10, marginTop: 6 },
  taskRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: T.c.surface, borderRadius: T.r.md, borderWidth: 1, borderColor: T.c.line, padding: 14, marginBottom: 8, gap: 10 },
  taskRowActive: { borderColor: 'rgba(245,192,78,0.4)' },
  taskMeta: { ...F.body, fontSize: 12, marginTop: 1 },
  taskState: { fontSize: 12, fontWeight: '800', color: T.c.faint },
  flex1: { flex: 1 },
  studentRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: T.c.surface, borderRadius: T.r.md, borderWidth: 1, borderColor: T.c.line, padding: 13, marginBottom: 8, gap: 12 },
  rank: { width: 26, height: 26, borderRadius: 13, backgroundColor: T.c.accentSoft, color: T.c.accent, fontWeight: '800', fontSize: 12, textAlign: 'center', lineHeight: 26, overflow: 'hidden' },
  studentPts: { color: T.c.gold, fontWeight: '800', fontSize: 13 },
  thumb: { width: 46, height: 46, borderRadius: 12, backgroundColor: T.c.photo, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  hintImage: { width: '100%', height: 210, borderRadius: T.r.md, backgroundColor: T.c.photo, marginTop: 14 },
  hintImageEmpty: { alignItems: 'center', justifyContent: 'center' },
})
