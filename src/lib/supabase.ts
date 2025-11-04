import { createClient } from '@supabase/supabase-js'

console.log('supabase.ts: Initializing Supabase client...')

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('supabase.ts: Supabase URL:', supabaseUrl)
console.log('supabase.ts: Supabase Anon Key exists:', !!supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('supabase.ts: Missing Supabase environment variables')
  throw new Error('Missing Supabase environment variables')
}

console.log('supabase.ts: Creating Supabase client...')
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
console.log('supabase.ts: Supabase client created successfully')