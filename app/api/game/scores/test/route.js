// app/api/game/scores/test/route.js
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('🧪 تست دریافت داده از دیتابیس...')

    const { data, error } = await supabase
      .from('crossword_scores')
      .select('*')
      .order('created_at', { ascending: false })

    console.log('📊 داده‌های دریافتی:', data)
    console.log('❌ خطا (اگر هست):', error)

    if (error) {
      throw new Error(`خطای دیتابیس: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      message: 'داده‌ها با موفقیت دریافت شدند',
      count: data.length,
      data: data
    })

  } catch (error) {
    console.error('❌ خطا:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'خطا در دریافت داده',
        message: error.message
      },
      { status: 500 }
    )
  }
}