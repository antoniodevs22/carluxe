import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

async function checkTables() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  const { data, error } = await supabase
    .rpc('get_tables') // I'll try this but it's unlikely to exist unless configured

  if (error) {
    // If RPC fails, try querying the information_schema directly if allowed
    const { data: tables, error: sqlError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')

    if (sqlError) {
      console.error('Erro ao listar tabelas:', sqlError.message)
      
      // Fallback: try to query potential tables
      const potentialTables = ['clients', 'vehicles', 'appointments', 'agendamentos', 'services', 'insumos', 'orders', 'ordens_servico']
      for (const table of potentialTables) {
        const { error: tError } = await supabase.from(table).select('*', { count: 'exact', head: true })
        if (!tError) {
          console.log(`Tabela encontrada: ${table}`)
        }
      }
    } else {
      console.log('Tabelas encontradas:', tables.map(t => t.table_name))
    }
  } else {
    console.log('Tabelas:', data)
  }
}

checkTables()
