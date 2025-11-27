import { supabase } from '../../lib/supabase'

export async function GET() {
  try {
    // تست اتصال و خواندن از جدول
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(5)

    if (error) {
      return Response.json({
        success: false,
        error: error.message,
        details: 'خطا در خواندن از جدول'
      }, { status: 500 })
    }

    return Response.json({
      success: true,
      message: 'جدول users با موفقیت ایجاد شده',
      usersCount: data.length,
      users: data
    })

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
      details: 'خطا در اتصال به دیتابیس'
    }, { status: 500 })
  }
}