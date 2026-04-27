const SUPABASE_URL = 'https://nnpwqylirlrmrqubdfxk.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ucHdxeWxpcmxybXJxdWJkZnhrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjgyNDgzMywiZXhwIjoyMDkyNDAwODMzfQ.1rOkN9k9JevDmBtzysgzvZIo0IkNTLPpc6KQk_x8w8k'; // preencher com service_role key do .env do dashboard
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ''; // preencher com sua chave OpenAI

async function run() {
  if (!OPENAI_API_KEY) {
    console.error('ERRO: OPENAI_API_KEY não foi preenchida. Por favor, adicione sua chave OpenAI no arquivo scripts/popular-rag.js');
    return;
  }

  try {
    console.log('Buscando serviços ativos...');
    // 1. Buscar todos os serviços com ativo = true
    const responseServicos = await fetch(`${SUPABASE_URL}/rest/v1/servicos?ativo=eq.true&select=*`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!responseServicos.ok) {
      const errorText = await responseServicos.text();
      throw new Error(`Erro ao buscar serviços: ${responseServicos.status} ${responseServicos.statusText} - ${errorText}`);
    }

    const servicos = await responseServicos.json();
    console.log(`Encontrados ${servicos.length} serviços ativos.`);

    let insertedCount = 0;

    // 2. Para cada serviço, montar o texto, gerar o embedding e salvar na tabela conhecimento_carluxe
    for (const servico of servicos) {
      const texto = `Serviço: ${servico.nome}
Categoria: ${servico.categoria || 'Não especificada'}
Descrição: ${servico.descricao || 'Sem descrição'}
Preços por porte do veículo:
- Pequeno (Hatch, Sedan Compacto): R$ ${servico.preco_pequeno || 0}
- Médio (Sedan, SUV Compacto): R$ ${servico.preco_medio || 0}
- Grande (SUV, Minivan): R$ ${servico.preco_grande || 0}
- SUV Premium: R$ ${servico.preco_suv || 0}
- Pickup: R$ ${servico.preco_pickup || 0}
Duração estimada: ${servico.duracao_estimada || 0} minutos`;

      // 3. Enviar texto para API OpenAI embeddings
      const responseOpenAI = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'text-embedding-ada-002',
          input: texto
        })
      });

      if (!responseOpenAI.ok) {
        const errorText = await responseOpenAI.text();
        console.error(`Erro ao gerar embedding para o serviço ${servico.nome}:`, errorText);
        continue;
      }

      const openaiData = await responseOpenAI.json();
      const embedding = openaiData.data[0].embedding;

      // 4. Salvar na tabela conhecimento_carluxe
      const payloadConhecimento = {
        conteudo: texto,
        embedding: embedding,
        metadata: {
          servico_id: servico.id,
          nome: servico.nome,
          categoria: servico.categoria
        }
      };

      const responseInsert = await fetch(`${SUPABASE_URL}/rest/v1/conhecimento_carluxe`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(payloadConhecimento)
      });

      if (!responseInsert.ok) {
        const errorText = await responseInsert.text();
        console.error(`Erro ao salvar na tabela conhecimento_carluxe para o serviço ${servico.nome}:`, errorText);
      } else {
        insertedCount++;
        console.log(`Serviço '${servico.nome}' processado e inserido com sucesso.`);
      }
    }

    console.log(`\n=== RESUMO ===`);
    console.log(`${insertedCount} registros foram inseridos com sucesso na tabela conhecimento_carluxe.`);

  } catch (error) {
    console.error('Ocorreu um erro inesperado:', error);
  }
}

run();
