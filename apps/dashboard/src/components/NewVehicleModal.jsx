import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2 } from 'lucide-react';
import { useModal } from '../context/ModalContext';
import { supabase } from '@carluxe/shared';

const NewVehicleModal = () => {
  const { isNewVehicleModalOpen, closeNewVehicleModal, selectedClientId } = useModal();
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState([]);
  
  const [formData, setFormData] = useState({
    cliente_id: '',
    marca: '',
    modelo: '',
    ano: '',
    cor: '',
    placa: '',
    porte: 'MÉDIO'
  });

  useEffect(() => {
    const fetchClientes = async () => {
      const { data, error } = await supabase
        .from('clientes')
        .select('id, nome, telefone')
      
      console.log('clientes veículos:', data, error)
      setClientes(Array.isArray(data) ? data : [])
    }
    fetchClientes()
  }, []) // montar uma vez, sem dependências

  useEffect(() => {
    if (isNewVehicleModalOpen) {
      setFormData(prev => ({
        ...prev,
        cliente_id: selectedClientId || '',
        marca: '',
        modelo: '',
        ano: '',
        cor: '',
        placa: '',
        porte: 'MÉDIO'
      }));
    }
  }, [isNewVehicleModalOpen, selectedClientId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.cliente_id || !formData.modelo || !formData.placa) {
      alert('Por favor, preencha os campos obrigatórios (Cliente, Modelo e Placa)');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('veiculos')
        .insert([{
          cliente_id: formData.cliente_id,
          marca: formData.marca,
          modelo: formData.modelo,
          ano: formData.ano,
          cor: formData.cor,
          placa: formData.placa.toUpperCase(),
          porte: formData.porte
        }]);

      if (error) throw error;

      alert('Veículo cadastrado com sucesso!');
      closeNewVehicleModal();
      window.location.reload(); // Simplest way to refresh the data on the parent page
    } catch (error) {
      console.error('Erro ao cadastrar veículo:', error);
      alert('Erro ao cadastrar veículo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isNewVehicleModalOpen) return null;

  return createPortal(
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      overflow: 'visible'
    }}>
      <div className="card" style={{
        width: '480px',
        padding: '0',
        background: '#222222',
        borderRadius: '12px',
        overflow: 'visible',
        position: 'relative',
        zIndex: 1001
      }}>
        <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '20px' }}>Cadastrar Novo Veículo</h2>
          <button onClick={closeNewVehicleModal} className="btn-ghost">
            <X size={20} />
          </button>
        </div>
        
        <div style={{ height: '1px', background: 'var(--gold)', opacity: 0.3 }}></div>

        <form style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="label-gold">Proprietário (Cliente)</label>
            <select
              name="cliente_id"
              className="input-field"
              style={{ backgroundColor: 'var(--bg-page)' }}
              value={formData.cliente_id}
              onChange={e => setFormData(prev => ({ ...prev, cliente_id: e.target.value }))}
              disabled={!!selectedClientId}
              required
            >
              <option value="">Selecionar cliente... ({clientes.length})</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nome} — {c.telefone}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="label-gold">Marca</label>
              <input 
                name="marca"
                type="text" 
                className="input-field" 
                placeholder="Ex: Toyota" 
                style={{ backgroundColor: 'var(--bg-page)' }}
                value={formData.marca}
                onChange={handleInputChange}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="label-gold">Modelo</label>
              <input 
                name="modelo"
                type="text" 
                className="input-field" 
                placeholder="Ex: Supra" 
                style={{ backgroundColor: 'var(--bg-page)' }}
                value={formData.modelo}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="label-gold">Placa</label>
              <input 
                name="placa"
                type="text" 
                className="input-field" 
                placeholder="ABC-1234" 
                style={{ backgroundColor: 'var(--bg-page)' }}
                value={formData.placa}
                onChange={handleInputChange}
                required
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="label-gold">Cor</label>
              <input 
                name="cor"
                type="text" 
                className="input-field" 
                placeholder="Branco" 
                style={{ backgroundColor: 'var(--bg-page)' }}
                value={formData.cor}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="label-gold">Ano</label>
              <input 
                name="ano"
                type="text" 
                className="input-field" 
                placeholder="2024" 
                style={{ backgroundColor: 'var(--bg-page)' }}
                value={formData.ano}
                onChange={handleInputChange}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="label-gold">Categoria / Porte</label>
              <select 
                name="porte"
                className="input-field" 
                style={{ backgroundColor: 'var(--bg-page)' }}
                value={formData.porte}
                onChange={handleInputChange}
              >
                <option value="PEQUENO">PEQUENO</option>
                <option value="MÉDIO">MÉDIO</option>
                <option value="GRANDE">GRANDE</option>
                <option value="SUV">SUV</option>
                <option value="PICKUP">PICKUP</option>
                <option value="ESPORTIVO">ESPORTIVO</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '12px' }}>
            <button type="button" onClick={closeNewVehicleModal} className="btn-ghost" disabled={loading}>Cancelar</button>
            <button type="submit" className="btn-primary" style={{ padding: '12px 32px', display: 'flex', alignItems: 'center', gap: '8px' }} disabled={loading}>
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? 'Cadastrando...' : 'Cadastrar Veículo'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default NewVehicleModal;
