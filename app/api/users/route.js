import { supabase } from '@/lib/supabase'

// GET - دریافت همه کاربران
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return Response.json({
      success: true,
      users: data,
      count: data.length
    })

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

// POST - ایجاد کاربر جدید
export async function POST(request) {
  try {
    const userData = await request.json()

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          username: userData.username,
          email: userData.email,
          display_name: userData.display_name,
          password_hash: userData.password_hash, // در واقعیت باید hash بشه
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone_number: userData.phone_number
        }
      ])
      .select()
      .single()

    if (error) throw error

    return Response.json({
      success: true,
      message: 'کاربر با موفقیت ایجاد شد',
      user: data
    }, { status: 201 })

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}