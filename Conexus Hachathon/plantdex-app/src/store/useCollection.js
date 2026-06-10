// Pokédex-style collection persisted on-device via AsyncStorage.
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const DEX_GOAL = 24
const POINTS_NEW = 100
const POINTS_REPEAT = 10

export const useCollection = create(
  persist(
    (set, get) => ({
      plants: {}, // { [scientificName]: { ...plant, firstFound, timesSeen } }
      points: 0,

      addSighting: (plant) => {
        const key = plant.scientificName
        const existing = get().plants[key]
        const isNew = !existing
        const entry = existing
          ? { ...existing, timesSeen: existing.timesSeen + 1 }
          : { ...plant, firstFound: Date.now(), timesSeen: 1 }

        set((s) => ({
          plants: { ...s.plants, [key]: entry },
          points: s.points + (isNew ? POINTS_NEW : POINTS_REPEAT),
        }))
        return { isNew }
      },

      reset: () => set({ plants: {}, points: 0 }),
    }),
    {
      name: 'plantdex-collection',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)

export function collectionList(plants) {
  return Object.values(plants).sort((a, b) => b.firstFound - a.firstFound)
}
