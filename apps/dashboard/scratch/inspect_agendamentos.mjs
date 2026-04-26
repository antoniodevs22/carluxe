import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

async function inspectTable() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  const { data, error } = await supabase
    .from('agendamentos')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Erro ao inspecionar agendamentos:', error.message)
  } else {
    console.log('Exemplo de dado em "agendamentos":', data)
  }

  const { data: appData, error: appError } = await supabase
    .from('appointments')
    .select('*')
    .limit(1)

  if (appError) {
    console.log('Erro ao inspecionar appointments:', appError.message)
  } else {
    console.log('Exemplo de dado em "appointments":', appData)
  }
}

inspectTable()
