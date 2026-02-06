'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect, useCallback } from 'react'
import confetti from 'canvas-confetti'
import { Heart, X, Sparkles, PartyPopper, Star, Gift, Music, Camera, Flower2 } from 'lucide-react'

interface ValentineCardProps {
  question: string
  onQuestionChange?: (question: string) => void
  isEditable: boolean
}

// Beautiful pastel color palette
const colors = {
  coral: '#ff8a80',
  peach: '#ffab91',
  blush: '#f48fb1',
  lavender: '#ce93d8',
  mint: '#80cbc4',
  sky: '#81d4fa',
  cream: '#fff8e1',
  rose: '#f06292',
}

// Static background hearts configuration
const staticHearts = [
  { x: 8, y: 12, size: 20, opacity: 0.2, rotation: -15, color: colors.coral },
  { x: 85, y: 8, size: 16, opacity: 0.18, rotation: 20, color: colors.blush },
  { x: 92, y: 45, size: 24, opacity: 0.22, rotation: -8, color: colors.peach },
  { x: 5, y: 75, size: 18, opacity: 0.17, rotation: 12, color: colors.lavender },
  { x: 78, y: 85, size: 22, opacity: 0.2, rotation: -25, color: colors.rose },
  { x: 15, y: 40, size: 14, opacity: 0.15, rotation: 30, color: colors.coral },
  { x: 88, y: 70, size: 12, opacity: 0.16, rotation: -5, color: colors.blush },
  { x: 12, y: 90, size: 16, opacity: 0.18, rotation: 15, color: colors.peach },
  { x: 75, y: 25, size: 18, opacity: 0.19, rotation: -18, color: colors.lavender },
  { x: 50, y: 5, size: 14, opacity: 0.15, rotation: 8, color: colors.rose },
]

