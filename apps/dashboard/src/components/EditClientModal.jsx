import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useModal } from '../context/ModalContext';
import { supabase } from '@carluxe/shared';

const EditClientModal = () => {
  const { isEditClientModalOpen, closeEditClientModal, selectedClientData } = useModal();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    endereco: '',
    observacoes: ''
  });

  useEffect(() => {
    if (isEditClientModalOpen && selectedClientData) {
      setFormData({
        nome: selectedClientData.nome || '',
        telefone: selectedClientData.telefone || '',
        email: selectedClientData.email || '',
        endereco: selectedClientData.endereco || '',
        observacoes: selectedClientData.observacoes || ''
      });
    }
  }, [isEditClientModalOpen, selectedClientData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.telefone) {
      alert('Nome e Telefone são obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('clientes')
        .update({
          nome: formData.nome,
          telefone: formData.telefone,
          email: formData.email,
          endereco: formData.endereco,
          observacoes: formData.observacoes,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', selectedClientData.id);

      if (error) throw error;

      alert('Dados atualizados com sucesso!');
      closeEditClientModal();
      window.location.reload();
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      alert('Erro ao atualizar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isEditClientModalOpen) return null;

  return (
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
    }}>
      <div className="card" style={{ width: '480px', padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '20px' }}>Editar Cliente</h2>
          <button onClick={closeEditClientModal} className="btn-ghost">
            <X size={20} />
          </button>
        </div>
        
        <div style={{ height: '1px', background: 'var(--gold)', opacity: 0.3 }}></div>

        <form style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="label-gold">Nome Completo</label>
            <input 
              name="nome"
              type="text" 
              className="input-field" 
              style={{ backgroundColor: 'var(--bg-page)' }}
              value={formData.nome}
              onChange={handleInputChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="label-gold">WhatsApp / Telefone</label>
              <input 
                name="telefone"
                type="text" 
                className="input-field" 
                style={{ backgroundColor: 'var(--bg-page)' }}
                value={formData.telefone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="label-gold">E-mail</label>
              <input 
                name="email"
                type="email" 
                className="input-field" 
                style={{ backgroundColor: 'var(--bg-page)' }}
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="label-gold">Endereço</label>
            <input 
              name="endereco"
              type="text" 
              className="input-field" 
              style={{ backgroundColor: 'var(--bg-page)' }}
              value={formData.endereco}
              onChange={handleInputChange}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="label-gold">Observações Internas</label>
            <textarea 
              name="observacoes"
              className="input-field" 
              style={{ height: '60px', resize: 'none', backgroundColor: 'var(--bg-page)' }}
              value={formData.observacoes}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '12px' }}>
            <button type="button" onClick={closeEditClientModal} className="btn-ghost" disabled={loading}>Cancelar</button>
            <button type="submit" className="btn-primary" style={{ padding: '12px 32px', display: 'flex', alignItems: 'center', gap: '8px' }} disabled={loading}>
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClientModal;
