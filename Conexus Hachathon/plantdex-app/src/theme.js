// ─── "Night Garden" design tokens ───────────────────────────────────────────
// Premium dark-botanical language: deep forest-ink canvas, luminous emerald
// accent, hairline borders instead of heavy shadows. One source of truth.

export const T = {
  // Color scale
  c: {
    bg: '#0B110D',        // app canvas — near-black green
    surface: '#151D17',   // cards
    raised: '#1C2820',    // elevated cards, inputs
    press: '#24332A',     // pressed / hover state
    line: 'rgba(255,255,255,0.07)',       // hairline borders
    lineStrong: 'rgba(255,255,255,0.14)', // emphasized borders

    accent: '#4ADE80',    // luminous emerald — primary actions
    accentSoft: 'rgba(74,222,128,0.13)',  // accent-tinted fills
    onAccent: '#06210F',  // text on accent surfaces

    gold: '#F5C04E',      // points, highlights
    goldSoft: 'rgba(245,192,78,0.13)',

    danger: '#F87171',
    dangerSoft: 'rgba(248,113,113,0.12)',

    text: '#F2F7F3',      // primary text
    sub: '#A2B3A7',       // secondary text
    faint: '#5E6E62',     // tertiary / disabled

    photo: '#1F2B22',     // image placeholders
    scrim: 'rgba(4,8,5,0.72)', // modal backdrop
  },

  // Radii
  r: { xs: 10, sm: 14, md: 18, lg: 24, xl: 30, full: 999 },

  // Spacing
  s: { xs: 6, sm: 10, md: 16, lg: 22, xl: 30 },
}

// Type ramp — negative tracking on display sizes, generous line-height on body.
export const F = {
  display: { fontSize: 30, fontWeight: '800', color: T.c.text, letterSpacing: -0.8, lineHeight: 36 },
  h1: { fontSize: 22, fontWeight: '800', color: T.c.text, letterSpacing: -0.4, lineHeight: 28 },
  h2: { fontSize: 17, fontWeight: '700', color: T.c.text, letterSpacing: -0.2, lineHeight: 23 },
  body: { fontSize: 14, fontWeight: '400', color: T.c.sub, lineHeight: 21 },
  bodyStrong: { fontSize: 14, fontWeight: '600', color: T.c.text, lineHeight: 21 },
  micro: { fontSize: 11, fontWeight: '800', color: T.c.faint, letterSpacing: 1.2, textTransform: 'uppercase' },
}

// Legacy alias — keeps any straggler `C.x` reference rendering on-theme.
export const C = {
  leaf: T.c.accent,
  leafDark: '#22C55E',
  leafLight: T.c.accentSoft,
  bark: T.c.text,
  barkMid: T.c.sub,
  barkDark: T.c.surface,
  cream: T.c.bg,
  paper: T.c.surface,
  sun: T.c.gold,
  sunLight: T.c.goldSoft,
  white: T.c.text,
  ink: T.c.sub,
  muted: T.c.faint,
  cardBg: T.c.surface,
  danger: T.c.danger,
  line: T.c.line,
}
