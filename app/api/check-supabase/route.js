import { supabase } from '../../lib/supabase'

export async function GET() {
  try {
    // تست بسیار ساده - فقط چک کنیم supabase object درست ایجاد شده
    const testResult = await supabase.from('users').select('*').limit(1)
    
    return Response.json({
      success: true,
      message: 'Supabase client created successfully!',
      hasData: !!testResult.data,
      hasError: !!testResult.error
    })

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
      hint: 'Problem with supabase client creation'
    }, { status: 500 })
  }
}