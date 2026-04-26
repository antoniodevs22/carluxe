import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seed() {
  console.log('🔥 NUCLEAR SEED START')

  // Cleanup in order
  await supabase.from('ordens_servico').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('agendamentos').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('vehicles').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('veiculos').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('customers').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('clientes').delete().neq('id', '00000000-0000-0000-0000-000000000000')

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
    const userId = crypto.randomUUID()
    const vehicleId = crypto.randomUUID()
    const brand = item.car.split(' ')[0]

    await supabase.from('clientes').insert({ id: userId, nome: item.client, telefone: '(11) 99999-0000', email: `${item.client.toLowerCase().replace(' ', '.')}@gmail.com` })
    await supabase.from('customers').insert({ id: userId, name: item.client, email: `${item.client.toLowerCase().replace(' ', '.')}@gmail.com`, phone: '(11) 99999-0000' })
    await supabase.from('vehicles').insert({ id: vehicleId, customerId: userId, model: item.car, plate: item.plate, brand, color: 'Preto', year: '2024' })
    await supabase.from('veiculos').insert({ id: vehicleId, cliente_id: userId, marca: brand, modelo: item.car, placa: item.plate, ano: 2024, cor: 'Preto', porte: 'medio' })
    await supabase.from('ordens_servico').insert({ id: crypto.randomUUID(), cliente_id: userId, veiculo_id: vehicleId, status: item.status, valor_total: 1500 })
  }

  const today = '2026-04-23'
  const agenda = [
    { client: 'Ricardo Monte', car: 'Audi RS6', plate: 'RS6-HOJE', time: '09:00' },
    { client: 'Sérgio Ramos', car: 'Ferrari F8', plate: 'F8F-HOJE', time: '14:00' }
  ]

  for (const a of agenda) {
    const userId = crypto.randomUUID()
    const vehicleId = crypto.randomUUID()
    const brand = a.car.split(' ')[0]
    await supabase.from('clientes').insert({ id: userId, nome: a.client, telefone: '(11) 99999-0000' })
    await supabase.from('customers').insert({ id: userId, name: a.client, phone: '(11) 99999-0000' })
    await supabase.from('vehicles').insert({ id: vehicleId, customerId: userId, model: a.car, plate: a.plate, brand })
    await supabase.from('veiculos').insert({ id: vehicleId, cliente_id: userId, marca: brand, modelo: a.car, placa: a.plate, porte: 'medio' })
    await supabase.from('agendamentos').insert({ id: crypto.randomUUID(), cliente_id: userId, veiculo_id: vehicleId, data_hora: `${today}T${a.time}:00`, status: 'pendente' })
  }

  console.log('✅ NUCLEAR SEED COMPLETED')
}

seed().catch(console.error)
