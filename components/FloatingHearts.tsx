'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'

export default function FloatingHearts() {
  const [hearts, setHearts] = useState<Array<{ id: number; left: number; delay: number; duration: number; size: number; opacity: number; rotation: number }>>([])

  useEffect(() => {
    // Create a grid-based distribution for better spread
    const columns = 5 // Divide screen into 5 columns
    const heartsPerColumn = 3 // 3 hearts per column = 15 total
    const heartsArray: Array<{ id: number; left: number; delay: number; duration: number; size: number; opacity: number; rotation: number }> = []

    for (let col = 0; col < columns; col++) {
      for (let row = 0; row < heartsPerColumn; row++) {
        const baseLeft = (col * 100) / columns
        // Add randomness within each column section (wider spread)
        const leftVariance = (100 / columns) * 0.7
        const left = baseLeft + (Math.random() * leftVariance)

        heartsArray.push({
          id: col * heartsPerColumn + row,
          left: Math.min(95, Math.max(5, left)), // Keep within bounds
          delay: row * 2 + Math.random() * 3, // Stagger by row with randomness
          duration: 16 + Math.random() * 10, // Slower, smoother: 16-26s
          size: 24 + Math.random() * 48, // Larger: 24px to 72px
          opacity: 0.35 + Math.random() * 0.35, // More visible: 0.35 to 0.7
          rotation: -30 + Math.random() * 60, // Less rotation: -30 to 30
        })
      }
    }

    setHearts(heartsArray)
  }, [])

  // Enhanced pink-heavy color palette for camera visibility
  const pastelColors = [
    '#ff6b9d', // vibrant pink
    '#ff8fab', // soft hot pink
    '#f472b6', // bright rose
    '#ec4899', // deep pink
    '#f9a8d4', // light pink
    '#ff7eb3', // candy pink
    '#ffb6c1', // light rose
    '#ffc0cb', // classic pink
    '#ff69b4', // hot pink
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
          initial={{ bottom: '-10%', opacity: 0, rotate: heart.rotation, scale: 0.8 }}
          animate={{
            bottom: '110%',
            opacity: [0, heart.opacity * 0.8, heart.opacity, heart.opacity, heart.opacity * 0.6, 0],
            rotate: heart.rotation + (heart.id % 2 === 0 ? 20 : -20),
            x: [0, 15, -10, 20, -15, 0], // Gentle sway
            scale: [0.8, 1, 1.05, 1, 0.95, 0.8],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: 'easeInOut', // Smooth easing instead of linear
            times: [0, 0.15, 0.4, 0.6, 0.85, 1], // Control keyframe timing
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
