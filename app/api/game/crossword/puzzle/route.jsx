// app/api/game/crossword/puzzle/route.js
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request) {
  try {
    console.log('🚀 شروع API دریافت پازل روزانه')
    
    // استفاده از تاریخ امروز - درست شده
    const today = new Date().toISOString().split('T')[0]
    console.log('📅 جستجوی پازل برای تاریخ امروز:', today)

    const { data: puzzles, error } = await supabase
      .from('crossword_daily_puzzles')
      .select('*')
      .eq('puzzle_date', today)
      .limit(1)

    console.log('📊 نتایج جستجو:', {
      count: puzzles?.length,
      error: error?.message,
      foundPuzzle: puzzles?.[0]?.title
    })

    if (error) {
      console.error('❌ خطای Supabase:', error)
      return NextResponse.json(
        { error: 'خطا در ارتباط با دیتابیس' },
        { status: 500 }
      )
    }

    if (!puzzles || puzzles.length === 0) {
      console.log('⚠️ پازل برای امروز یافت نشد')
      return NextResponse.json(
        { error: 'پازلی برای امروز موجود نیست' },
        { status: 404 }
      )
    }

    const todayPuzzle = puzzles[0]
    console.log('✅ پازل امروز دریافت شد:', todayPuzzle.title)
    
    return NextResponse.json(todayPuzzle)

  } catch (error) {
    console.error('💥 خطای غیرمنتظره:', error)
    return NextResponse.json(
      { error: 'خطای سرور داخلی' },
      { status: 500 }
    )
  }
}