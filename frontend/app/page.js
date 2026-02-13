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

  // Handle Slack/Zoom connection status from URL
  useEffect(() => {
    const slack = searchParams.get('slack')
    const zoom = searchParams.get('zoom')

    if (slack === 'connected') {
      alert('Slack connected successfully!')
      router.replace('/', { scroll: false })
    } else if (slack === 'error') {
      setErrorMsg('Failed to connect Slack')
      router.replace('/', { scroll: false })
    }

    if (zoom === 'connected') {
      alert('Zoom connected successfully!')
      router.replace('/', { scroll: false })
    } else if (zoom === 'error') {
      setErrorMsg('Failed to connect Zoom')
      router.replace('/', { scroll: false })
    }
  }, [searchParams, router])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => listener?.subscription.unsubscribe()
  }, [])

  const signUp = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) alert(error.message)
    else alert('Check your email for confirmation!')
    setLoading(false)
  }

  const signIn = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    setLoading(false)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 py-16 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6 text-white">FlowAI Hub</h1>
        <p className="text-xl mb-12 text-gray-300">
          Turn Zoom meetings into approved tasks — inside Slack, with hybrid AI oversight.
        </p>

        {/* Success message - wrapped in Suspense */}
        <Suspense fallback={<div className="h-12" />}>
          {searchParams.get('slack') === 'connected' && (
            <div className="mb-8 p-4 bg-green-900 border border-green-700 rounded-lg text-green-300">
              Slack connected successfully!
            </div>
          )}
          {searchParams.get('zoom') === 'connected' && (
            <div className="mb-8 p-4 bg-green-900 border border-green-700 rounded-lg text-green-300">
              Zoom connected successfully!
            </div>
          )}
        </Suspense>

        {!session ? (
          <div className="max-w-md mx-auto bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-800">
            <h2 className="text-2xl font-semibold mb-6 text-white">Get Started</h2>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-6 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />

            <div className="flex gap-4 justify-center">
              <button
                onClick={signUp}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                Sign Up
              </button>
              <button
                onClick={signIn}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-gray-900 p-10 rounded-xl shadow-2xl border border-gray-800">
            <h2 className="text-3xl font-bold mb-6 text-white">Welcome back!</h2>
            <p className="text-lg mb-8 text-gray-300">
              Logged in as: <span className="text-blue-400">{session?.user?.email || 'User'}</span>
            </p>

            <button 
              onClick={signOut}
              className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 mb-8 transition-colors w-full"
            >
              Sign Out
            </button>

            <div className="text-left">
              <h3 className="text-2xl font-semibold mb-4 text-white">Next steps</h3>
              <div className="space-y-4">
                <a
                  href={`https://slack.com/oauth/v2/authorize?client_id=10490775030869.10497112809173&scope=chat:write,channels:read,users:read&redirect_uri=${encodeURIComponent('https://flowai-hub.vercel.app/api/slack-callback')}`}
                  className="block w-full bg-indigo-600 text-white text-center py-3 rounded-lg hover:bg-indigo-700"
                >
                  Connect Slack
                </a>
                <a
                  href={`https://zoom.us/oauth/authorize?response_type=code&client_id=c4cvH4S_TpSXe6FPcBQikQ&redirect_uri=${encodeURIComponent('https://flowai-hub.vercel.app/api/zoom-callback')}`}
                  className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700"
                >
                  Connect Zoom
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}