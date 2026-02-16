'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface BellProps {
  count: number
  onClick: (e: React.MouseEvent | React.TouchEvent) => void
}

const auspiciousEmojis = ['🔔', '🧧', '🐎', '🍊', '🏮', '🎆']

export default function Bell({ count, onClick }: BellProps) {
  // 按照用户需求，固定为红包图标，不再随机切换
  const currentEmoji = '🧧'

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        scale: [1, 1.1, 1],
      }}
      transition={{ 
        duration: 0.1,
        type: "spring",
        stiffness: 300
      }}
      className="relative z-10 cursor-pointer select-none text-[160px] md:text-[220px]"
      style={{
        filter: 'drop-shadow(0 0 40px rgba(212,0,0,0.6))',
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
