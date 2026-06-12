// ─── Profile ─────────────────────────────────────────────────────────────────
// Students: identity, point-buyable avatar frames + nickname glows, stats,
// streak flame and the achievement cabinet. Teachers get a class-focused
// profile instead: class overview stats and teaching achievements — no
// personal point economy.
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useCollection, dayKey } from '../store/useCollection'
import { useQuiz } from '../store/useQuiz'
import {
  ACHIEVEMENTS,
  getAchievements,
  getTeacherAchievements,
  teacherStats,
} from '../data/achievements'
import { PFPS, FRAMES, NAME_FX, cosmeticItem } from '../data/profileShop'
import { AchievementGlyph } from '../components/DesignElements'
import { StreakTile } from '../components/StreakFlame'
import { Press, Btn, Tile, Tag, GlowText } from '../components/ui'
import { T, F } from '../theme'

export default function ProfileScreen() {
  const state = useCollection()
  const isTeacher = state.currentUser?.role === 'teacher'
  return isTeacher ? <TeacherProfile state={state} /> : <StudentProfile state={state} />
}

// ── Student profile ───────────────────────────────────────────────────────────
function StudentProfile({ state }) {
  const { currentUser, points, profile, logout, setPfp, buyCosmetic, equipCosmetic } = state
  const achievements = getAchievements(state)
  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const achieved = new Set(achievements.filter((a) => a.unlocked).map((a) => a.id))

  const frame = cosmeticItem('frame', profile.frame)
  const nameFx = cosmeticItem('nameFx', profile.nameFx)

  const dexCount = Object.keys(state.plants || {}).length
  const missionCount = Object.keys(state.completedTasks || {}).length
  const attempts = state.taskAttempts || []
  const accuracy = attempts.length
    ? Math.round((attempts.filter((a) => a.correct).length / attempts.length) * 100)
    : null
  const studyPasses = Object.values(state.studyBest || {}).filter((r) => r && r.correct / r.total >= 0.8).length
  const litToday = (state.lastTaskDay || '') === dayKey(Date.now())

  return (
    <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      <View style={s.idCard}>
        <Avatar user={currentUser} pfp={profile.pfp} frame={frame} size={92} />
        <View style={s.nicknameWrap}>
          <GlowText
            text={currentUser?.name || 'Explorer'}
            color={nameFx.color}
            glow={nameFx.glow}
            style={s.nickname}
          />
        </View>
        <View style={s.idTags}>
          <Tag label="STUDENT" tone="accent" />
          {!!currentUser?.classCode && <Tag label={`Class ${currentUser.classCode}`} />}
          <Tag label={`${points} pts`} tone="gold" />
        </View>
      </View>

      <Text style={s.section}>Statistics</Text>
      <View style={s.statsRow}>
        <Tile value={points} label="Points" tone="gold" />
        <Tile value={dexCount} label="Species" tone="accent" />
        <StreakTile streak={state.taskStreak || 0} lit={litToday} />
      </View>
      <View style={s.statsRow}>
        <Tile value={missionCount} label="Missions" />
        <Tile value={unlockedCount} label="Badges" />
        <Tile value={accuracy === null ? '—' : `${accuracy}%`} label="Accuracy" tone="accent" />
      </View>
      <View style={s.statsRow}>
        <Tile value={studyPasses} label="LC Passes" />
        <Tile value={`${state.gardenHealth ?? 3}/3`} label="Garden" tone="accent" />
        <Tile value={attempts.length} label="Attempts" />
      </View>

      <Text style={s.section}>Profile picture</Text>
      <PfpPicker user={currentUser} pfp={profile.pfp} onPick={setPfp} />

      <Text style={s.section}>Avatar frames</Text>
      {FRAMES.map((item) => (
        <CosmeticRow
          key={item.id}
          item={item}
          profile={profile}
          points={points}
          achieved={achieved}
          onBuy={buyCosmetic}
          onWear={equipCosmetic}
          preview={
            item.color ? (
              <View style={[s.frameSwatch, { borderColor: item.color, shadowColor: item.color }]} />
            ) : (
              <Text style={s.nonePreview}>—</Text>
            )
          }
        />
      ))}

      <Text style={s.section}>Nickname effects</Text>
      {NAME_FX.map((item) => (
        <CosmeticRow
          key={item.id}
          item={item}
          profile={profile}
          points={points}
          achieved={achieved}
          onBuy={buyCosmetic}
          onWear={equipCosmetic}
          preview={<GlowText text="Aa" color={item.color} glow={item.glow} style={s.fxPreview} />}
        />
      ))}

      <Text style={s.section}>Achievements · {unlockedCount}/{achievements.length}</Text>
      <AchievementList achievements={achievements} />

      <Btn label="Log out" kind="danger" onPress={logout} style={s.logoutBtn} />
    </ScrollView>
  )
}

