'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'

export default function FloatingHearts() {
  const [hearts, setHearts] = useState<Array<{ id: number; left: number; delay: number; duration: number; size: number; opacity: number; rotation: number }>>([])

  useEffect(() => {
    const heartsArray = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 12 + Math.random() * 8,
      size: 16 + Math.random() * 40, // Varied sizes from 16px to 56px
      opacity: 0.25 + Math.random() * 0.35, // More visible: 0.25 to 0.6
      rotation: Math.random() * 360,
    }))
    setHearts(heartsArray)
  }, [])

  const pastelColors = [
    '#ff8a80', // coral
    '#ffab91', // peach
    '#f48fb1', // blush
    '#ce93d8', // lavender
    '#f06292', // rose
    '#ff80ab', // pink accent
    '#ea80fc', // purple accent
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute"
          style={{
            left: `${heart.left}%`,
            color: pastelColors[heart.id % pastelColors.length],
          }}
          initial={{ bottom: '-15%', opacity: 0, rotate: heart.rotation }}
          animate={{
            bottom: '115%',
            opacity: [0, heart.opacity, heart.opacity, heart.opacity * 0.5, 0],
            rotate: heart.rotation + (Math.random() > 0.5 ? 30 : -30),
            x: [0, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 20, 0],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <Heart
            size={heart.size}
            fill="currentColor"
            strokeWidth={0}
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))',
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}
