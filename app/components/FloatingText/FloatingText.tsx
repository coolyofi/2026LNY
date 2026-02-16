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
      initial={{ opacity: 1, y: 0, scale: isFeedback ? 0.8 : 1 }}
      animate={{ 
        opacity: isFeedback ? [1, 1, 0.8, 0.3, 0] : [1, 1, 0.8, 0], 
        y: isFeedback ? -200 : -350,
        scale: isFeedback ? [0.8, 1.2, 1.1, 0.9] : [1, 1.1, 1]
      }}
      transition={{ duration: duration, ease: isFeedback ? [0.22, 1, 0.36, 1] : 'linear' }}
      className={`absolute pointer-events-none whitespace-nowrap font-bold z-20 ${isFeedback ? 'text-lg md:text-3xl' : 'text-2xl md:text-4xl opacity-40 not-italic'}`}
      style={{
        left: '50%',
        top: '50%',
        transform: 'translateX(-50%)',
        color: color,
        textShadow: `0 0 15px ${color}`,
        fontFamily: "'STKaiti', 'KaiTi', serif"
      }}
    >
      {text}
    </motion.div>
  )
}
