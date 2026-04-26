import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function scan() {
  // Tentar descobrir tabelas via erro de query em tabela inexistente ou via RPC se existisse
  // Mas vamos tentar os nomes mais prováveis baseados no erro anterior
  const tables = ['clientes', 'vehicles', 'agendamentos', 'ordens_servico', 'insumos', 'services']
  
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select().limit(1)
    if (error) {
      console.log(`Tabela ${t}: Erro - ${error.message}`)
    } else {
      console.log(`Tabela ${t}: OK - Colunas: ${Object.keys(data[0] || {}).join(', ')}`)
    }
  }
}

scan()
