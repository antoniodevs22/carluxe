import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkSchema() {
  const { data, error } = await supabase.from('clients').select().limit(1)
  if (error) console.error(error)
  else console.log('Colunas de clients:', Object.keys(data[0] || {}))

  const { data: v } = await supabase.from('vehicles').select().limit(1)
  if (v) console.log('Colunas de vehicles:', Object.keys(v[0] || {}))
  
  const { data: o } = await supabase.from('ordens_servico').select().limit(1)
  if (o) console.log('Colunas de ordens_servico:', Object.keys(o[0] || {}))
}

checkSchema()
