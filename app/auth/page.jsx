'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AuthForm from '@/components/AuthForm'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authView, setAuthView] = useState('login')
  const router = useRouter()

  useEffect(() => {
    checkUser()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null)
        setLoading(false)
        if (session?.user) {
          router.push('/dashboard')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  const checkUser = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user || null)
    if (session?.user) {
      router.push('/dashboard') // اگر لاگین هست، به داشبورد برو
      return
    }
  } catch (error) {
    console.error('Error checking user:', error)
  } finally {
    setLoading(false)
  }
}

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <AuthForm view={authView} onViewChange={setAuthView} />
      </main>
    </div>
  )
}