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
  // Environment style: drifts across like a bullet screen or lucky wind
  const drift = isFeedback ? (Math.random() - 0.5) * 50 : (Math.random() > 0.5 ? 500 : -500)
  const duration = isFeedback ? 1.5 : 4 + Math.random() * 2

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: isFeedback ? y : (Math.random() * 1000 - 500), 
        x: isFeedback ? x : (drift > 0 ? -200 : 1200),
        scale: 0.5,
        rotate: (Math.random() - 0.5) * 30
      }}
      animate={{ 
        opacity: [0, 1, 1, 0], 
        y: isFeedback ? y - 200 : undefined,
        x: isFeedback ? x + drift : (drift > 0 ? 1400 : -400),
        scale: isFeedback ? [0.5, 1.2, 1] : [1, 1.5, 1],
        rotate: isFeedback ? 0 : (Math.random() - 0.5) * 60,
      }}
      transition={{ 
        duration: duration, 
        ease: isFeedback ? "easeOut" : "linear",
      }}
      className={`absolute pointer-events-none whitespace-nowrap font-bold z-20 ${
        isFeedback ? 'text-2xl' : 'text-3xl md:text-5xl opacity-40'
      }`}
      style={{ 
        color: color, 
        textShadow: isFeedback 
          ? `0 0 10px ${color}aa` 
          : `0 0 20px ${color}66`,
        fontFamily: "'STKaiti', 'KaiTi', serif"
      }}
    >
      {text}
    </motion.div>
  )
}
