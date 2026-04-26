import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkRPC() {
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: 'SELECT 1' })
  if (error) {
    console.log('RPC exec_sql não existe ou falhou:', error.message)
  } else {
    console.log('RPC exec_sql existe!')
  }
}

checkRPC()
