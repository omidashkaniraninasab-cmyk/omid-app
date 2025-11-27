'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Header() {
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      window.location.href = '/'
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  if (loading) {
    return (
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                Omid App
              </Link>
            </div>
            <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              Omid App
            </Link>
          </div>

          <nav className="flex items-center space-x-4">
           {user ? (
  <div className="flex items-center gap-4">
    <div className="text-right">
      <p className="text-sm text-slate-700">
        خوش آمدید،
      </p>
      <p className="text-sm font-semibold text-slate-900">
        {user.email}
      </p>
    </div>
    
    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
      <span className="text-white text-xs font-bold">
        {user.email.charAt(0).toUpperCase()}
      </span>
    </div>
    
    <Link 
      href="/dashboard"
      className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl shadow-emerald-500/25"
    >
      داشبورد
    </Link>
    
    <button
      onClick={handleLogout}
      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-300"
    >
      خروج
    </button>
  </div>
) : (
              <div className="flex items-center space-x-4">
                {pathname !== '/auth' && (
                  <Link 
                    href="/auth" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
                  >
                    ورود / ثبت نام
                  </Link>
                )}
                {pathname === '/auth' && (
                  <Link 
                    href="/" 
                    className="text-gray-600 hover:text-gray-900 font-medium transition duration-200"
                  >
                    بازگشت به صفحه اصلی
                  </Link>
                )}
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}