// ── Teacher profile ───────────────────────────────────────────────────────────
function TeacherProfile({ state }) {
  const quizzes = useQuiz((q) => q.quizzes)
  const { currentUser, profile, logout, setPfp } = state
  const stats = teacherStats(state, quizzes)
  const achievements = getTeacherAchievements(state, quizzes)
  const unlockedCount = achievements.filter((a) => a.unlocked).length

  return (
    <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      <View style={s.idCard}>
        <Avatar user={currentUser} pfp={profile.pfp} frame={cosmeticItem('frame', profile.frame)} size={92} />
        <View style={s.nicknameWrap}>
          <Text style={s.nickname}>{currentUser?.name || 'Teacher'}</Text>
        </View>
        <View style={s.idTags}>
          <Tag label="TEACHER" tone="accent" />
          {!!currentUser?.classCode && <Tag label={`Class ${currentUser.classCode}`} />}
          <Tag label={`${stats.studentCount} students`} tone="gold" />
        </View>
      </View>

      <Text style={s.section}>Class overview</Text>
      <View style={s.statsRow}>
        <Tile value={stats.studentCount} label="Students" tone="accent" />
        <Tile value={stats.missionCount} label="Missions" />
        <Tile value={stats.customMissions} label="Created" tone="gold" />
      </View>
      <View style={s.statsRow}>
        <Tile value={quizzes.length} label="Quizzes" />
        <Tile value={stats.completedCount} label="Done" tone="accent" />
        <Tile value={stats.plantCount} label="Species" />
      </View>

      <Text style={s.section}>Profile picture</Text>
      <PfpPicker user={currentUser} pfp={profile.pfp} onPick={setPfp} />

      <Text style={s.section}>Teaching achievements · {unlockedCount}/{achievements.length}</Text>
      <AchievementList achievements={achievements} />

      <Btn label="Log out" kind="danger" onPress={logout} style={s.logoutBtn} />
    </ScrollView>
  )
}

