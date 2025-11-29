// components/games/crossword/CrosswordHistory.jsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function CrosswordHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

useEffect(() => {
  console.log('🔔 CrosswordHistory mount شد')
  loadHistory()

  const handleHistoryUpdated = () => {
    console.log('🎯 event historyUpdated دریافت شد - ریلود تاریخچه')
    loadHistory()
  }

  window.addEventListener('historyUpdated', handleHistoryUpdated)
  
  return () => {
    console.log('🔕 CrosswordHistory unmount شد')
    window.removeEventListener('historyUpdated', handleHistoryUpdated)
  }
}, [])

// در CrosswordHistory.jsx
const loadHistory = async () => {
  try {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('crossword_history')
      .select('*')
      .eq('user_id', user.id)
      .eq('puzzle_date', today)
      .order('completed_at', { ascending: false })

    if (error) {
      console.error('Error loading history:', error)
      return
    }

    console.log('📝 تاریخچه امروز:', data)
    setHistory(data || [])

  } catch (error) {
    console.error('Error:', error)
  } finally {
    setLoading(false)
  }
}

const testCompleteFlow = async () => {
  console.log('🔄 شروع تست کامل جریان')
  
  // 1. تست INSERT
  await testSaveToHistory()
  
  // 2. صبر کن سپس دستی ریلود کن
  setTimeout(() => {
    console.log('🔄 ریلود دستی تاریخچه')
    loadHistory()
  }, 2000)
  
  // 3. event هم بفرست
  setTimeout(() => {
    console.log('📢 ارسال event historyUpdated')
    window.dispatchEvent(new CustomEvent('historyUpdated'))
  }, 3000)
}

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins} دقیقه و ${secs} ثانیه`
  }

  const getDifficultyBadge = (difficulty) => {
    const styles = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    }
    
    const labels = {
      easy: 'آسان',
      medium: 'متوسط', 
      hard: 'سخت'
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[difficulty] || 'bg-gray-100 text-gray-800'}`}>
        {labels[difficulty] || difficulty}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">📝 تاریخچه بازی‌ها</h3>
          <p className="text-gray-600 mt-1">مرور بازی‌های انجام شده</p>
        </div>
        
        {history.length > 0 && (
          <div className="text-sm text-gray-500">
            {history.length} بازی
          </div>
        )}
      </div>

      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎮</div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">هنوز بازی‌ای انجام نداده‌اید!</h4>
            <p className="text-gray-600 mb-4">اولین بازی خود را شروع کنید تا تاریخچه شما اینجا نمایش داده شود</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              شروع بازی
            </button>
          </div>
        ) : (
          history.map((game) => (
            <div 
              key={game.id}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">
                      پازل {formatDate(game.completed_at)}
                    </h4>
                    {getDifficultyBadge(game.difficulty)}
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <span>📅</span>
                      <span>{formatDate(game.completed_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>⏱️</span>
                      <span>{formatTime(game.solve_time || 0)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🎯</span>
                      <span>{game.accuracy || 0}% دقت</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 sm:mt-0 text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {game.score}
                    <span className="text-sm font-normal text-gray-500"> امتیاز</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {game.words_found || 0}/{game.total_words || 0} کلمات
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}