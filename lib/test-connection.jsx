'use client'

import { supabase } from '@/lib/supabase'

export async function testConnection() {
  try {
    console.log('🔗 تست اتصال به سوپابیس...')
    
    // تست اتصال پایه
    const { data, error } = await supabase.from('profiles').select('count').limit(1)
    
    if (error) {
      console.error('❌ خطا در اتصال:', error)
      return { success: false, error }
    }
    
    console.log('✅ اتصال موفقیت‌آمیز بود!')
    return { success: true, data }
    
  } catch (error) {
    console.error('❌ خطای غیرمنتظره:', error)
    return { success: false, error }
  }
}

export async function testAuth() {
  try {
    console.log('🔑 تست سیستم احراز هویت...')
    
    // تست دریافت session فعلی
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('❌ خطا در احراز هویت:', error)
      return { success: false, error }
    }
    
    console.log('✅ سیستم احراز هویت فعال است')
    return { success: true, session }
    
  } catch (error) {
    console.error('❌ خطای غیرمنتظره در احراز هویت:', error)
    return { success: false, error }
  }
}