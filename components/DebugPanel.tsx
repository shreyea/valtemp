'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const supabase = createClient()

  const runDebug = async () => {
    const info: any = {
      timestamp: new Date().toISOString(),
      checks: []
    }

    // Check session
    const userEmail = sessionStorage.getItem('user_email')
    const templateCode = sessionStorage.getItem('template_code')
    
    info.checks.push({
      name: 'Session Storage',
      status: (userEmail && templateCode) ? 'success' : 'failed',
      data: { email: userEmail, hasCode: !!templateCode },
      error: (!userEmail || !templateCode) ? 'No session found' : undefined
    })

    if (userEmail && templateCode) {
      // Check template
      const { data: template, error: templateError } = await supabase
        .from('projects')
        .select('*')
        .eq('owner_email', userEmail)
        .eq('template_code', templateCode)
        .eq('template_type', 'simp')
        .single()

      info.checks.push({
        name: 'Template Query',
        status: template ? 'success' : 'failed',
        data: template || null,
        error: templateError?.message,
        query: { email: userEmail, template_type: 'simp', hasCode: true }
      })

      if (template) {
        // Check public access
        const { data: publicTemplate, error: publicError } = await supabase
          .from('projects')
          .select('*')
          .eq('slug', template.slug)
          .eq('template_type', 'simp')
          .eq('is_published', true)
          .single()

        info.checks.push({
          name: 'Public Access',
          status: publicTemplate ? 'success' : 'failed',
          data: { shareUrl: `${window.location.origin}/v/${template.slug}` },
          error: publicError?.message
        })
      }
    }

    setDebugInfo(info)
  }

  useEffect(() => {
    if (isOpen && !debugInfo) {
      runDebug()
    }
  }, [isOpen])

  if (process.env.NODE_ENV === 'production') return null

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors z-50 text-sm font-mono"
      >
        🐛 Debug
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="sticky top-0 bg-gray-800 text-white p-4 flex justify-between items-center">
              <h2 className="text-lg font-bold font-mono">🐛 Debug Panel</h2>
              <div className="flex gap-2">
                <button
                  onClick={runDebug}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                >
                  Refresh
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="p-4">
              {!debugInfo ? (
                <div className="text-center py-8 text-gray-500">
                  Loading debug info...
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-xs text-gray-500 font-mono">
                    {debugInfo.timestamp}
                  </div>

                  {debugInfo.checks.map((check: any, idx: number) => (
                    <div
                      key={idx}
                      className={`border-l-4 p-4 rounded ${
                        check.status === 'success'
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-gray-800">
                          {check.status === 'success' ? '✅' : '❌'} {check.name}
                        </h3>
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded ${
                            check.status === 'success'
                              ? 'bg-green-200 text-green-800'
                              : 'bg-red-200 text-red-800'
                          }`}
                        >
                          {check.status}
                        </span>
                      </div>

                      {check.normalizedEmail && (
                        <div className="text-sm mb-2">
                          <span className="font-semibold">Email:</span>{' '}
                          <code className="bg-gray-200 px-2 py-1 rounded">
                            {check.normalizedEmail}
                          </code>
                        </div>
                      )}

                      {check.error && (
                        <div className="text-sm text-red-700 mb-2 font-mono bg-red-100 p-2 rounded">
                          Error: {check.error}
                        </div>
                      )}

                      {check.data && (
                        <details className="text-sm">
                          <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                            View Data
                          </summary>
                          <pre className="mt-2 bg-gray-100 p-2 rounded overflow-auto text-xs">
                            {JSON.stringify(check.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
