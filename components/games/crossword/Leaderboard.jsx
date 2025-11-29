// components/games/crossword/Leaderboard.jsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Leaderboard() {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('daily')
  const [difficulty, setDifficulty] = useState('all')
  const [userRank, setUserRank] = useState(null)

  useEffect(() => {
    loadLeaderboard()
    loadUserRank()
  }, [timeRange, difficulty])

  const loadLeaderboard = async () => {
    try {
      setLoading(true)
      
      // ساخت کوئری پایه برای leaderboard
      let query = supabase
        .from('crossword_leaderboard')
        .select(`
          id,
          score,
          time_taken,
          completed_at,
          difficulty,
          correct_answers,
          total_answers,
          user_id
        `)
        .order('score', { ascending: false })
        .limit(100)

      // فیلتر زمان
      if (timeRange === 'daily') {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        query = query.gte('completed_at', today.toISOString())
      } else if (timeRange === 'weekly') {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        query = query.gte('completed_at', weekAgo.toISOString())
      }

      // فیلتر سطح دشواری
      if (difficulty !== 'all') {
        query = query.eq('difficulty', difficulty)
      }

      const { data: leaderboardData, error } = await query

      if (error) {
        console.error('Error loading leaderboard:', error)
        return
      }

      // اگر داده‌ای وجود داره، اطلاعات کاربران رو بگیر
      if (leaderboardData && leaderboardData.length > 0) {
        const userIds = [...new Set(leaderboardData.map(score => score.user_id))]
        
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .in('id', userIds)

        // ترکیب داده‌ها
        const scoresWithProfiles = leaderboardData.map(score => {
          const userProfile = profilesData?.find(profile => profile.id === score.user_id) || {}
          return {
            ...score,
            profile: userProfile // تغییر از profiles به profile برای سادگی
          }
        })

        setScores(scoresWithProfiles)
      } else {
        setScores([])
      }

    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserRank = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // گرفتن بالاترین امتیاز کاربر
      const { data: userScores } = await supabase
        .from('crossword_leaderboard')
        .select('score')
        .eq('user_id', user.id)
        .order('score', { ascending: false })
        .limit(1)

      if (userScores && userScores.length > 0) {
        const userBestScore = userScores[0].score

        // پیدا کردن رتبه کاربر بین همه امتیازات
        const { data: allScores } = await supabase
          .from('crossword_leaderboard')
          .select('score')
          .order('score', { ascending: false })

        if (allScores) {
          const rank = allScores.findIndex(score => score.score === userBestScore) + 1
          setUserRank(rank)
        }
      }
    } catch (error) {
      console.error('Error loading user rank:', error)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getAccuracy = (correct, total) => {
    if (!total || total === 0) return 0
    return Math.round((correct / total) * 100)
  }

  const getRankBadge = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `#${index + 1}`
  }

  const getRankColor = (index) => {
    if (index === 0) return 'from-yellow-400 to-yellow-600'
    if (index === 1) return 'from-gray-400 to-gray-600'
    if (index === 2) return 'from-orange-400 to-orange-600'
    return 'from-blue-400 to-blue-600'
  }

  const getUserDisplayName = (profile) => {
    // اول full_name رو چک کن، اگر نبود username
    return profile?.full_name || profile?.username || 'کاربر ناشناس'
  }

  const getUserAvatar = (profile) => {
    // اگر avatar_url داره ازش استفاده کن، در غیر این صورت از حرف اول نام
    if (profile?.avatar_url) {
      return (
        <img 
          src={profile.avatar_url} 
          alt="Avatar"
          className="w-10 h-10 rounded-full border-2 border-white shadow"
        />
      )
    }
    
    // آواتار پیش‌فرض با حرف اول
    const displayName = getUserDisplayName(profile)
    const firstChar = displayName.charAt(0)
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold border-2 border-white shadow">
        {firstChar}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      {/* هدر */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">🏆 لیست برترین‌ها</h3>
          <p className="text-gray-600 mt-1">مقایسه امتیازات با سایر بازیکنان</p>
        </div>

        {userRank && (
          <div className="mt-3 sm:mt-0 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg">
            <div className="text-sm">رتبه شما</div>
            <div className="text-xl font-bold">#{userRank}</div>
          </div>
        )}
      </div>

      {/* فیلترها */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            بازه زمانی
          </label>
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="daily">امروز</option>
            <option value="weekly">هفته جاری</option>
            <option value="all-time">همه زمان‌ها</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            سطح دشواری
          </label>
          <select 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">همه سطوح</option>
            <option value="easy">آسان</option>
            <option value="medium">متوسط</option>
            <option value="hard">سخت</option>
          </select>
        </div>
      </div>

      {/* لیست امتیازات */}
      <div className="space-y-3">
        {scores.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">😴</div>
            <p className="text-gray-500">هنوز امتیازی ثبت نشده است!</p>
            <p className="text-sm text-gray-400 mt-1">اولین نفری باشید که بازی می‌کند</p>
          </div>
        ) : (
          scores.map((score, index) => (
            <div 
              key={score.id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                index < 3 
                  ? 'border-yellow-200 bg-gradient-to-r ' + getRankColor(index) + ' text-white shadow-lg' 
                  : 'border-gray-200 bg-white hover:bg-gray-50 hover:shadow-md'
              }`}
            >
              {/* سمت چپ - اطلاعات کاربر و رتبه */}
              <div className="flex items-center gap-4 flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  index < 3 ? 'bg-white bg-opacity-20' : 'bg-blue-100 text-blue-600'
                } font-bold text-lg`}>
                  {getRankBadge(index)}
                </div>

                <div className="flex items-center gap-3">
                  {getUserAvatar(score.profile)}
                  <div>
                    <div className={`font-semibold ${index < 3 ? 'text-white' : 'text-gray-900'}`}>
                      {getUserDisplayName(score.profile)}
                    </div>
                    <div className={`text-sm ${index < 3 ? 'text-white text-opacity-80' : 'text-gray-500'}`}>
                      {score.difficulty === 'easy' ? 'آسان' : 
                       score.difficulty === 'medium' ? 'متوسط' : 'سخت'}
                    </div>
                  </div>
                </div>
              </div>

              {/* سمت راست - آمار */}
              <div className="text-right">
                <div className={`text-xl font-bold ${index < 3 ? 'text-white' : 'text-green-600'}`}>
                  {score.score.toLocaleString()} امتیاز
                </div>
                <div className={`text-sm ${index < 3 ? 'text-white text-opacity-80' : 'text-gray-500'}`}>
                  <div>⏱️ {formatTime(score.time_taken)}</div>
                  <div>🎯 {getAccuracy(score.correct_answers, score.total_answers)}% دقت</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* پاورقی */}
      {scores.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            نمایش {scores.length} رکورد از ۱۰۰ رکورد برتر
          </div>
        </div>
      )}
    </div>
  )
}