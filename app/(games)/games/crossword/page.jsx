// app/(games)/games/crossword/page.jsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import CrosswordGame from '@/components/games/crossword/CrosswordGame'
import Leaderboard from '@/components/games/crossword/Leaderboard'
import Statistics from '@/components/games/crossword/Statistics'
import CrosswordHistory from '@/components/games/crossword/CrosswordHistory'

export default function CrosswordPage() {
  const [loading, setLoading] = useState(true)
  const [todayPuzzle, setTodayPuzzle] = useState(null)

  useEffect(() => {
    loadTodayPuzzle()
  }, [])

  const loadTodayPuzzle = async () => {
    try {
      setLoading(true)
      console.log('🔄 در حال دریافت پازل...')

      const response = await fetch('/api/game/crossword/puzzle')
      
      if (!response.ok) {
        throw new Error(`خطای HTTP: ${response.status}`)
      }
      
      const puzzleData = await response.json()
      console.log('📥 داده دریافتی از API:', puzzleData)

      if (puzzleData.error) {
        console.log('❌ API خطا برگردوند:', puzzleData.error)
        setTodayPuzzle(null)
        return
      }

      if (puzzleData && puzzleData.puzzle_data) {
        console.log('✅ پازل دریافت شد:', puzzleData.title)
        setTodayPuzzle(puzzleData)
      } else {
        console.log('⚠️ داده پازل نامعتبر')
        setTodayPuzzle(null)
      }
      
    } catch (error) {
      console.error('❌ خطا در دریافت پازل:', error)
      setTodayPuzzle(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری بازی...</p>
        </div>
      </div>
    )
  }

  if (!todayPuzzle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12">
            <div className="text-6xl mb-6">😴</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              پازلی برای امروز موجود نیست
            </h3>
            <p className="text-gray-600 mb-8">
              امروز پازل جدیدی برای بازی وجود ندارد. لطفاً فردا مجدداً بررسی کنید.
            </p>
            <Link 
              href="/games"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
            >
              بازگشت به بازی‌ها
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/games"
              className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <span className="text-2xl">←</span>
              <div>
                <div className="font-semibold">بازگشت به لیست بازی‌ها</div>
                <div className="text-sm text-gray-500">همه بازی‌ها</div>
              </div>
            </Link>

            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">🧩 بازی کراسورد</h1>
              <p className="text-sm text-gray-500">چالش روزانه</p>
            </div>

            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <CrosswordGame 
          dailyPuzzle={todayPuzzle}
          onBack={() => window.history.back()}
        />

         <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
  <div className="space-y-6">
    <Statistics />
    <CrosswordHistory />
  </div>
  <div>
    <Leaderboard />
  </div>
</div>

      </main>
    </div>
  )
}