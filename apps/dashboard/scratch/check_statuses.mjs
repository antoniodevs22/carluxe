import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkStatuses() {
  const { data, error } = await supabase
    .from('ordens_servico')
    .select('status')

  if (error) {
    console.error('Erro:', error.message)
  } else {
    const statuses = [...new Set(data.map(d => d.status))]
    console.log('Status encontrados em ordens_servico:', statuses)
  }
}

checkStatuses()
