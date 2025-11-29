'use client'

import { useState, useEffect } from 'react'
import { getTodayPuzzle } from '@/lib/games/crossword/dailyPuzzle'

export default function Home() {
  const [currentView, setCurrentView] = useState('home')
  const [todayPuzzle, setTodayPuzzle] = useState(null)
  const [loading, setLoading] = useState(false)

  // وقتی کاربر روی کراسورد کلیک کرد، جدول امروز رو بگیر
  const handleCrosswordClick = async () => {
    setLoading(true)
    try {
      const puzzle = await getTodayPuzzle()
      setTodayPuzzle(puzzle)
      setCurrentView('crossword')
    } catch (error) {
      console.error('Error loading puzzle:', error)
    } finally {
      setLoading(false)
    }
  }

  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Omid App</h1>
          
          <div className="space-y-4">
            <button
              onClick={handleCrosswordClick}
              disabled={loading}
              className="block w-64 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white py-3 rounded-lg font-medium transition-colors"
            >
              {loading ? 'در حال بارگذاری...' : '🧩 بازی کراسورد'}
            </button>
          </div>

          {/* نمایش تاریخ امروز */}
          <div className="mt-8 text-gray-600">
            امروز: {new Date().toLocaleDateString('fa-IR')}
          </div>
        </div>
      </div>
    )
  }

  if (currentView === 'crossword') {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <button 
          onClick={() => setCurrentView('home')}
          className="mb-4 text-blue-600 hover:text-blue-700"
        >
          ← بازگشت
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {todayPuzzle?.title || 'بازی کراسورد'}
        </h2>
        <p className="text-gray-600 mb-6">
          تاریخ: {todayPuzzle?.puzzle_date ? new Date(todayPuzzle.puzzle_date).toLocaleDateString('fa-IR') : 'امروز'}
        </p>
        
        {/* گرید ساده کراسورد */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {todayPuzzle ? (
            <div>
              <p className="text-green-600 mb-4">✅ جدول امروز با موفقیت بارگذاری شد</p>
              <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
                {Array.from({ length: 25 }).map((_, index) => (
                  <div 
                    key={index}
                    className="w-12 h-12 bg-white border-2 border-gray-300 flex items-center justify-center font-bold"
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
              <p className="text-center mt-4 text-gray-600">
                سطح: {todayPuzzle.difficulty}
              </p>
            </div>
          ) : (
            <p className="text-red-600">❌ جدول امروز یافت نشد</p>
          )}
        </div>
      </div>
    )
  }
}