// ─── Shared component kit ────────────────────────────────────────────────────
// Press (spring-scale pressable), Btn, Bar (animated progress), Sheet (bottom
// sheet modal), Tile (stat tile), Tag (small chip). Every interactive element
// in the app routes through Press so the whole UI shares one motion feel.
import { useEffect, useRef } from 'react'
import { Animated, Pressable, Modal, View, Text, StyleSheet } from 'react-native'
import { T, F } from '../theme'

// Spring-scale pressable — the app's single press affordance.
// IMPORTANT: styles must land on the Pressable itself (via an animated
// component), not an inner view — otherwise width:%/flex:1/alignSelf rules
// resolve against a content-hugging wrapper and collapse the layout.
const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export function Press({ children, style, onPress, onLongPress, disabled = false }) {
  const scale = useRef(new Animated.Value(1)).current
  const to = (v) =>
    Animated.spring(scale, { toValue: v, useNativeDriver: true, speed: 50, bounciness: 4 }).start()
  return (
    <AnimatedPressable
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      onPressIn={() => to(0.965)}
      onPressOut={() => to(1)}
      accessibilityRole="button"
      style={[style, { transform: [{ scale }] }]}
    >
      {children}
    </AnimatedPressable>
  )
}

// Buttons: kind = 'primary' (emerald) | 'raised' (dark) | 'ghost' (text) | 'danger'
export function Btn({ label, onPress, kind = 'primary', small = false, style, disabled = false }) {
  return (
    <Press
      onPress={onPress}
      disabled={disabled}
      style={[
        u.btn,
        small && u.btnSmall,
        kind === 'primary' && u.btnPrimary,
        kind === 'raised' && u.btnRaised,
        kind === 'ghost' && u.btnGhost,
        kind === 'danger' && u.btnDanger,
        disabled && { opacity: 0.4 },
        style,
      ]}
    >
      <Text
        style={[
          u.btnText,
          small && u.btnTextSmall,
          kind === 'primary' && { color: T.c.onAccent },
          kind === 'ghost' && { color: T.c.sub },
          kind === 'danger' && { color: T.c.danger },
        ]}
      >
        {label}
      </Text>
    </Press>
  )
}

// Animated progress bar.
export function Bar({ value = 0, color = T.c.accent, height = 8, style }) {
  const anim = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.timing(anim, { toValue: Math.max(0, Math.min(1, value)), duration: 600, useNativeDriver: false }).start()
  }, [value])
  return (
    <View style={[u.track, { height, borderRadius: height / 2 }, style]}>
      <Animated.View
        style={{
          height,
          borderRadius: height / 2,
          backgroundColor: color,
          width: anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
        }}
      />
    </View>
  )
}

// Bottom sheet modal with grab handle.
export function Sheet({ visible, onClose, children }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={u.scrim} onPress={onClose} />
      <View style={u.sheet}>
        <View style={u.handle} />
        {children}
      </View>
    </Modal>
  )
}

// Compact stat tile.
export function Tile({ value, label, tone = 'default', style }) {
  return (
    <View style={[u.tile, style]}>
      <Text style={[u.tileValue, tone === 'gold' && { color: T.c.gold }, tone === 'accent' && { color: T.c.accent }]}>
        {value}
      </Text>
      <Text style={u.tileLabel}>{label}</Text>
    </View>
  )
}

// Glowing text — a soft halo built from stacked text layers (wide blurred
// underlay → tight blur → bright core) instead of one blocky text-shadow.
const NO_OFFSET = { width: 0, height: 0 }

export function GlowText({ text, color, glow, style }) {
  if (!glow) {
    return <Text style={style}>{text}</Text>
  }
  return (
    <View>
      <Text
        style={[style, u.glowLayer, { color: glow, opacity: 0.35, textShadowColor: glow, textShadowRadius: 22, textShadowOffset: NO_OFFSET }]}
      >
        {text}
      </Text>
      <Text
        style={[style, u.glowLayer, { color: glow, opacity: 0.65, textShadowColor: glow, textShadowRadius: 9, textShadowOffset: NO_OFFSET }]}
      >
        {text}
      </Text>
      <Text style={[style, { color: color || glow, textShadowColor: glow, textShadowRadius: 2, textShadowOffset: NO_OFFSET }]}>
        {text}
      </Text>
    </View>
  )
}

// Small chip.
export function Tag({ label, tone = 'default', style }) {
  return (
    <View
      style={[
        u.tag,
        tone === 'accent' && { backgroundColor: T.c.accentSoft },
        tone === 'gold' && { backgroundColor: T.c.goldSoft },
        tone === 'danger' && { backgroundColor: T.c.dangerSoft },
        style,
      ]}
    >
      <Text
        style={[
          u.tagText,
          tone === 'accent' && { color: T.c.accent },
          tone === 'gold' && { color: T.c.gold },
          tone === 'danger' && { color: T.c.danger },
        ]}
      >
        {label}
      </Text>
    </View>
  )
}

const u = StyleSheet.create({
  btn: { backgroundColor: T.c.raised, borderRadius: T.r.sm, paddingVertical: 15, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
  btnSmall: { paddingVertical: 9, paddingHorizontal: 14, borderRadius: T.r.xs },
  btnPrimary: { backgroundColor: T.c.accent },
  btnRaised: { backgroundColor: T.c.raised, borderWidth: 1, borderColor: T.c.line },
  btnGhost: { backgroundColor: 'transparent', paddingVertical: 10 },
  btnDanger: { backgroundColor: T.c.dangerSoft, borderWidth: 1, borderColor: 'rgba(248,113,113,0.3)' },
  btnText: { ...F.bodyStrong, fontSize: 15, fontWeight: '700' },
  btnTextSmall: { fontSize: 13 },
  glowLayer: { position: 'absolute', left: 0, right: 0, top: 0 },
  track: { backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  scrim: { flex: 1, backgroundColor: T.c.scrim },
  sheet: { backgroundColor: T.c.surface, borderTopLeftRadius: T.r.xl, borderTopRightRadius: T.r.xl, paddingHorizontal: 20, paddingBottom: 34, paddingTop: 8, borderWidth: 1, borderColor: T.c.line, maxHeight: '88%' },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: T.c.lineStrong, marginBottom: 14 },
  tile: { flex: 1, backgroundColor: T.c.surface, borderRadius: T.r.md, borderWidth: 1, borderColor: T.c.line, paddingVertical: 14, alignItems: 'center' },
  tileValue: { ...F.h2, fontSize: 18 },
  tileLabel: { ...F.micro, marginTop: 3 },
  tag: { backgroundColor: T.c.raised, borderRadius: T.r.full, paddingHorizontal: 11, paddingVertical: 5, alignSelf: 'flex-start' },
  tagText: { fontSize: 12, fontWeight: '800', color: T.c.sub },
})
