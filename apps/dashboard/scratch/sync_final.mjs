import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function getOrCreatePerson(nome) {
  // 1. Check customers
  const { data: cust } = await supabase.from('customers').select().eq('name', nome).maybeSingle()
  if (cust) return cust
  
  const id = crypto.randomUUID()
  const email = `${nome.toLowerCase().replace(' ', '.')}@gmail.com`
  const phone = '(11) 99999-0000'

  // Insert into customers
  const { data: c1, error: e1 } = await supabase.from('customers').insert({ id, name: nome, email, phone }).select().single()
  if (e1) throw e1

  // Insert into clientes (mirroring)
  await supabase.from('clientes').upsert({ id, nome, email, telefone: phone })

  return c1
}

async function getOrCreateVehicle(clientId, model, plate) {
  const { data } = await supabase.from('vehicles').select().eq('plate', plate).maybeSingle()
  if (data) return data
  
  const id = crypto.randomUUID()
  const { data: inserted, error } = await supabase.from('vehicles').insert({ 
    id, 
    customerId: clientId, 
    model, 
    plate,
    brand: model.split(' ')[0],
    color: 'Preto',
    year: '2024'
  }).select().single()
  
  if (error) throw error
  return inserted
}

async function seed() {
  console.log('Sincronizando...')

  const osData = [
    { client: 'João Paulo', car: 'Toyota Supra', plate: 'SUP-0001', status: 'entrada' },
    { client: 'Rafael Costa', car: 'RAM 1500 Limited', plate: 'RAM-0002', status: 'entrada' },
    { client: 'Beatriz Mello', car: 'Audi R8 V10', plate: 'R8V-0003', status: 'entrada' },
    { client: 'Marcos Lima', car: 'Porsche 911 Carrera', plate: 'POR-0004', status: 'execucao' },
    { client: 'Carlos Mendes', car: 'BMW M3', plate: 'BMW-0005', status: 'execucao' },
    { client: 'Fernanda Silva', car: 'Mercedes GLE 63S', plate: 'MBG-0006', status: 'execucao' },
    { client: 'Pedro Alves', car: 'Toyota GR86', plate: 'GR8-0007', status: 'execucao' },
    { client: 'Ana Souza', car: 'BMW X5 M60i', plate: 'X5M-0008', status: 'finalizacao' },
    { client: 'Lucas Ferreira', car: 'Porsche Cayenne', plate: 'CAY-0009', status: 'finalizacao' },
    { client: 'Thiago Rocha', car: 'Audi Q8', plate: 'AQ8-0010', status: 'pronto' },
    { client: 'Juliana Costa', car: 'Mercedes A250', plate: 'MBA-0011', status: 'pronto' },
    { client: 'Roberto Lima', car: 'Supra GR', plate: 'SGR-0012', status: 'pronto' }
  ]

  for (const item of osData) {
    const c = await getOrCreatePerson(item.client)
    const v = await getOrCreateVehicle(c.id, item.car, item.plate)

    // A OS usa cliente_id que aponta para a tabela clientes. 
    // Como eu espelhei o ID em getOrCreatePerson, c.id funciona para ambas.
    const { data: existing } = await supabase.from('ordens_servico').select().eq('veiculo_id', v.id).not('status', 'in', '("entregue","cancelado")').maybeSingle()

    if (!existing) {
      await supabase.from('ordens_servico').insert({
        id: crypto.randomUUID(),
        cliente_id: c.id,
        veiculo_id: v.id,
        status: item.status,
        valor_total: 1500
      })
    } else {
      await supabase.from('ordens_servico').update({ status: item.status }).eq('id', existing.id)
    }
  }

  const today = '2026-04-23'
  const agenda = [
    { client: 'Ricardo Monte', car: 'Audi RS6', plate: 'RS6-HOJE', time: '09:00' },
    { client: 'Sérgio Ramos', car: 'Ferrari F8', plate: 'F8F-HOJE', time: '14:00' }
  ]

  for (const a of agenda) {
    const c = await getOrCreatePerson(a.client)
    const v = await getOrCreateVehicle(c.id, a.car, a.plate)

    const { data: ex } = await supabase.from('agendamentos').select().eq('veiculo_id', v.id).gte('data_hora', `${today}T00:00:00`).maybeSingle()
    if (!ex) {
      await supabase.from('agendamentos').insert({
        id: crypto.randomUUID(),
        cliente_id: c.id,
        veiculo_id: v.id,
        data_hora: `${today}T${a.time}:00`,
        status: 'confirmado',
        valor_estimado: 500
      })
    }
  }

  console.log('Pronto!')
}

seed().catch(console.error)
