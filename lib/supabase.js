import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

// چک کن که environment variables ست شده باشن
if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Supabase environment variables missing')
}

export const supabase = createClient(supabaseUrl, supabaseKey)