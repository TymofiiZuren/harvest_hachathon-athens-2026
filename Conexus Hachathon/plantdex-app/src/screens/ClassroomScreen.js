import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { CLASSROOM, LESSON_TASKS } from '../data/lessonTasks'
import { getAchievements } from '../data/achievements'
import { useCollection } from '../store/useCollection'
import { AchievementGlyph, StatusDot } from '../components/DesignElements'
import { C } from '../theme'

export default function ClassroomScreen({ role = 'student', onGoScan, onGoDashboard }) {
  const collectionState = useCollection()
  const classroom = collectionState.classroom || CLASSROOM
  const lessonTasks = collectionState.lessonTasks?.length ? collectionState.lessonTasks : LESSON_TASKS
  const activeTaskId = collectionState.activeTaskId
  const setActiveTask = collectionState.setActiveTask
  const completedTasks = collectionState.completedTasks || {}
  const gardenHealth = collectionState.gardenHealth ?? 3
  const achievements = getAchievements(collectionState)
  const activeTask = lessonTasks.find((task) => task.id === activeTaskId) || lessonTasks[0]

  function chooseTask(taskId) {
    setActiveTask(taskId)
    if (role === 'student') onGoScan?.()
  }

  return (
    <ScrollView contentContainerStyle={s.scroll}>
      <View style={s.lessonCard}>
        <View style={s.lessonTop}>
          <Text style={s.className}>{classroom.name}</Text>
          <Text style={s.code}>{classroom.code}</Text>
        </View>
        <Text style={s.topic}>{classroom.topic}</Text>
        <Text style={s.title}>{classroom.title}</Text>
        <Text style={s.lessonDesc}>{classroom.description}</Text>
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
          achievements={achievements}
          lessonTasks={lessonTasks}
          chooseTask={chooseTask}
          onGoScan={onGoScan}
        />
      )}
    </ScrollView>
  )
}

