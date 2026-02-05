'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Heart, Mail, Key, LogIn } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [templateCode, setTemplateCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const normalizedEmail = email.trim().toLowerCase()
      
      console.log('🔍 Login attempt:', {
        email: normalizedEmail,
        hasTemplateCode: !!templateCode,
        templateType: 'simp'
      })

      // Call server-side API for authentication
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
          templateCode: templateCode,
        }),
      })

      const result = await response.json()

      console.log('🔎 Login API response:', {
        status: response.status,
        success: result.success,
        hasTemplate: !!result.template
      })

      if (!response.ok) {
        console.log('❌ Login failed (network):', result?.error)
        setMessage(result?.error || 'Login failed. If you need help, contact @thecraftingfactory on Instagram.')
        setLoading(false)
        return
      }

      if (!result.success) {
        console.log('❌ Login failed (invalid):', result?.error)
        setMessage(result?.error || 'Invalid email or template code. If you need help, contact @thecraftingfactory on Instagram.')
        setLoading(false)
        return
      }

      console.log('✅ Login successful:', {
        templateId: result.template.id,
        slug: result.template.slug,
        templateType: result.template.template_type,
      })
      
      // Store credentials in sessionStorage
      sessionStorage.setItem('user_email', normalizedEmail)
      sessionStorage.setItem('template_code', templateCode)
      sessionStorage.setItem('template_id', result.template.id)
      
      router.push('/editor')
    } catch (error: any) {
      console.error('💥 Login error:', error)
      setMessage(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-pastel-love relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-40 h-40 bg-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-200/30 rounded-full blur-3xl"></div>

      <div className="bg-white/95 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 border-4 border-pink-100/50">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Heart className="w-20 h-20 text-pink-400 fill-pink-400 drop-shadow-lg" />
          </div>
          <h1 className="text-5xl font-handwritten text-pink-600 mb-3 drop-shadow-sm">Valentine Editor</h1>
          <p className="text-gray-600 font-soft text-lg">Create your Valentine template</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2 font-soft">
              <Mail className="w-4 h-4 text-pink-500" />
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full px-5 py-4 border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent font-soft transition-all"
            />
          </div>

          <div>
            <label htmlFor="templateCode" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2 font-soft">
              <Key className="w-4 h-4 text-pink-500" />
              Template Code
            </label>
            <input
              id="templateCode"
              type="text"
              value={templateCode}
              onChange={(e) => setTemplateCode(e.target.value)}
              placeholder="Enter your template code"
              required
              className="w-full px-5 py-4 border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent font-soft transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-400 via-pink-500 to-rose-500 text-white py-4 rounded-xl font-bold text-lg hover:from-pink-500 hover:to-rose-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 shadow-xl font-soft border-2 border-white/30"
            style={{
              boxShadow: '0 10px 30px rgba(236, 72, 153, 0.3)'
            }}
          >
            {loading ? (
              <>
                <LogIn className="w-6 h-6 animate-pulse" />
                Verifying...
              </>
            ) : (
              <>
                <LogIn className="w-6 h-6" />
                Access Template
              </>
            )}
          </button>
        </form>

        {message && (
          <div className={`mt-5 p-4 rounded-xl text-sm text-center font-soft font-medium ${
            message.includes('Check') 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
