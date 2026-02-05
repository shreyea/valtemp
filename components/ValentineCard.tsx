'use client'

import { motion } from 'framer-motion'
import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import confetti from 'canvas-confetti'
import { Heart, X } from 'lucide-react'

interface ValentineCardProps {
  question: string
  onQuestionChange?: (question: string) => void
  isEditable: boolean
}

export default function ValentineCard({ question, onQuestionChange, isEditable }: ValentineCardProps) {
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 })
  const [hoverCount, setHoverCount] = useState(0)
  const noButtonRef = useRef<HTMLButtonElement>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)

  const convincingMessages = [
    "Wait! Think about it... 💭",
    "Are you sure? 🥺",
    "Please reconsider! 💝",
    "Don't break my heart! 💔",
    "Give it a chance! ✨",
    "You'll regret this! 😢",
    "Just say yes! 🙏",
    "Pretty please? 🌸",
    "One more chance! 💖",
    "You know you want to! 😊"
  ]

  const handleYesClick = () => {
    // Trigger confetti
    const count = 200
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999
    }

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      })
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    })

    fire(0.2, {
      spread: 60,
    })

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    })

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    })

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    })
  }

  // Smooth, responsive movement constrained inside the card
  const handleNoHover = () => {
    if (!noButtonRef.current || !cardRef.current) return

    setHoverCount(prev => prev + 1)

    const cardRect = cardRef.current.getBoundingClientRect()
    const btnRect = noButtonRef.current.getBoundingClientRect()

    // available space inside card
    const availableWidth = cardRect.width - btnRect.width - 32
    const availableHeight = cardRect.height - btnRect.height - 32

    // Random position within bounds
    const maxOffsetX = Math.max(availableWidth / 2.5, 40)
    const maxOffsetY = Math.max(availableHeight / 3, 30)

    // calculate a new position clamped to available area
    const newX = Math.max(-maxOffsetX, Math.min(maxOffsetX, (Math.random() - 0.5) * 2 * maxOffsetX))
    const newY = Math.max(-maxOffsetY, Math.min(maxOffsetY, (Math.random() - 0.5) * 2 * maxOffsetY))

    setNoButtonPos({ x: newX, y: newY })
  }

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full mx-4 border-4 border-pink-100/50"
      style={{
        boxShadow: '0 20px 60px rgba(255, 182, 193, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <motion.div 
          className="flex justify-center mb-6"
          animate={{ 
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Heart className="w-20 h-20 md:w-28 md:h-28 text-pink-400 fill-pink-400 drop-shadow-lg" />
        </motion.div>
        
        {isEditable ? (
          <input
            type="text"
            value={question}
            onChange={(e) => onQuestionChange?.(e.target.value)}
            className="text-2xl md:text-4xl font-handwritten text-pink-600 text-center w-full bg-transparent border-b-2 border-pink-300 focus:outline-none focus:border-pink-500 transition-colors px-4 py-3 placeholder-pink-300"
            placeholder="Enter your question..."
          />
        ) : (
          <h2 className="text-3xl md:text-5xl font-handwritten text-pink-600 px-4 leading-relaxed">
            {question}
          </h2>
        )}
      </motion.div>

      <motion.div
        ref={cardRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-10 relative min-h-[140px] p-4"
      >
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleYesClick}
          className="bg-gradient-to-r from-pink-400 via-pink-500 to-rose-500 text-white px-10 py-5 rounded-full text-xl md:text-2xl font-bold shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 font-soft border-2 border-white/30"
          style={{
            boxShadow: '0 10px 30px rgba(236, 72, 153, 0.4)'
          }}
        >
          <Heart className="w-6 h-6 fill-white" />
          Yes!
        </motion.button>

        <motion.button
          ref={noButtonRef}
          onMouseEnter={handleNoHover}
          onTouchStart={handleNoHover}
          animate={{
            x: noButtonPos.x,
            y: noButtonPos.y,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 25,
            mass: 0.5,
          }}
          className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg md:text-xl font-semibold shadow-md cursor-pointer flex items-center gap-2 font-soft border-2 border-gray-300/50 transition-colors"
        >
          <X className="w-5 h-5" />
          No
        </motion.button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-pink-500 mt-8 text-base font-soft font-medium"
      >
        {hoverCount > 0 ? convincingMessages[Math.min(hoverCount - 1, convincingMessages.length - 1)] : "Hover over 'No' if you dare..."}
      </motion.p>
    </motion.div>
  )
}
