'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Home() {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
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
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6">FlowAI Hub</h1>
        <p className="text-xl mb-12">
          Turn Zoom meetings into approved tasks — inside Slack, with hybrid AI oversight.
        </p>

        {!session ? (
          <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Get Started</h2>
            
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 border rounded-lg"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-6 border rounded-lg"
            />

            <div className="flex gap-4 justify-center">
              <button
                onClick={signUp}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Sign Up
              </button>
              <button
                onClick={signIn}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Sign In
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-white p-10 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6">Welcome back!</h2>
            <p className="text-lg mb-8">Logged in as: {session?.user?.email || 'User'}</p>

            <button 
              onClick={signOut}
              className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 mb-8"
            >
              Sign Out
            </button>

            <div className="text-left">
  <h3 className="text-2xl font-semibold mb-4">Next steps</h3>
  <div className="space-y-4">
    <button 
      onClick={() => alert('Slack OAuth coming soon – will open popup')}
      className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
    >
      Connect Slack
    </button>
    <button 
      onClick={() => alert('Zoom OAuth coming soon – will open popup')}
      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
    >
      Connect Zoom
    </button>
  </div>
  <p className="mt-6 text-sm text-gray-600">
    Once connected, run a test Zoom meeting → watch tasks appear in Slack with Approve button.
  </p>
</div>
          </div>
        )}
      </div>
    </div>
  )
}
