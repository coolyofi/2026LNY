'use client'

import { motion } from 'framer-motion'

interface FloatingTextProps {
  text: string
  x: number
  y: number
  color: string
  type?: 'feedback' | 'environment'
}

export function FloatingText({ text, x, y, color, type = 'feedback' }: FloatingTextProps) {
  const isFeedback = type === 'feedback'
  
  // Feedback style: floats up quickly, stays near click
  const duration = isFeedback ? 1.0 + Math.random() * 0.6 : 6 + Math.random() * 3

  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: isFeedback ? 0.9 : 1 }}
      animate={{ opacity: [0, 1, 1, 0], y: isFeedback ? -80 + (Math.random() * -20) : -200 + Math.random() * -200, scale: isFeedback ? [0.9, 1.15, 0.95] : [1, 1.1, 1] }}
      transition={{ duration: duration, ease: isFeedback ? [0.22, 1, 0.36, 1] : 'linear' }}
      className={`absolute pointer-events-none whitespace-nowrap font-bold z-20 ${isFeedback ? 'text-2xl md:text-4xl' : 'text-3xl md:text-5xl opacity-20 italic'}`}
      style={{
        left: x,
        top: y,
        transformOrigin: 'center',
        color: color,
        textShadow: `0 0 15px ${color}`,
        fontFamily: "'STKaiti', 'KaiTi', serif",
        filter: isFeedback ? 'blur(0px)' : 'blur(2px)'
      }}
    >
      {text}
    </motion.div>
  )
}
