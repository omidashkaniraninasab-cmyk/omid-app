import { supabase } from '@/lib/supabase'

// تابع برای دریافت جدول امروز
export async function getTodayPuzzle() {
  try {
    const today = new Date().toISOString().split('T')[0] // تاریخ امروز به فرمت YYYY-MM-DD
    
    const { data, error } = await supabase
      .from('crossword_daily_puzzles')
      .select('*')
      .eq('puzzle_date', today)
      .eq('is_active', true)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching today puzzle:', error)
    return null
  }
}

// تابع برای دریافت جدول بر اساس تاریخ
export async function getPuzzleByDate(date) {
  try {
    const { data, error } = await supabase
      .from('crossword_daily_puzzles')
      .select('*')
      .eq('puzzle_date', date)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching puzzle by date:', error)
    return null
  }
}