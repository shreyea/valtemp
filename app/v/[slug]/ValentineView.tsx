'use client'

import ValentineCard from '@/components/ValentineCard'
import FloatingHearts from '@/components/FloatingHearts'
import Sparkles from '@/components/Sparkles'

interface ValentineViewProps {
  question: string
}

export default function ValentineView({ question }: ValentineViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-rose-200 relative overflow-hidden">
      <FloatingHearts />
      <Sparkles />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <ValentineCard
          question={question}
          isEditable={false}
        />
      </div>

      <div className="fixed bottom-4 left-0 right-0 text-center">
        <a
          href="/auth/login"
          className="inline-block bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full text-pink-600 hover:bg-white transition-all shadow-lg font-semibold"
        >
          Create Your Own 💝
        </a>
      </div>
    </div>
  )
}
