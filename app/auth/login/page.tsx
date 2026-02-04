'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200">
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pink-600 mb-2">💕 Simp</h1>
          <p className="text-gray-600">Create your Valentine template</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="templateCode" className="block text-sm font-medium text-gray-700 mb-2">
              Template Code
            </label>
            <input
              id="templateCode"
              type="text"
              value={templateCode}
              onChange={(e) => setTemplateCode(e.target.value)}
              placeholder="Enter your template code"
              required
              className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Verifying...' : 'Access Template 💕'}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-xl text-sm text-center ${
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