export default function ValentineCard({ question, onQuestionChange, isEditable }: ValentineCardProps) {
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 })
  const [hoverCount, setHoverCount] = useState(0)
  const [noButtonText, setNoButtonText] = useState('No')
  const [celebration, setCelebration] = useState(false)
  const [celebrationText, setCelebrationText] = useState<string | null>(null)
  const [lastMoveTime, setLastMoveTime] = useState(0)
  const noButtonRef = useRef<HTMLButtonElement>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const convincingMessages = [
    "Wait...",
    "Really?",
    "Sure?",
    "Think!",
    "Please?",
    "Nope!",
    "Try again",
    "Maybe?",
    "Hmm...",
    "Oops!"
  ]

  const handleYesClick = () => {
    const celebratoryPhrases = [
      "You said YES!",
      "A perfect 'Yes' — hearts everywhere! 🩷",
      "You made my day!",
      "This is amazing!",
    ]
    const pick = celebratoryPhrases[Math.floor(Math.random() * celebratoryPhrases.length)]
    setCelebrationText(pick)
    setCelebration(true)

    setTimeout(() => {
      setCelebration(false)
      setCelebrationText(null)
    }, 8000)

    // Enhanced confetti with pastel colors
    const pastelConfettiColors = ['#ff8a80', '#ffab91', '#f48fb1', '#ce93d8', '#80cbc4', '#81d4fa', '#fff176', '#ffcc80']

    const count = 250
    const defaults = {
      origin: { y: 0.6 },
      zIndex: 9999,
      colors: pastelConfettiColors,
    }

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      })
    }

    // Multiple bursts for scrapbook feel
    fire(0.25, { spread: 26, startVelocity: 55 })
    fire(0.2, { spread: 60 })
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
    fire(0.1, { spread: 120, startVelocity: 45 })

    // Side bursts
    setTimeout(() => {
      confetti({ ...defaults, origin: { x: 0.1, y: 0.6 }, spread: 50, particleCount: 50 })
      confetti({ ...defaults, origin: { x: 0.9, y: 0.6 }, spread: 50, particleCount: 50 })
    }, 200)
  }

  // Improved: Move button within safe bounds of the card
  const moveNoButton = useCallback(() => {
    if (!noButtonRef.current || !containerRef.current) return

    // Throttle movement to prevent laggy rapid updates
    const now = Date.now()
    if (now - lastMoveTime < 200) return
    setLastMoveTime(now)

    const newCount = hoverCount + 1
    setHoverCount(newCount)

    // Update button text with convincing message
    setNoButtonText(convincingMessages[Math.min(newCount - 1, convincingMessages.length - 1)])

    const containerRect = containerRef.current.getBoundingClientRect()
    const btnRect = noButtonRef.current.getBoundingClientRect()

    // Calculate safe bounds - keep button well within the container
    const padding = 24
    const maxX = Math.max(0, (containerRect.width / 2) - (btnRect.width / 2) - padding)
    const maxY = Math.max(0, (containerRect.height / 2) - (btnRect.height / 2) - padding)

    // Define positions within safe bounds (reduced multipliers)
    const positions = [
      { x: -maxX * 0.6, y: -maxY * 0.5 },   // top-left
      { x: maxX * 0.6, y: -maxY * 0.5 },    // top-right
      { x: -maxX * 0.6, y: maxY * 0.5 },    // bottom-left
      { x: maxX * 0.6, y: maxY * 0.5 },     // bottom-right
      { x: 0, y: -maxY * 0.6 },             // top-center
      { x: 0, y: maxY * 0.6 },              // bottom-center
      { x: -maxX * 0.7, y: 0 },             // left-center
      { x: maxX * 0.7, y: 0 },              // right-center
      { x: -maxX * 0.4, y: -maxY * 0.3 },   // upper-left
      { x: maxX * 0.4, y: -maxY * 0.3 },    // upper-right
      { x: -maxX * 0.4, y: maxY * 0.3 },    // lower-left
      { x: maxX * 0.4, y: maxY * 0.3 },     // lower-right
    ]

    // Pick a random position that's different from current
    let newPos
    let attempts = 0
    do {
      newPos = positions[Math.floor(Math.random() * positions.length)]
      attempts++
    } while (
      attempts < 5 &&
      Math.abs(newPos.x - noButtonPos.x) < maxX * 0.3 &&
      Math.abs(newPos.y - noButtonPos.y) < maxY * 0.3
    )

    // Clamp to safe bounds (no extra randomness to prevent overflow)
    const finalX = Math.max(-maxX, Math.min(maxX, newPos.x))
    const finalY = Math.max(-maxY, Math.min(maxY, newPos.y))

    setNoButtonPos({ x: finalX, y: finalY })
  }, [hoverCount, noButtonPos, lastMoveTime])

  // Detect cursor proximity to the "No" button
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!noButtonRef.current || celebration) return

      const btnRect = noButtonRef.current.getBoundingClientRect()
      const btnCenterX = btnRect.left + btnRect.width / 2
      const btnCenterY = btnRect.top + btnRect.height / 2

      const distance = Math.sqrt(
        Math.pow(e.clientX - btnCenterX, 2) + Math.pow(e.clientY - btnCenterY, 2)
      )

      // Move when cursor is within 100px of the button center
      if (distance < 100) {
        moveNoButton()
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [moveNoButton, celebration])

  return (
    <motion.div
      ref={containerRef}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      className="relative bg-gradient-to-br from-white/95 via-[#fff5f8]/90 to-[#fef3f2]/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8 md:p-12 max-w-2xl w-full mx-2 sm:mx-4 border border-[#ffcdd2]/60 overflow-hidden"
      style={{
        boxShadow: '0 25px 80px rgba(255, 138, 128, 0.25), 0 8px 32px rgba(244, 143, 177, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.9)'
      }}
    >
      {/* Static Background Hearts - Always Visible */}
      {staticHearts.map((heart, i) => (
        <motion.div
          key={`static-heart-${i}`}
          className="absolute pointer-events-none"
          style={{
            left: `${heart.x}%`,
            top: `${heart.y}%`,
            transform: `rotate(${heart.rotation}deg)`,
            color: heart.color,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [heart.opacity, heart.opacity * 1.3, heart.opacity],
          }}
          transition={{
            duration: 3 + i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2,
          }}
        >
          <Heart
            size={heart.size}
            className="fill-current"
          />
        </motion.div>
      ))}

      {/* Scrapbook decorative corner elements */}
      <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-[#f48fb1]/40 rounded-tl-lg" />
      <div className="absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 border-[#ce93d8]/40 rounded-tr-lg" />
      <div className="absolute bottom-3 left-3 w-8 h-8 border-l-2 border-b-2 border-[#80cbc4]/40 rounded-bl-lg" />
      <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-[#ffab91]/40 rounded-br-lg" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-6 sm:mb-8 relative z-10"
      >
        <motion.div
          className="flex justify-center mb-4 sm:mb-6"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="relative">
            <Heart className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-[#f06292] fill-[#f06292] drop-shadow-sm" />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-[#f48fb1] fill-[#f48fb1]" />
            </motion.div>
          </div>
        </motion.div>

        {isEditable ? (
          <input
            type="text"
            value={question}
            onChange={(e) => onQuestionChange?.(e.target.value)}
            className="text-xl sm:text-2xl md:text-4xl font-handwritten text-[#d81b60] text-center w-full bg-transparent border-b-2 border-[#f48fb1] focus:outline-none focus:border-[#f06292] transition-colors px-2 sm:px-4 py-2 sm:py-3 placeholder-[#f8bbd9]"
            placeholder="Enter your question..."
          />
        ) : (
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-handwritten text-[#d81b60] px-2 sm:px-4 leading-relaxed">
            {question}
          </h2>
        )}
      </motion.div>

      <motion.div
        ref={cardRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mt-6 sm:mt-10 relative min-h-[150px] sm:min-h-[180px] p-2 sm:p-4"
      >
        {/* Enhanced Yes Button */}
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleYesClick}
          className="relative bg-gradient-to-r from-[#ff6b6b] via-[#f06292] to-[#ec407a] text-white px-8 sm:px-12 py-4 sm:py-6 rounded-full text-lg sm:text-xl md:text-2xl font-semibold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 sm:gap-3 font-handwritten border-2 border-white/50 overflow-hidden"
          style={{
            boxShadow: '0 10px 30px rgba(240, 98, 146, 0.5), 0 4px 15px rgba(236, 64, 122, 0.4), inset 0 2px 2px rgba(255, 255, 255, 0.4)'
          }}
          animate={{
            boxShadow: [
              '0 10px 30px rgba(240, 98, 146, 0.5), 0 4px 15px rgba(236, 64, 122, 0.4)',
              '0 18px 45px rgba(240, 98, 146, 0.6), 0 8px 25px rgba(236, 64, 122, 0.5)',
              '0 10px 30px rgba(240, 98, 146, 0.5), 0 4px 15px rgba(236, 64, 122, 0.4)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: [-200, 200] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            style={{ width: '50%' }}
          />
          <Heart className="w-5 h-5 sm:w-7 sm:h-7 fill-white relative z-10" />
          <span className="relative z-10">Yes!</span>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -right-1 -top-1"
          >
            <Sparkles className="w-5 h-5 text-[#fff176]" />
          </motion.div>
        </motion.button>

        {/* Smooth No Button */}
        <motion.button
          ref={noButtonRef}
          animate={{
            x: noButtonPos.x,
            y: noButtonPos.y,
          }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 25,
            mass: 0.6,
          }}
          className="bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-500 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg md:text-xl font-medium shadow-md cursor-pointer flex items-center gap-2 font-soft border border-slate-200/60 transition-colors min-w-[90px] sm:min-w-[110px] justify-center"
          style={{
            boxShadow: '0 4px 12px rgba(148, 163, 184, 0.2)'
          }}
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <span className="truncate">{noButtonText}</span>
        </motion.button>
      </motion.div>

      {/* Scrapbook-style Celebration overlay */}
      <AnimatePresence>
        {celebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center"
          >
            {/* Scrapbook background with pattern */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-rose-50/95 via-pink-50/95 to-amber-50/95 backdrop-blur-md"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 20%, rgba(254, 205, 211, 0.3) 0%, transparent 40%),
                  radial-gradient(circle at 80% 80%, rgba(253, 230, 138, 0.3) 0%, transparent 40%),
                  radial-gradient(circle at 50% 50%, rgba(233, 213, 255, 0.2) 0%, transparent 50%)
                `
              }}
            />

            {/* Floating decorative elements */}
            <motion.div
              className="absolute top-8 left-8"
              animate={{ rotate: [0, 10, -10, 0], y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Star className="w-8 h-8 text-amber-300 fill-amber-300" />
            </motion.div>
            <motion.div
              className="absolute top-12 right-10"
              animate={{ rotate: [0, -15, 15, 0], y: [0, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
            >
              <Heart className="w-10 h-10 text-rose-300 fill-rose-300" />
            </motion.div>
            <motion.div
              className="absolute bottom-16 left-12"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <Flower2 className="w-9 h-9 text-pink-300" />
            </motion.div>
            <motion.div
              className="absolute bottom-20 right-8"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
            >
              <Music className="w-7 h-7 text-purple-300" />
            </motion.div>
            <motion.div
              className="absolute top-1/4 left-6"
              animate={{ y: [0, -10, 0], rotate: [0, -5, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.2 }}
            >
              <Camera className="w-8 h-8 text-slate-400" />
            </motion.div>
            <motion.div
              className="absolute bottom-1/4 right-6"
              animate={{ y: [0, -8, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.4 }}
            >
              <Gift className="w-9 h-9 text-rose-400" />
            </motion.div>

            {/* Main celebration card - scrapbook style */}
            <motion.div
              className="relative bg-white/90 px-6 sm:px-10 py-6 sm:py-10 rounded-2xl shadow-2xl border-2 border-dashed border-rose-200 text-center max-w-md mx-3 sm:mx-4"
              initial={{ y: 30, scale: 0.8, rotate: -5 }}
              animate={{ y: 0, scale: 1, rotate: [-2, 2, -2] }}
              transition={{
                y: { duration: 0.5 },
                scale: { duration: 0.5 },
                rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              style={{
                boxShadow: '0 20px 60px rgba(251, 207, 232, 0.5), 0 4px 20px rgba(0,0,0,0.08)',
                background: 'linear-gradient(135deg, #ffffff 0%, #fff5f7 50%, #fef7f0 100%)',
              }}
            >
              {/* Tape decoration on corners */}
              <div className="absolute -top-3 left-1/4 w-16 h-6 bg-amber-100/80 rotate-[-8deg] rounded-sm shadow-sm"
                style={{ background: 'linear-gradient(90deg, rgba(254,243,199,0.9) 0%, rgba(253,230,138,0.7) 100%)' }} />
              <div className="absolute -top-2 right-1/4 w-14 h-5 bg-rose-100/80 rotate-[6deg] rounded-sm shadow-sm"
                style={{ background: 'linear-gradient(90deg, rgba(254,205,211,0.9) 0%, rgba(251,207,232,0.7) 100%)' }} />

              {/* Party popper icon */}
              <motion.div
                className="flex justify-center mb-3 sm:mb-5"
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.5 }}
              >
                <div className="relative">
                  <PartyPopper className="w-12 h-12 sm:w-16 sm:h-16 text-rose-400" />
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                  >
                    <Sparkles className="w-6 h-6 text-amber-400 fill-amber-400" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Celebration text */}
              <motion.h3
                className="text-2xl sm:text-4xl md:text-5xl font-handwritten text-rose-500 mb-3 sm:mb-4"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {celebrationText}
              </motion.h3>

              {/* Decorative line */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-rose-200" />
                <Heart className="w-4 h-4 text-rose-300 fill-rose-300" />
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-rose-200" />
              </div>

              {/* Subtitle */}
              <div className="flex items-center justify-center gap-2 text-slate-500 font-soft">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <p className="text-sm sm:text-base italic">This is the start of something beautiful</p>
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              </div>

              {/* Bottom decorative hearts */}
              <div className="flex justify-center gap-2 mt-5">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                  >
                    <Heart
                      className="w-4 h-4 fill-current"
                      style={{ color: ['#fecdd3', '#fbcfe8', '#f9a8d4', '#fbcfe8', '#fecdd3'][i] }}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-[#f06292] mt-8 text-base font-soft font-medium relative z-10"
      >

        {hoverCount > 0 ? `Attempts: ${hoverCount} - Keep trying!` : "Hover over 'No' if you dare..."}
      </motion.p>
    </motion.div>
  )
}
