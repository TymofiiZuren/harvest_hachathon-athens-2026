// ─── Profile cosmetics catalogue ─────────────────────────────────────────────
// Avatar frames and nickname effects bought with points. Items with `unlock`
// are achievement rewards (claimed free once the achievement is earned).

export const DEFAULT_PROFILE = {
  pfp: null, // null = initial letter; otherwise one of PFPS
  frame: 'none',
  nameFx: 'none',
  owned: [], // purchased / claimed item ids ('none' defaults are always available)
}

// Free profile pictures — pick any, no cost.
export const PFPS = ['🌱', '🌵', '🌸', '🍄', '🌿', '🪴', '🌻', '🍀']

export const FRAMES = [
  { id: 'none', type: 'frame', name: 'No frame', cost: 0 },
  { id: 'emerald', type: 'frame', name: 'Emerald Ring', cost: 150, color: '#4ADE80' },
  { id: 'ocean', type: 'frame', name: 'Ocean Ring', cost: 200, color: '#38BDF8' },
  { id: 'rose', type: 'frame', name: 'Rose Ring', cost: 200, color: '#FB7185' },
  { id: 'gold', type: 'frame', name: 'Golden Ring', cost: 300, color: '#F5C04E' },
  { id: 'laurel', type: 'frame', name: 'Scholar Laurel', cost: 0, unlock: 'scholar', color: '#C084FC' },
]

// Each effect is a bright core colour over a softer halo colour; GlowText
// stacks blurred layers of the halo under the core for a neon-sign look.
export const NAME_FX = [
  { id: 'none', type: 'nameFx', name: 'Plain', cost: 0, color: null, glow: null },
  { id: 'glow-green', type: 'nameFx', name: 'Emerald Glow', cost: 200, color: '#D9FBE7', glow: '#34D399' },
  { id: 'glow-frost', type: 'nameFx', name: 'Frost Glow', cost: 250, color: '#EAF7FE', glow: '#38BDF8' },
  { id: 'glow-rose', type: 'nameFx', name: 'Rose Glow', cost: 250, color: '#FFEBED', glow: '#FB7185' },
  { id: 'glow-gold', type: 'nameFx', name: 'Golden Glow', cost: 350, color: '#FEF6DC', glow: '#F5C04E' },
  { id: 'blazing', type: 'nameFx', name: 'Blazing', cost: 0, unlock: 'on-a-roll', color: '#FFEFDB', glow: '#F97316' },
]

export function cosmeticItem(type, id) {
  const list = type === 'frame' ? FRAMES : NAME_FX
  return list.find((item) => item.id === id) || list[0]
}
