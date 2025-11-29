// components/games/crossword/Statistics.jsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Statistics() {
  const [stats, setStats] = useState({})
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30days') // 7days, 30days, 90days

  useEffect(() => {
    loadStatistics()
  }, [timeRange])

  const loadStatistics = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // محاسبه تاریخ شروع بر اساس بازه انتخابی
      const startDate = new Date()
      if (timeRange === '7days') {
        startDate.setDate(startDate.getDate() - 7)
      } else if (timeRange === '30days') {
        startDate.setDate(startDate.getDate() - 30)
      } else if (timeRange === '90days') {
        startDate.setDate(startDate.getDate() - 90)
      }

      // دریافت آمار کاربر
      const { data: userStats } = await supabase
        .from('crossword_user_stats')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: true })

      // داده‌های نمودار
      if (userStats) {
        setChartData(userStats)
        
        // محاسبه آمار کلی
        const totalStats = userStats.reduce((acc, stat) => ({
          totalGames: acc.totalGames + stat.games_played,
          totalScore: acc.totalScore + stat.total_score,
          totalCorrect: acc.totalCorrect + stat.correct_answers,
          totalWrong: acc.totalWrong + stat.wrong_answers,
          bestStreak: Math.max(acc.bestStreak, stat.current_streak || 0),
          lastStreak: userStats[userStats.length - 1]?.current_streak || 0
        }), {
          totalGames: 0,
          totalScore: 0,
          totalCorrect: 0,
          totalWrong: 0,
          bestStreak: 0,
          lastStreak: 0
        })

        setStats(totalStats)
      }

    } catch (error) {
      console.error('Error loading statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateAccuracy = () => {
    if (stats.totalCorrect + stats.totalWrong === 0) return 0
    return Math.round((stats.totalCorrect / (stats.totalCorrect + stats.totalWrong)) * 100)
  }

  const getAverageScore = () => {
    if (stats.totalGames === 0) return 0
    return Math.round(stats.totalScore / stats.totalGames)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
          <div className="h-48 bg-gray-100 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">📊 آمار پیشرفت شما</h3>
          <p className="text-gray-600 mt-1">پیگیری عملکرد و بهبود مهارت‌ها</p>
        </div>

        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          className="mt-3 sm:mt-0 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="7days">۷ روز گذشته</option>
          <option value="30days">۳۰ روز گذشته</option>
          <option value="90days">۹۰ روز گذشته</option>
        </select>
      </div>

      {/* کارت‌های آمار */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100">
          <div className="text-2xl font-bold text-blue-600">{stats.totalGames}</div>
          <div className="text-sm text-blue-800 mt-1">بازی انجام شده</div>
          <div className="text-xs text-blue-600 mt-1">📈</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-xl text-center border border-green-100">
          <div className="text-2xl font-bold text-green-600">{getAverageScore()}</div>
          <div className="text-sm text-green-800 mt-1">میانگین امتیاز</div>
          <div className="text-xs text-green-600 mt-1">🎯</div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-xl text-center border border-purple-100">
          <div className="text-2xl font-bold text-purple-600">{calculateAccuracy()}%</div>
          <div className="text-sm text-purple-800 mt-1">میانگین دقت</div>
          <div className="text-xs text-purple-600 mt-1">🎯</div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-xl text-center border border-orange-100">
          <div className="text-2xl font-bold text-orange-600">{stats.bestStreak}</div>
          <div className="text-sm text-orange-800 mt-1">رکورد روزهای پشت‌سرهم</div>
          <div className="text-xs text-orange-600 mt-1">🔥</div>
        </div>
      </div>

      {/* نمودار ساده امتیازات */}
      <div className="border-t pt-6">
        <h4 className="font-semibold mb-4 text-gray-900">📈 نمودار امتیازات روزانه</h4>
        
        {chartData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <p>داده‌ای برای نمایش وجود ندارد</p>
            <p className="text-sm mt-1">بازی کنید تا آمار شما ثبت شود</p>
          </div>
        ) : (
          <div className="h-48 flex items-end justify-between gap-1 bg-gray-50 rounded-lg p-4">
            {chartData.map((day, index) => {
              const maxScore = Math.max(...chartData.map(d => d.total_score))
              const height = maxScore > 0 ? (day.total_score / maxScore) * 100 : 0
              
              return (
                <div key={day.id} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-green-500 to-green-600 rounded-t transition-all duration-300 hover:from-green-600 hover:to-green-700 cursor-pointer"
                    style={{ height: `${height}%` }}
                    title={`${new Date(day.date).toLocaleDateString('fa-IR')}: ${day.total_score} امتیاز`}
                  ></div>
                  <div className="text-xs mt-2 text-gray-600 text-center">
                    {new Date(day.date).toLocaleDateString('fa-IR', { 
                      month: 'numeric', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* آمار جزئی‌تر */}
      {chartData.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-semibold mb-2">🎯 دقت پاسخ‌ها</h5>
            <div className="flex justify-between">
              <span className="text-green-600">پاسخ‌های درست:</span>
              <span className="font-bold">{stats.totalCorrect}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-600">پاسخ‌های اشتباه:</span>
              <span className="font-bold">{stats.totalWrong}</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-semibold mb-2">⚡ عملکرد کلی</h5>
            <div className="flex justify-between">
              <span>امتیاز کل:</span>
              <span className="font-bold">{stats.totalScore}</span>
            </div>
            <div className="flex justify-between">
              <span>روز فعلی پشت‌سرهم:</span>
              <span className="font-bold">{stats.lastStreak}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}