function StudentPanel({ activeTask, completedTasks, gardenHealth, achievements, lessonTasks, chooseTask, onGoScan }) {
  const unlocked = achievements.filter((achievement) => achievement.unlocked)
  return (
    <>
      <View style={s.activeMission}>
        <View style={s.sectionHeader}>
          <Text style={s.section}>Current mission</Text>
          <View style={s.pointsChip}><Text style={s.pointsText}>{activeTask.points} pts</Text></View>
        </View>
        <Text style={s.missionTitle}>{activeTask.title}</Text>
        <Text style={s.desc}>{activeTask.description}</Text>
        <Text style={s.hint}>Field note: {activeTask.hint}</Text>
        <Text style={s.quiz}>Quick check: {activeTask.quiz.question}</Text>
        <View style={s.choiceWrap}>
          {activeTask.quiz.choices.map((choice) => (
            <View key={choice} style={s.choiceChip}>
              <Text style={s.choiceText}>{choice}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={s.primaryBtn} onPress={onGoScan} activeOpacity={0.85}>
          <Text style={s.primaryText}>Add photo evidence</Text>
        </TouchableOpacity>
        <HealthMeter value={gardenHealth} />
      </View>

      <Text style={s.section}>Lesson tasks</Text>
      {lessonTasks.map((task) => {
        const done = !!completedTasks[task.id]
        const active = task.id === activeTask.id
        return (
          <TouchableOpacity key={task.id} style={[s.taskRow, active && s.taskActive]} onPress={() => chooseTask(task.id)}>
            <StatusDot status={done ? 'done' : active ? 'active' : 'neutral'} />
            <View style={{ flex: 1 }}>
              <Text style={s.taskTitle}>{task.title}</Text>
              <Text style={s.taskMeta}>{task.topic} / {task.points} points</Text>
            </View>
            <Text style={s.taskAction}>{done ? 'Done' : active ? 'Live' : 'Start'}</Text>
          </TouchableOpacity>
        )
      })}

      <Text style={s.section}>Achievements</Text>
      <View style={s.achievementRow}>
        {unlocked.length === 0 ? (
          <Text style={s.empty}>Complete a mission to unlock your first achievement.</Text>
        ) : unlocked.map((achievement) => (
          <View key={achievement.id} style={s.badge}>
            <AchievementGlyph unlocked />
            <Text style={s.badgeText}>{achievement.title}</Text>
          </View>
        ))}
      </View>
    </>
  )
}

function TeacherPanel({ activeTask, completedTasks, lessonTasks, classroom, chooseTask, onGoDashboard }) {
  const completedCount = Object.keys(completedTasks).length
  return (
    <>
      <View style={s.teacherCard}>
        <Text style={s.section}>Teacher overview</Text>
        <Text style={s.desc}>The live task controls what students see on the scan screen. Use the dashboard to edit the lesson and create more missions.</Text>
        <Text style={s.activeLabel}>Live mission: {activeTask.title}</Text>
        <TouchableOpacity style={s.secondaryBtn} onPress={onGoDashboard}>
          <Text style={s.secondaryText}>Open lesson dashboard</Text>
        </TouchableOpacity>
      </View>

      <View style={s.metricsRow}>
        <Metric label="Missions" value={lessonTasks.length} />
        <Metric label="Completed" value={completedCount} />
        <Metric label="Students" value={classroom.students?.length || 0} />
      </View>

      <Text style={s.section}>Mission bank</Text>
      {lessonTasks.map((task) => (
        <View key={task.id} style={[s.teacherTask, task.id === activeTask.id && s.teacherTaskActive]}>
          <View style={{ flex: 1 }}>
            <Text style={s.taskTitle}>{task.title}</Text>
            <Text style={s.taskMeta}>{task.topic} / {task.points} points</Text>
            <Text style={s.desc}>{task.description}</Text>
            <Text style={s.quiz}>Check: {task.quiz.question}</Text>
            <Text style={s.answer}>Answer: {task.quiz.answer}</Text>
          </View>
          <TouchableOpacity style={s.setBtn} onPress={() => chooseTask(task.id)}>
            <Text style={s.setText}>{task.id === activeTask.id ? 'Live' : 'Set'}</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Text style={s.section}>Classroom students</Text>
      {(classroom.students || []).map((student, index) => (
        <View key={student.id} style={s.studentRow}>
          <Text style={s.rank}>#{index + 1}</Text>
          <Text style={s.studentName}>{student.name}</Text>
          <Text style={s.studentPoints}>{student.points + completedCount * 20} pts</Text>
        </View>
      ))}
    </>
  )
}

function Metric({ label, value }) {
  return (
    <View style={s.metric}>
      <Text style={s.metricValue}>{value}</Text>
      <Text style={s.metricLabel}>{label}</Text>
    </View>
  )
}

function HealthMeter({ value }) {
  return (
    <View style={s.healthWrap}>
      <Text style={s.healthLabel}>Class garden health</Text>
      <View style={s.healthBars}>
        {[0, 1, 2].map((n) => <View key={n} style={[s.healthBar, n < value && s.healthBarOn]} />)}
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 40 },
  lessonCard: { backgroundColor: C.barkDark, borderRadius: 28, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.16, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 4 },
  lessonTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  className: { color: C.cream, fontWeight: '900', fontSize: 16 },
  code: { color: C.barkDark, backgroundColor: C.sun, borderRadius: 999, paddingHorizontal: 11, paddingVertical: 5, fontWeight: '900', fontSize: 12 },
  topic: { color: C.leafLight, fontWeight: '900', marginTop: 14, textTransform: 'uppercase', fontSize: 12, letterSpacing: 0.7 },
  title: { color: C.cream, fontWeight: '900', fontSize: 26, marginTop: 5 },
  lessonDesc: { color: 'rgba(246,244,236,0.78)', lineHeight: 20, marginTop: 8 },
  activeMission: { backgroundColor: C.white, borderRadius: 24, padding: 17, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(58,157,93,0.18)' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  section: { color: C.bark, fontSize: 18, fontWeight: '900', marginBottom: 10, marginTop: 4 },
  pointsChip: { backgroundColor: 'rgba(244,185,66,0.25)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  pointsText: { color: C.bark, fontWeight: '900', fontSize: 12 },
  missionTitle: { color: C.bark, fontWeight: '900', fontSize: 22 },
  desc: { color: C.muted, lineHeight: 20, marginTop: 6 },
  hint: { color: C.leafDark, fontWeight: '800', marginTop: 11, lineHeight: 20 },
  quiz: { color: C.bark, marginTop: 11, fontWeight: '800' },
  choiceWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  choiceChip: { width: '48%', backgroundColor: '#f4efe3', borderRadius: 13, padding: 10, borderWidth: 1, borderColor: C.line },
  choiceText: { color: C.bark, fontWeight: '800', textAlign: 'center', fontSize: 12 },
  answer: { color: C.leafDark, marginTop: 6, fontWeight: '900' },
  primaryBtn: { backgroundColor: C.leafDark, borderRadius: 18, alignItems: 'center', paddingVertical: 15, marginTop: 16 },
  primaryText: { color: C.cream, fontWeight: '900', fontSize: 16 },
  secondaryBtn: { backgroundColor: C.leafDark, borderRadius: 16, alignItems: 'center', paddingVertical: 13, marginTop: 14 },
  secondaryText: { color: C.cream, fontWeight: '900' },
  healthWrap: { marginTop: 14 },
  healthLabel: { color: C.bark, fontWeight: '900', marginBottom: 7, textAlign: 'center' },
  healthBars: { flexDirection: 'row', gap: 6 },
  healthBar: { flex: 1, height: 9, borderRadius: 999, backgroundColor: '#ddd5c8' },
  healthBarOn: { backgroundColor: C.leaf },
  taskRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.white, borderRadius: 17, padding: 13, marginBottom: 10, borderWidth: 1, borderColor: C.line },
  taskActive: { borderColor: C.sun, backgroundColor: '#fffaf0' },
  taskTitle: { color: C.bark, fontWeight: '900', fontSize: 15 },
  taskMeta: { color: C.muted, fontWeight: '800', marginTop: 2, fontSize: 12 },
  taskAction: { color: C.leafDark, fontWeight: '900', fontSize: 12 },
  achievementRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  badge: { width: '47%', backgroundColor: C.white, borderRadius: 17, padding: 12, alignItems: 'center' },
  badgeText: { color: C.bark, fontWeight: '800', textAlign: 'center', marginTop: 7, fontSize: 12 },
  empty: { color: C.muted, lineHeight: 20 },
  teacherCard: { backgroundColor: C.white, borderRadius: 22, padding: 16, marginBottom: 14 },
  activeLabel: { marginTop: 10, color: C.leafDark, fontWeight: '900' },
  metricsRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  metric: { flex: 1, backgroundColor: C.white, borderRadius: 18, padding: 13, alignItems: 'center' },
  metricValue: { color: C.bark, fontSize: 22, fontWeight: '900' },
  metricLabel: { color: C.muted, fontWeight: '800', fontSize: 12, marginTop: 2 },
  teacherTask: { flexDirection: 'row', gap: 10, backgroundColor: C.white, borderRadius: 18, padding: 13, marginBottom: 10, borderWidth: 1, borderColor: C.line },
  teacherTaskActive: { borderColor: C.sun, backgroundColor: '#fffaf0' },
  setBtn: { alignSelf: 'center', backgroundColor: C.bark, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  setText: { color: C.cream, fontWeight: '900' },
  studentRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.white, borderRadius: 15, padding: 13, marginBottom: 8 },
  rank: { color: C.leafDark, fontWeight: '900', width: 36 },
  studentName: { flex: 1, color: C.bark, fontWeight: '800' },
  studentPoints: { color: C.sun, fontWeight: '900' },
})
