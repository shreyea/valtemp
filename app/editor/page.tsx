'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ValentineCard from '@/components/ValentineCard'
import FloatingHearts from '@/components/FloatingHearts'
import Sparkles from '@/components/Sparkles'
import DebugPanel from '@/components/DebugPanel'
import { Template } from '@/lib/types'

export default function EditorPage() {
  const [question, setQuestion] = useState('Will you be my Valentine? 💖')
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [authorized, setAuthorized] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    loadTemplate()
  }, [])

  const loadTemplate = async () => {
    try {
      // Check session storage for credentials
      const userEmail = sessionStorage.getItem('user_email')
      const templateCode = sessionStorage.getItem('template_code')
      
      console.log('🔍 Editor - Session check:', {
        email: userEmail,
        hasCode: !!templateCode
      })
      
      if (!userEmail || !templateCode) {
        console.log('❌ Editor - No session found, redirecting to login')
        router.push('/auth/login')
        return
      }

      console.log('🔎 Editor - Loading template via API')

      // Call API to get template (bypasses RLS)
      const response = await fetch('/api/template/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          templateCode: templateCode,
        }),
      })

      const result = await response.json()

      console.log('📊 Editor - API response:', {
        status: response.status,
        success: result.success,
        hasTemplate: !!result.template
      })

      if (!response.ok || !result.success) {
        console.log('❌ Editor - Template not found or access denied')
        sessionStorage.clear()
        setAuthorized(false)
        setErrorMessage(result.error || 'You are not authorized to edit this template. If you need help, contact @thecraftingfactory on Instagram.')
        setLoading(false)
        return
      }

      const existingTemplate = result.template

      console.log('✅ Editor - Template loaded successfully:', {
        id: existingTemplate.id,
        template_type: existingTemplate.template_type,
        slug: existingTemplate.slug,
        is_published: existingTemplate.is_published
      })

      // Store template ID for future updates
      sessionStorage.setItem('template_id', existingTemplate.id)

      setTemplate(existingTemplate)
      setQuestion(existingTemplate.data.question)
      setShareUrl(`${window.location.origin}/v/${existingTemplate.slug}`)
      setAuthorized(true)
    } catch (error) {
      console.error('❌ Error loading template:', error)
      setErrorMessage('An error occurred while loading the template. If you need help, contact @thecraftingfactory on Instagram.')
      setAuthorized(false)
    } finally {
      setLoading(false)
    }
  }

  const handleQuestionChange = async (newQuestion: string) => {
    setQuestion(newQuestion)
    
    if (!template) {
      console.log('⚠️ Save - No template loaded')
      return
    }

    setSaving(true)
    try {
      const userEmail = sessionStorage.getItem('user_email')
      const templateCode = sessionStorage.getItem('template_code')

      if (!userEmail || !templateCode) {
        console.log('⚠️ Save - No credentials in session')
        router.push('/auth/login')
        return
      }
      
      console.log('💾 Saving template via API:', {
        templateId: template.id,
        questionLength: newQuestion.length
      })
      
      // Call API to update template (bypasses RLS)
      const response = await fetch('/api/template/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          templateCode: templateCode,
          templateId: template.id,
          question: newQuestion,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        console.error('❌ Save failed:', result.error)
        throw new Error(result.error || 'Failed to save')
      }

      console.log('✅ Saved successfully:', {
        templateId: result.template.id,
        is_published: result.template.is_published,
        slug: result.template.slug
      })
      
      // Update local state with the response
      setTemplate(result.template)
      setShareUrl(`${window.location.origin}/v/${result.template.slug}`)
      
    } catch (error: any) {
      console.error('💥 Save error:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLogout = async () => {
    sessionStorage.clear()
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-purple-200 to-rose-200">
        <div className="text-2xl text-pink-600">Loading... 💕</div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl w-full max-w-md text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-pink-600 mb-4">Access Denied</h1>
          <p className="text-gray-700 mb-6 font-semibold">
            {errorMessage}
          </p>
          <p className="text-gray-600 text-sm mb-6">
            Only users with an existing template record can access the editor.
          </p>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-all transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-rose-200 relative overflow-hidden">
      <FloatingHearts />
      <Sparkles />
      <DebugPanel />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-pink-600">💝 Editor</h1>
          <button
            onClick={handleLogout}
            className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-pink-600 hover:bg-white transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="flex justify-center items-center mb-8">
          <ValentineCard
            question={question}
            onQuestionChange={handleQuestionChange}
            isEditable={true}
          />
        </div>

        <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-pink-600 mb-4">Share Your Valentine 💌</h3>
          
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-4 py-2 border border-pink-200 rounded-lg bg-white/50"
            />
            <button
              onClick={handleCopyLink}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all"
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>

          {saving && (
            <p className="text-sm text-gray-500 mt-2">Saving...</p>
          )}
        </div>
      </div>
    </div>
  )
}