// ── Shared pieces ─────────────────────────────────────────────────────────────
// Avatar with optional emoji pfp and a glowing frame ring.
export function Avatar({ user, pfp, frame, size = 92 }) {
  const framed = frame && frame.id !== 'none'
  return (
    <View
      style={[
        s.avatarRing,
        {
          width: size + 14,
          height: size + 14,
          borderRadius: (size + 14) / 2,
          borderColor: framed ? frame.color : 'transparent',
        },
        framed && { shadowColor: frame.color, shadowOpacity: 0.8, shadowRadius: 14, shadowOffset: { width: 0, height: 0 }, elevation: 8 },
      ]}
    >
      <View style={[s.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
        {pfp ? (
          <Text style={{ fontSize: size * 0.5 }}>{pfp}</Text>
        ) : (
          <Text style={[s.avatarLetter, { fontSize: size * 0.42 }]}>
            {(user?.name || '?').charAt(0).toUpperCase()}
          </Text>
        )}
      </View>
    </View>
  )
}

function PfpPicker({ user, pfp, onPick }) {
  return (
    <View style={s.pfpRow}>
      <Press style={[s.pfpCell, !pfp && s.pfpCellOn]} onPress={() => onPick(null)}>
        <Text style={s.pfpInitial}>{(user?.name || '?').charAt(0).toUpperCase()}</Text>
      </Press>
      {PFPS.map((emoji) => (
        <Press key={emoji} style={[s.pfpCell, pfp === emoji && s.pfpCellOn]} onPress={() => onPick(emoji)}>
          <Text style={s.pfpEmoji}>{emoji}</Text>
        </Press>
      ))}
    </View>
  )
}

function AchievementList({ achievements }) {
  return achievements.map((a) => (
    <View key={a.id} style={[s.achRow, !a.unlocked && s.achRowLocked]}>
      <AchievementGlyph unlocked={a.unlocked} />
      <View style={s.flex1}>
        <Text style={F.bodyStrong}>{a.title}</Text>
        <Text style={s.achDesc}>{a.description}</Text>
      </View>
      {a.unlocked && <Tag label="DONE" tone="accent" />}
    </View>
  ))
}

function CosmeticRow({ item, profile, points, achieved, onBuy, onWear, preview }) {
  const free = item.id === 'none'
  const owned = free || profile.owned?.includes(item.id)
  const wearing = profile[item.type] === item.id
  const locked = !!item.unlock && !achieved.has(item.unlock)
  const rewardOf = item.unlock ? ACHIEVEMENTS.find((a) => a.id === item.unlock) : null

  return (
    <View style={[s.itemRow, wearing && s.itemRowOn]}>
      <View style={s.itemPreview}>{preview}</View>
      <View style={s.flex1}>
        <Text style={F.bodyStrong}>{item.name}</Text>
        <Text style={s.itemMeta}>
          {locked
            ? `Unlock: ${rewardOf?.title || 'achievement'}`
            : owned
              ? 'Owned'
              : item.cost > 0
                ? `${item.cost} pts`
                : 'Achievement reward — yours!'}
        </Text>
      </View>
      {wearing ? (
        <Tag label="ON" tone="accent" />
      ) : owned ? (
        <Btn label="Wear" kind="raised" small onPress={() => onWear(item)} />
      ) : locked ? (
        <Tag label="LOCKED" />
      ) : (
        <Btn
          label={item.cost > 0 ? `Buy ${item.cost}` : 'Claim'}
          small
          disabled={points < item.cost}
          onPress={() => onBuy(item)}
        />
      )}
    </View>
  )
}

const s = StyleSheet.create({
  scroll: { padding: 18, paddingBottom: 120 },
  flex1: { flex: 1 },
  section: { ...F.h2, marginTop: 18, marginBottom: 10 },

  idCard: { backgroundColor: T.c.surface, borderRadius: T.r.lg, borderWidth: 1, borderColor: T.c.line, padding: 22, alignItems: 'center' },
  avatarRing: { borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  avatar: { backgroundColor: T.c.accentSoft, alignItems: 'center', justifyContent: 'center' },
  avatarLetter: { color: T.c.accent, fontWeight: '800' },
  nicknameWrap: { marginTop: 12, alignItems: 'center' },
  nickname: { ...F.h1, fontSize: 24, textAlign: 'center', letterSpacing: 0.3 },
  idTags: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 12 },

  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },

  pfpRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  pfpCell: { width: 52, height: 52, borderRadius: 16, backgroundColor: T.c.surface, borderWidth: 1.5, borderColor: T.c.line, alignItems: 'center', justifyContent: 'center' },
  pfpCellOn: { borderColor: T.c.accent, backgroundColor: T.c.accentSoft },
  pfpEmoji: { fontSize: 24 },
  pfpInitial: { color: T.c.accent, fontWeight: '800', fontSize: 20 },

  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: T.c.surface, borderRadius: T.r.sm, borderWidth: 1, borderColor: T.c.line, padding: 10, marginBottom: 7 },
  itemRowOn: { borderColor: 'rgba(74,222,128,0.4)' },
  itemPreview: { width: 44, height: 44, borderRadius: 12, backgroundColor: T.c.raised, alignItems: 'center', justifyContent: 'center' },
  frameSwatch: { width: 26, height: 26, borderRadius: 13, borderWidth: 3, shadowOpacity: 0.8, shadowRadius: 6, shadowOffset: { width: 0, height: 0 } },
  nonePreview: { color: T.c.faint, fontWeight: '800' },
  fxPreview: { fontSize: 17, fontWeight: '800', color: T.c.text, textAlign: 'center' },
  itemMeta: { ...F.body, fontSize: 11, marginTop: 1 },

  achRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: T.c.surface, borderRadius: T.r.md, borderWidth: 1, borderColor: T.c.line, padding: 13, marginBottom: 8 },
  achRowLocked: { opacity: 0.5 },
  achDesc: { ...F.body, fontSize: 12, marginTop: 1 },

  logoutBtn: { marginTop: 22 },
})
