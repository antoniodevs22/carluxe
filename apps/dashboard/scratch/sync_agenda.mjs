import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seed() {
  console.log('--- SYNCING AGENDAMENTOS (V2) ---')
  const today = '2026-04-23'
  const agenda = [
    { client: 'Ricardo Monte', car: 'Audi RS6', plate: 'RS6-HOJE', time: '09:00' },
    { client: 'Sérgio Ramos', car: 'Ferrari F8', plate: 'F8F-HOJE', time: '14:00' }
  ]

  for (const a of agenda) {
    const userId = crypto.randomUUID()
    const vehicleId = crypto.randomUUID()
    
    // Parent 1: Customers (EN)
    const { error: e1 } = await supabase.from('customers').insert({ id: userId, name: a.client, email: 'ag@test.com', phone: '111' })
    if (e1) console.error('Customers Error:', e1.message)
    
    // Parent 2: Clientes (PT)
    const { error: e2 } = await supabase.from('clientes').insert({ id: userId, nome: a.client, telefone: '111' })
    if (e2) console.error('Clientes Error:', e2.message)
    
    // Child 1: Vehicles (EN) - Depends on Customers
    const { error: e3 } = await supabase.from('vehicles').insert({ 
      id: vehicleId, 
      customerId: userId, 
      model: a.car, 
      plate: a.plate, 
      brand: a.car.split(' ')[0], 
      color: 'Preto', 
      year: '2024' 
    })
    if (e3) console.error('Vehicles Error:', e3.message)
    
    // Child 2: Veiculos (PT) - Depends on Clientes
    const { error: e4 } = await supabase.from('veiculos').insert({
      id: vehicleId,
      cliente_id: userId,
      modelo: a.car,
      placa: a.plate,
      porte: 'medio'
    })
    if (e4) console.error('Veiculos Error:', e4.message)
    
    // Target: Agendamentos - Depends on Vehicles/Clientes
    const { error: e5 } = await supabase.from('agendamentos').insert({ 
      id: crypto.randomUUID(), 
      cliente_id: userId, 
      veiculo_id: vehicleId, 
      data_hora: `${today}T${a.time}:00`, 
      status: 'pendente'
    })
    if (e5) console.error('Agendamentos Error:', e5.message)
  }
  console.log('--- DONE ---')
}

seed().catch(console.error)
