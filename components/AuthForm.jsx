'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthForm({ view, onViewChange }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const router = useRouter()

  // فانکشن برای ایجاد پروفایل کاربر
const createUserProfile = async (user) => {
  try {
    console.log('🔄 در حال ایجاد پروفایل کاربر...', user.id);

    // ایجاد پروفایل
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: user.id,
          email: user.email,
          username: user.email.split('@')[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);

    if (profileError) {
      console.error('❌ خطا در ایجاد پروفایل:', profileError);
      throw profileError;
    }

    // ایجاد تنظیمات
    const { error: settingsError } = await supabase
      .from('user_settings')
      .insert([
        {
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);

    if (settingsError) {
      console.error('❌ خطا در ایجاد تنظیمات:', settingsError);
      throw settingsError;
    }

    // ایجاد لاگ فعالیت
    const { error: activityError } = await supabase
      .from('user_activities')
      .insert([
        {
          user_id: user.id,
          activity_type: 'user_registered',
          description: 'ثبت نام کاربر جدید',
          created_at: new Date().toISOString()
        }
      ]);

    if (activityError) {
      console.error('❌ خطا در ایجاد لاگ فعالیت:', activityError);
    }

    console.log('✅ پروفایل کاربر با موفقیت ایجاد شد');
    
  } catch (error) {
    console.error('❌ خطا در ایجاد پروفایل:', error);
  }
}

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      if (view === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        
        if (error) throw error
        
        setMessage({
          type: 'success',
          text: 'ثبت‌نام موفقیت‌آمیز بود! لطفا ایمیل خود را بررسی کنید.'
        })
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) throw error
        
        // ورود موفقیت‌آمیز - کاربر به داشبورد ریدایرکت می‌شود
        router.push('/dashboard')
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
        {view === 'register' ? 'ثبت نام' : 'ورود'}
      </h2>

      {message.text && (
        <div className={`p-3 rounded-lg mb-4 ${
          message.type === 'error' 
            ? 'bg-red-100 text-red-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            ایمیل
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="example@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            رمز عبور
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg font-medium transition duration-200"
        >
          {loading ? 'در حال پردازش...' : view === 'register' ? 'ثبت نام' : 'ورود'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={() => onViewChange(view === 'register' ? 'login' : 'register')}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          {view === 'register' 
            ? 'قبلا ثبت‌نام کرده‌اید؟ وارد شوید' 
            : 'حساب کاربری ندارید؟ ثبت‌نام کنید'}
        </button>
      </div>
    </div>
  )
}