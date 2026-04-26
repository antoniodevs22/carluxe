import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

function generateUUID() {
  return crypto.randomUUID()
}

async function getOrCreatePerson(nome) {
  // Check customers
  const { data: cust } = await supabase.from('customers').select().eq('name', nome).maybeSingle()
  if (cust) {
    // Ensure it exists in clientes too
    await supabase.from('clientes').upsert({ id: cust.id, nome: cust.name, email: cust.email, telefone: cust.phone }, { onConflict: 'id' })
    return cust
  }
  
  const id = generateUUID()
  const email = `${nome.toLowerCase().replace(' ', '.')}@exemplo.com`
  const phone = '(11) 99999-9999'

  // Insert into customers
  const { data: c1, error: e1 } = await supabase.from('customers').insert({ id, name: nome, email, phone }).select().single()
  if (e1) console.error('Error customers:', e1)

  // Insert into clientes
  const { data: c2, error: e2 } = await supabase.from('clientes').insert({ id, nome, email, telefone: phone }).select().single()
  if (e2) console.error('Error clientes:', e2)

  return c1 || c2
}

async function getOrCreateVehicle(clientId, model, plate, color, year) {
  const { data } = await supabase.from('vehicles').select().eq('plate', plate).maybeSingle()
  if (data) return data
  
  const brand = model.split(' ')[0]
  
  const { data: inserted, error } = await supabase.from('vehicles').insert({ 
    id: generateUUID(),
    customerId: clientId, 
    brand: brand,
    model: model, 
    plate: plate,
    color: color,
    year: year
  }).select().single()
  
  if (error) throw error
  return inserted
}

async function seed() {
  console.log('Sincronizando dados realistas...')

  // 1. Insumos
  const insumos = [
    { nome: 'Shampoo Automotivo Premium', quantidade_atual: 5.5, quantidade_minima: 10, unidade: 'L' },
    { nome: 'Desengraxante Pesado', quantidade_atual: 2, quantidade_minima: 8, unidade: 'L' },
    { nome: 'Silicone Brilhante', quantidade_atual: 1.5, quantidade_minima: 3, unidade: 'L' },
    { nome: 'Cera de Carnaúba Plus', quantidade_atual: 0.8, quantidade_minima: 2, unidade: 'kg' },
    { nome: 'Vitrificador H9', quantidade_atual: 1, quantidade_minima: 5, unidade: 'un' }
  ]
  for (const i of insumos) {
    const { data: existing } = await supabase.from('insumos').select().eq('nome', i.nome).maybeSingle()
    if (existing) {
       await supabase.from('insumos').update(i).eq('id', existing.id)
    } else {
       await supabase.from('insumos').insert({ ...i, id: generateUUID() })
    }
  }

  // 2. Clientes e Veículos
  const osData = [
    { client: 'João Paulo', car: 'Toyota Supra', plate: 'ABC-1234', color: 'Branco', year: '2023', status: 'entrada' },
    { client: 'Rafael Costa', car: 'RAM 1500 Limited', plate: 'RAM-1500', color: 'Azul Patriot', year: '2023', status: 'entrada' },
    { client: 'Beatriz Mello', car: 'Audi R8 V10', plate: 'V10-0008', color: 'Azul Ascari', year: '2022', status: 'entrada' },
    { client: 'Marcos Lima', car: 'Porsche 911 Carrera', plate: 'LUX-9110', color: 'Cinza Giz', year: '2024', status: 'execucao' },
    { client: 'Carlos Mendes', car: 'BMW M3', plate: 'BMW-M333', color: 'Preto', year: '2023', status: 'execucao' },
    { client: 'Fernanda Silva', car: 'Mercedes GLE 63S', plate: 'AMG-6300', color: 'Prata Iridium', year: '2024', status: 'execucao' },
    { client: 'Pedro Alves', car: 'Toyota GR86', plate: 'GR-8686', color: 'Vermelho', year: '2023', status: 'execucao' },
    { client: 'Ana Souza', car: 'BMW X5 M60i', plate: 'BMW-0X50', color: 'Preto Carbono', year: '2023', status: 'finalizacao' },
    { client: 'Lucas Ferreira', car: 'Porsche Cayenne', plate: 'CAY-9999', color: 'Branco', year: '2024', status: 'finalizacao' },
    { client: 'Thiago Rocha', car: 'Audi Q8', plate: 'Q8-0008', color: 'Cinza', year: '2023', status: 'pronto' },
    { client: 'Juliana Costa', car: 'Mercedes A250', plate: 'MB-2500', color: 'Preto', year: '2024', status: 'pronto' },
    { client: 'Roberto Lima', car: 'Supra GR', plate: 'GR-0000', color: 'Amarelo', year: '2023', status: 'pronto' }
  ]

  for (const item of osData) {
    const person = await getOrCreatePerson(item.client)
    const vehicle = await getOrCreateVehicle(person.id, item.car, item.plate, item.color, item.year)
    
    const { data: existingOS } = await supabase.from('ordens_servico').select().eq('veiculo_id', vehicle.id).not('status', 'in', '("entregue","cancelado")').maybeSingle()
    
    const osPayload = {
      cliente_id: person.id,
      veiculo_id: vehicle.id,
      status: item.status,
      valor_total: 1500 + Math.random() * 2000
    }

    if (existingOS) {
      await supabase.from('ordens_servico').update(osPayload).eq('id', existingOS.id)
    } else {
      await supabase.from('ordens_servico').insert({ ...osPayload, id: generateUUID() })
    }
  }

  // 3. Agendamentos
  const today = new Date()
  today.setHours(0,0,0,0)
  const agenda = [
    { client: 'Ricardo Monte', car: 'Audi RS6', plate: 'RS6-6666', time: 9 },
    { client: 'Sérgio Ramos', car: 'Ferrari F8', plate: 'F8-8888', time: 14 }
  ]

  for (const a of agenda) {
    const person = await getOrCreatePerson(a.client)
    const vehicle = await getOrCreateVehicle(person.id, a.car, a.plate)
    
    const dt = new Date(today)
    dt.setHours(a.time, 0, 0, 0)

    const { data: existingAgenda } = await supabase.from('agendamentos').select().eq('veiculo_id', vehicle.id).eq('data_hora', dt.toISOString()).maybeSingle()
    
    const agendaPayload = {
      cliente_id: person.id,
      veiculo_id: vehicle.id,
      data_hora: dt.toISOString(),
      status: 'confirmado',
      valor_estimado: 500
    }

    if (existingAgenda) {
      await supabase.from('agendamentos').update(agendaPayload).eq('id', existingAgenda.id)
    } else {
      await supabase.from('agendamentos').insert({ ...agendaPayload, id: generateUUID() })
    }
  }

  console.log('Sincronização completa!')
}

seed().catch(console.error)
