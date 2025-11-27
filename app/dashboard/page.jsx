'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Dashboard from '@/components/Dashboard'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null)
        if (!session?.user) {
          router.push('/auth')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      if (!session?.user) {
        router.push('/auth')
      }
    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/auth')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/')
    } catch (error) {
      console.error('Error logging out:', error)
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

  if (!user) {
    return null // کاربر به صفحه احراز هویت ریدایرکت می‌شود
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* هدر */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">Omid App</h1>
            </div>

            <nav className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  خوش آمدید، {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
                >
                  خروج
                </button>
                <a 
                  href="/"
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  صفحه اصلی
                </a>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* محتوای داشبورد */}
      <main className="container mx-auto px-4 py-8">
        <Dashboard user={user} />
      </main>
    </div>
  )
}