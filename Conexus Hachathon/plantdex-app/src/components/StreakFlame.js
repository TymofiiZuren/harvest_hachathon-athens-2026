// ─── Streak flame (TikTok-style) ─────────────────────────────────────────────
// A pure-View flame that tracks the daily mission streak. Gray until a task is
// completed today; once lit, its colour tier upgrades as the streak grows:
// amber → orange → red → blue flame → mythic purple.
import { View, Text, StyleSheet } from 'react-native'
import { T, F } from '../theme'

const TIERS = [
  { min: 30, body: '#C084FC', core: '#EDDBFF', name: 'Mythic' },
  { min: 14, body: '#60A5FA', core: '#CCE2FE', name: 'Blue flame' },
  { min: 7, body: '#F43F5E', core: '#FECDD3', name: 'On fire' },
  { min: 3, body: '#F97316', core: '#FED7AA', name: 'Heating up' },
  { min: 1, body: '#FBBF24', core: '#FDE9A8', name: 'Lit' },
]

export function streakTier(streak = 0) {
  return TIERS.find((tier) => streak >= tier.min) || null
}

export default function StreakFlame({ streak = 0, lit = false, size = 26 }) {
  const tier = streakTier(streak)
  const on = lit && tier
  const body = on ? tier.body : 'rgba(255,255,255,0.14)'
  const core = on ? tier.core : 'rgba(255,255,255,0.26)'

  // Teardrop: a square with one sharp corner, rotated point-up.
  const drop = (d, sharp) => ({
    width: d,
    height: d,
    borderTopLeftRadius: sharp,
    borderTopRightRadius: d / 2,
    borderBottomLeftRadius: d / 2,
    borderBottomRightRadius: d / 2,
    transform: [{ rotate: '45deg' }],
  })

  return (
    <View style={[f.wrap, { width: size, height: size }]}>
      <View
        style={[
          drop(size * 0.74, size * 0.07),
          { backgroundColor: body },
          on && { shadowColor: tier.body, shadowOpacity: 0.85, shadowRadius: 9, shadowOffset: { width: 0, height: 0 }, elevation: 6 },
        ]}
      />
      <View style={[drop(size * 0.32, size * 0.04), f.core, { backgroundColor: core, bottom: size * 0.14 }]} />
    </View>
  )
}

// Stat tile with the flame, matching the Tile look from the UI kit. The flame
// colour alone communicates the tier; the label stays a plain "Streak".
export function StreakTile({ streak = 0, lit = false, style }) {
  const tier = streakTier(streak)
  const on = lit && tier
  return (
    <View style={[f.tile, style]}>
      <StreakFlame streak={streak} lit={lit} size={24} />
      <Text style={[f.tileValue, on && { color: tier.body }]}>{streak}d</Text>
      <Text style={f.tileLabel}>Streak</Text>
    </View>
  )
}

const f = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  core: { position: 'absolute', alignSelf: 'center' },
  tile: { flex: 1, backgroundColor: T.c.surface, borderRadius: T.r.md, borderWidth: 1, borderColor: T.c.line, paddingVertical: 11, alignItems: 'center', gap: 2 },
  tileValue: { ...F.h2, fontSize: 16, marginTop: 2 },
  tileLabel: { ...F.micro, fontSize: 9, letterSpacing: 0.8 },
})
