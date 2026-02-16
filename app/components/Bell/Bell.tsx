'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface BellProps {
  count: number
  onClick: (e: React.MouseEvent | React.TouchEvent) => void
}

const auspiciousEmojis = ['🔔', '🧧', '🐎', '🍊', '🏮', '🎆']

export default function Bell({ count, onClick }: BellProps) {
  const [currentEmoji, setCurrentEmoji] = useState('🔔')

  useEffect(() => {
    // Randomize emoji every 10 clicks or just keep it dynamic
    if (count % 10 === 0) {
      setCurrentEmoji(auspiciousEmojis[Math.floor(Math.random() * auspiciousEmojis.length)])
    }
  }, [count])

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      animate={
        count > 0 && count % 10 === 0
          ? {
              scale: [1, 1.3, 0.9, 1.1, 1],
              rotate: [0, 15, -15, 5, 0],
              filter: [
                'drop-shadow(0 0 20px rgba(255,207,77,0.4))',
                'drop-shadow(0 0 50px rgba(255,207,77,0.8))',
                'drop-shadow(0 0 20px rgba(255,207,77,0.4))'
              ]
            }
          : {
              scale: [1, 1.05, 1],
            }
      }
      transition={{ duration: 0.3 }}
      className="relative z-10 cursor-pointer select-none text-[150px] md:text-[200px]"
      style={{
        filter: 'drop-shadow(0 0 30px rgba(255,207,77,0.4))',
      }}
      onMouseDown={(e) => onClick(e)}
      onTouchStart={(e) => {
        e.preventDefault()
        onClick(e)
      }}
    >
      <span className="relative">
        {currentEmoji}
        {/* Shine effect for milestones */}
        {count > 0 && count % 10 === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 2] }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl -z-10"
          />
        )}
      </span>
    </motion.div>
  )
}
