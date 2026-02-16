export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: number | null
}

export interface FloatingMessage {
  id: number
  text: string
  x: number
  y: number
  color: string
  type?: 'feedback' | 'environment'
}
