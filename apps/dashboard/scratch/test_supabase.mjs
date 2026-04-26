import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

async function testConnection() {
  console.log('Testando conexão com Supabase...')
  console.log('URL:', supabaseUrl)
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Erro: Variáveis de ambiente não carregadas corretamente.')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  try {
    const { data: buckets, error: storageError } = await supabase
      .storage
      .listBuckets()

    if (storageError) {
      console.error('Erro ao conectar ao Storage:', storageError.message)
    } else {
      console.log('Conexão com Storage OK. Buckets encontrados:', buckets.length)
    }

    // Listar tabelas (isso requer permissões que o service role geralmente tem)
    // No Supabase, não há uma forma direta de listar tabelas via JS SDK sem RPC ou query direta,
    // mas podemos tentar buscar uma tabela comum ou usar o storage como proxy de sucesso.
    console.log('Conexão estabelecida com sucesso usando Service Role Key.')
  } catch (err) {
    console.error('Erro inesperado:', err)
  }
}

testConnection()
