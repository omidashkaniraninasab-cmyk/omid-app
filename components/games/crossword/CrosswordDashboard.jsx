'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function CrosswordDashboard({ userScores, dailyPuzzle, onPlay, onViewLeaderboard, onViewHistory }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* کارت بازی روزانه */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">جدول روزانه</h2>
                <p className="text-gray-600 mt-1">چالش کلمات امروز</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
            </div>

            {dailyPuzzle ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🧩</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{dailyPuzzle.title}</h3>
                <p className="text-gray-600 mb-4">سطح: {dailyPuzzle.difficulty}</p>
                <p className="text-gray-500 text-sm mb-6">{dailyPuzzle.total_words} کلمه</p>
                
                <button
                  onClick={onPlay}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl inline-block"
                >
                  شروع بازی
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-gray-400">⏰</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">جدول امروز آماده نیست</h3>
                <p className="text-gray-600">جدول روزانه جدید به زودی منتشر می‌شود</p>
              </div>
            )}
          </div>
        </div>

        {/* کارت آمار کاربر */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">آمار شما</h3>
            
            {userScores ? (
              <div className="space-y-4">
                <StatCard 
                  label="امتیاز کلی" 
                  value={userScores.total_score} 
                  icon="🏆" 
                  color="yellow"
                />
                <StatCard 
                  label="امتیاز روزانه" 
                  value={userScores.daily_score} 
                  icon="📊" 
                  color="blue"
                />
                <StatCard 
                  label="تعداد بازی‌ها" 
                  value={userScores.total_games_played} 
                  icon="🎮" 
                  color="green"
                />
                <StatCard 
                  label="سطح" 
                  value={userScores.level} 
                  icon="⭐" 
                  color="purple"
                />
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">هنوز بازی نکرده‌اید</p>
                <button
                  onClick={onPlay}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
                >
                  شروع اولین بازی
                </button>
              </div>
            )}
          </div>

          {/* منوی سریع */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">منوی بازی</h3>
            <div className="space-y-3">
              <button
                onClick={onPlay}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors text-right"
              >
                <span className="text-xl">🎮</span>
                <span className="font-medium">شروع بازی جدید</span>
              </button>
              <button
                onClick={onViewLeaderboard}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors text-right"
              >
                <span className="text-xl">🏆</span>
                <span className="font-medium">جدول امتیازات</span>
              </button>
              <button
                onClick={onViewHistory}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors text-right"
              >
                <span className="text-xl">📋</span>
                <span className="font-medium">تاریخچه بازی‌ها</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// کامپوننت کارت آمار
function StatCard({ label, value, icon, color }) {
  const colorClasses = {
    yellow: 'bg-yellow-100 border-yellow-200',
    blue: 'bg-blue-100 border-blue-200',
    green: 'bg-green-100 border-green-200',
    purple: 'bg-purple-100 border-purple-200'
  }

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border-2 ${colorClasses[color]}`}>
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <span className="font-medium text-gray-700">{label}</span>
      </div>
      <span className="font-bold text-gray-900 text-lg">{value}</span>
    </div>
  )
}