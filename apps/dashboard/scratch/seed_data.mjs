import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function seed() {
  console.log('Iniciando semeadura de dados...')

  // 1. Criar Usuários
  const users = [
    { email: 'admin@carluxe.com', password: 'password123', name: 'Admin', role: 'Manager' },
    { email: 'joao@carluxe.com', password: 'password123', name: 'João', role: 'Funcionário' },
    { email: 'maria@carluxe.com', password: 'password123', name: 'Maria', role: 'Funcionária' }
  ]

  for (const u of users) {
    console.log(`Criando usuário: ${u.email}...`)
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { name: u.name, role: u.role }
    })
    if (error) {
      if (error.message.includes('already exists')) {
        console.log(`Usuário ${u.email} já existe.`)
      } else {
        console.error(`Erro ao criar ${u.email}:`, error.message)
      }
    } else {
      console.log(`Usuário ${u.email} criado com ID: ${data.user.id}`)
    }
  }

  // 2. Inserir Serviços
  console.log('Inserindo serviços...')
  const services = [
    { nome: 'Polimento Técnico', preco_base: 800, descricao: 'Polimento em 3 etapas para brilho máximo.' },
    { nome: 'Vitrificação Cerâmica', preco_base: 1500, descricao: 'Proteção de pintura por até 3 anos.' },
    { nome: 'Lavagem Premium', preco_base: 150, descricao: 'Lavagem detalhada com cera.' },
    { nome: 'Higienização Interna', preco_base: 400, descricao: 'Limpeza profunda de estofados e carpetes.' },
    { nome: 'PPF Frontal', preco_base: 3500, descricao: 'Película de proteção contra pedras e riscos.' }
  ]
  const { data: insertedServices } = await supabase.from('services').upsert(services, { onConflict: 'nome' }).select()

  // 3. Inserir Insumos
  console.log('Inserindo insumos...')
  const insumos = [
    { nome: 'Cera Carnaúba', quantidade_atual: 0.5, quantidade_minima: 1.0, unidade: 'L', preco_unitario: 120 },
    { nome: 'Shampoo Neutro', quantidade_atual: 5, quantidade_minima: 2, unidade: 'L', preco_unitario: 45 },
    { nome: 'Composto Polidor', quantidade_atual: 0.2, quantidade_minima: 0.5, unidade: 'kg', preco_unitario: 180 },
    { nome: 'Pano Microfibra', quantidade_atual: 20, quantidade_minima: 10, unidade: 'un', preco_unitario: 15 },
    { nome: 'Vitrificador H9', quantidade_atual: 1, quantidade_minima: 2, unidade: 'kit', preco_unitario: 450 }
  ]
  await supabase.from('insumos').upsert(insumos, { onConflict: 'nome' })

  // 4. Inserir Clientes
  console.log('Inserindo clientes...')
  const clients = [
    { nome: 'João Paulo', email: 'joao.paulo@gmail.com', telefone: '(11) 98888-7777' },
    { nome: 'Marcos Lima', email: 'marcos.lima@outlook.com', telefone: '(11) 97777-6666' },
    { nome: 'Ana Souza', email: 'ana.souza@yahoo.com', telefone: '(11) 96666-5555' },
    { nome: 'Beatriz Mello', email: 'beatriz.mello@gmail.com', telefone: '(11) 95555-4444' },
    { nome: 'Lucas Ferreira', email: 'lucas.f@gmail.com', telefone: '(11) 94444-3333' }
  ]
  const { data: insertedClients } = await supabase.from('clients').upsert(clients, { onConflict: 'email' }).select()

  // 5. Inserir Veículos
  console.log('Inserindo veículos...')
  if (insertedClients) {
    const vehicles = [
      { cliente_id: insertedClients[0].id, modelo: 'Toyota Supra', placa: 'ABC-1234', cor: 'Branco', ano: '2023', tamanho: 'MÉDIO' },
      { cliente_id: insertedClients[1].id, modelo: 'Porsche 911', placa: 'LUX-9110', cor: 'Cinza Giz', ano: '2024', tamanho: 'MÉDIO' },
      { cliente_id: insertedClients[2].id, modelo: 'BMW X5', placa: 'BMW-0X50', cor: 'Preto', ano: '2023', tamanho: 'SUV' },
      { cliente_id: insertedClients[3].id, modelo: 'Audi R8', placa: 'V10-0008', cor: 'Azul', ano: '2022', tamanho: 'MÉDIO' },
      { cliente_id: insertedClients[4].id, modelo: 'Mercedes GLE', placa: 'AMG-6300', cor: 'Prata', ano: '2024', tamanho: 'SUV' }
    ]
    const { data: insertedVehicles } = await supabase.from('vehicles').upsert(vehicles, { onConflict: 'placa' }).select()

    // 6. Inserir Agendamentos
    console.log('Inserindo agendamentos...')
    if (insertedVehicles) {
      const today = new Date();
      const agendamentos = [
        { 
          cliente_id: insertedClients[0].id, 
          veiculo_id: insertedVehicles[0].id, 
          data_hora: new Date(today.setHours(9, 0)).toISOString(), 
          status: 'pendente',
          valor_estimado: 940
        },
        { 
          cliente_id: insertedClients[1].id, 
          veiculo_id: insertedVehicles[1].id, 
          data_hora: new Date(today.setHours(10, 30)).toISOString(), 
          status: 'confirmado',
          valor_estimado: 1890
        },
        { 
          cliente_id: insertedClients[2].id, 
          veiculo_id: insertedVehicles[2].id, 
          data_hora: new Date(today.setHours(14, 0)).toISOString(), 
          status: 'pendente',
          valor_estimado: 2500
        }
      ]
      await supabase.from('agendamentos').upsert(agendamentos)

      // 7. Inserir Ordens de Serviço
      console.log('Inserindo OS...')
      const ordens = [
        { 
          cliente_id: insertedClients[3].id, 
          veiculo_id: insertedVehicles[3].id, 
          status: 'execucao',
          valor_total: 3200
        },
        { 
          cliente_id: insertedClients[4].id, 
          veiculo_id: insertedVehicles[4].id, 
          status: 'pronto',
          valor_total: 1200
        }
      ]
      await supabase.from('ordens_servico').upsert(ordens)
    }
  }

  console.log('Semeadura concluída com sucesso!')
}

seed()
