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
  const duration = isFeedback ? 1.0 : 5 + Math.random() * 3

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: isFeedback ? y - 50 : (Math.random() * 800 - 400), 
        x: isFeedback ? x - 40 : (Math.random() > 0.5 ? -300 : 1300),
        scale: isFeedback ? 0.8 : 1,
      }}
      animate={{ 
        opacity: [0, 1, 1, 0], 
        y: isFeedback ? y - 250 : undefined,
        x: isFeedback ? x - 40 : (Math.random() > 0.5 ? 1500 : -500),
        scale: isFeedback ? [0.8, 1.5, 1.2] : [1, 1.2, 1],
      }}
      transition={{ 
        duration: duration, 
        ease: isFeedback ? [0.22, 1, 0.36, 1] : "linear",
      }}
      className={`absolute pointer-events-none whitespace-nowrap font-bold z-20 ${
        isFeedback ? 'text-2xl md:text-4xl' : 'text-3xl md:text-5xl opacity-20 italic'
      }`}
      style={{ 
        color: color, 
        textShadow: `0 0 15px ${color}`,
        fontFamily: "'STKaiti', 'KaiTi', serif"
      }}
    >
      {text}
    </motion.div>
  )
}
