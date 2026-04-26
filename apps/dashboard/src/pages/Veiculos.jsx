import { useState, useEffect } from 'react';
import { Search, Plus, Car, Edit2, Trash2, Loader2 } from 'lucide-react';
import { useModal } from '../context/ModalContext';
import { supabase } from '@carluxe/shared';

const Veiculos = () => {
  const { openNewVehicleModal, openEditVehicleModal } = useModal();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('veiculos')
        .select('id, marca, modelo, ano, cor, placa, porte, cliente_id, cliente:clientes(nome)');
      
      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error('Erro ao buscar veículos:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
    
    const channel = supabase.channel('veiculos_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'veiculos' }, () => {
        fetchVehicles();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const filteredVehicles = vehicles.filter(v => 
    v.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.cliente?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Barra de busca e botão */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Buscar por modelo, placa ou cliente..." 
            className="input-field" 
            style={{ paddingLeft: '48px', backgroundColor: 'var(--bg-surface)' }} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          className="btn-secondary" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          onClick={() => openNewVehicleModal()}
        >
          <Plus size={18} />
          Novo Veículo
        </button>
      </div>

      {/* Grid de Veículos */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '24px' 
      }}>
        {loading ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>
            <Loader2 size={32} className="animate-spin" style={{ color: 'var(--gold)', margin: '0 auto' }} />
          </div>
        ) : filteredVehicles.length === 0 ? (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>Nenhum veículo encontrado.</p>
        ) : filteredVehicles.map((item) => (
          <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '8px', 
                backgroundColor: 'var(--bg-page)', display: 'flex', 
                alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' 
              }}>
                <Car size={24} />
              </div>
              <span style={{ backgroundColor: 'var(--border)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', color: 'var(--text-primary)' }}>
                {item.porte || 'MÉDIO'}
              </span>
            </div>

            <div>
              <h3 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>{item.marca} {item.modelo}</h3>
              <p style={{ color: 'var(--gold)', fontWeight: '600', marginTop: '4px' }}>{item.placa}</p>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '600' }}>Proprietário</p>
                <p style={{ color: 'var(--text-primary)', marginTop: '2px' }}>{item.cliente?.nome || 'Não informado'}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '600' }}>Ano/Cor</p>
                <p style={{ color: 'var(--text-primary)', marginTop: '2px' }}>{item.ano || '---'} • {item.cor || '---'}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '12px' }}>
              <button 
                className="btn-ghost" 
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px', border: '1px solid var(--border)', borderRadius: '6px' }}
                onClick={() => openEditVehicleModal({ ...item, onSuccess: fetchVehicles })}
              >
                <Edit2 size={16} /> Editar
              </button>
              <button 
                className="btn-ghost" 
                style={{ padding: '8px', color: 'var(--status-cancelado)' }}
                onClick={async () => { 
                  if(confirm('Excluir veículo permanentemente?')) {
                    const { error } = await supabase.from('veiculos').delete().eq('id', item.id);
                    if (error) alert('Erro ao excluir: ' + error.message);
                  }
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Veiculos;
