'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function Home() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Handle URL query params (Slack/Zoom success/error)
  useEffect(() => {
    const slackStatus = searchParams.get('slack')
    const zoomStatus = searchParams.get('zoom')

    if (slackStatus === 'connected') {
      setSuccessMsg('Slack connected successfully!')
      router.replace('/', { scroll: false }) // Clean URL
    } else if (slackStatus === 'error') {
      setErrorMsg('Failed to connect Slack. Please try again.')
      router.replace('/', { scroll: false })
    }

    if (zoomStatus === 'connected') {
      setSuccessMsg('Zoom connected successfully!')
      router.replace('/', { scroll: false })
    } else if (zoomStatus === 'error') {
      setErrorMsg('Failed to connect Zoom. Please try again.')
      router.replace('/', { scroll: false })
    }
  }, [searchParams, router])

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  const signUp = async () => {
    setLoading(true)
    setErrorMsg('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setErrorMsg(error.message)
    } else {
      setSuccessMsg('Check your email for confirmation!')
    }
    setLoading(false)
  }

  const signIn = async () => {
    setLoading(true)
    setErrorMsg('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setErrorMsg(error.message)
    }
    setLoading(false)
  }

  const signOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tight text-white">
            FlowAI Hub
          </div>
          {session && (
            <button
              onClick={signOut}
              disabled={loading}
              className="px-5 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              Sign Out
            </button>
          )}
        </div>
      </header>
      <Suspense fallback={<div className="h-10" />}>
        {useSearchParams().get('slack') === 'connected' && (
          <div className="mb-8 p-4 bg-green-900 border border-green-700 rounded-lg text-green-300">
            Slack connected successfully!
          </div>
        )}
      </Suspense>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-16 px-6">
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            FlowAI Hub
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto">
            Turn Zoom meetings into approved tasks — inside Slack, with hybrid AI oversight.
          </p>

          {/* Success / Error Messages */}
          {successMsg && (
            <div className="mb-8 p-4 bg-green-900/50 border border-green-700 rounded-xl text-green-300">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="mb-8 p-4 bg-red-900/50 border border-red-700 rounded-xl text-red-300">
              {errorMsg}
            </div>
          )}

          {!session ? (
            /* Login / Signup Form */
            <div className="max-w-md mx-auto bg-gray-900 p-10 rounded-2xl shadow-2xl border border-gray-800">
              <h2 className="text-3xl font-semibold mb-8 text-white">Get Started</h2>

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 mb-5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 mb-8 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={signUp}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sign Up
                </button>
                <button
                  onClick={signIn}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sign In
                </button>
              </div>
            </div>
          ) : (
            /* Logged-in Dashboard */
            <div className="max-w-3xl mx-auto bg-gray-900 p-12 rounded-2xl shadow-2xl border border-gray-800">
              <h2 className="text-4xl font-bold mb-6 text-white">
                Welcome back!
              </h2>
              <p className="text-xl mb-10 text-gray-300">
                Logged in as <span className="text-blue-400 font-medium">{session?.user?.email}</span>
              </p>

              <div className="text-left">
                <h3 className="text-2xl font-semibold mb-6 text-white">Next steps</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <a
                    href={`https://slack.com/oauth/v2/authorize?client_id=10490775030869.10497112809173&scope=chat:write,channels:read,users:read&redirect_uri=${encodeURIComponent('https://flowai-hub.vercel.app/api/slack-callback')}`}
                    className="block bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-xl font-medium text-center transition shadow-lg"
                  >
                    Connect Slack
                  </a>
                  <a
                    href={`https://zoom.us/oauth/authorize?response_type=code&client_id=c4cvH4S_TpSXe6FPcBQikQ&redirect_uri=${encodeURIComponent('https://flowai-hub.vercel.app/api/zoom-callback')}`}
                    className="block bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-xl font-medium text-center transition shadow-lg"
                  >
                    Connect Zoom
                  </a>
                </div>

                <p className="text-gray-400 text-sm">
                  Once connected, run a test Zoom meeting and watch tasks appear in Slack with the Approve button.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
        <p>© 2026 FlowAI Hub. Built with KINSO.</p>
      </footer>
    </div>
  )
}