'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ValentineCard from '@/components/ValentineCard'
import FloatingHearts from '@/components/FloatingHearts'
import Sparkles from '@/components/Sparkles'
import DebugPanel from '@/components/DebugPanel'
import { Template } from '@/lib/types'
import { Heart, Save, Copy, Check, LogOut, Shield } from 'lucide-react'

export default function EditorPage() {
  const [question, setQuestion] = useState('Will you be my Valentine?')
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
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

  const handleQuestionChange = (newQuestion: string) => {
    setQuestion(newQuestion)
  }

  const handleSave = async () => {
    if (!template) {
      console.log('⚠️ Save - No template loaded')
      return
    }

    setSaving(true)
    setSaveSuccess(false)
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
        questionLength: question.length
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
          question: question,
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
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
      
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-400 via-pink-500 to-purple-500">
        <div className="text-2xl text-white flex items-center gap-3">
          <Heart className="w-8 h-8 animate-pulse fill-white" />
          Loading...
        </div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-400 via-pink-500 to-purple-500">
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl w-full max-w-md text-center">
          <div className="flex justify-center mb-4">
            <Shield className="w-16 h-16 text-pink-600" />
          </div>
          <h1 className="text-2xl font-bold text-pink-600 mb-4">Access Denied</h1>
          <p className="text-gray-700 mb-6 font-semibold">
            {errorMessage}
          </p>
          <p className="text-gray-600 text-sm mb-6">
            Only users with an existing template record can access the editor.
          </p>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pastel-love relative overflow-hidden">
      <FloatingHearts />
      <Sparkles />
      <DebugPanel />
      
      {/* Animated background overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Heart className="w-8 h-8 fill-white" />
            Editor
          </h1>
          <button
            onClick={handleLogout}
            className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-pink-600 hover:bg-white transition-colors flex items-center gap-2 font-medium"
          >
            <LogOut className="w-4 h-4" />
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

        {/* Save Button */}
        <div className="max-w-2xl mx-auto mb-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl"
          >
            {saving ? (
              <>
                <Save className="w-5 h-5 animate-pulse" />
                Saving...
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-5 h-5" />
                Saved Successfully!
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>

        <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-pink-600 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 fill-pink-600" />
            Share Your Valentine
          </h3>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-4 py-3 border border-pink-200 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <button
              onClick={handleCopyLink}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
