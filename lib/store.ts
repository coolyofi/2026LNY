import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PrayerState {
  count: number
  totalPrayers: number
  achievements: string[]
  increment: () => void
  reset: () => void
}

export const usePrayerStore = create<PrayerState>()(
  persist(
    (set, get) => ({
      count: 0,
      totalPrayers: 0,
      achievements: [],
      
      increment: () => {
        const currentCount = get().count
        const newCount = currentCount + 1
        const newTotal = get().totalPrayers + 1
        
        const newAchievements = [...get().achievements]
        if (newCount === 1) newAchievements.push('首次祈福')
        if (newCount >= 10) newAchievements.push('初窥门径')
        if (newCount >= 50) newAchievements.push('虔诚之心')
        if (newCount >= 100) newAchievements.push('功德圆满')
        
        set({ 
          count: newCount, 
          totalPrayers: newTotal,
          achievements: Array.from(new Set(newAchievements))
        })
      },
      
      reset: () => set({ count: 0 }),
    }),
    {
      name: 'prayer-storage',
    }
  )
)
