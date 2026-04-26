import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { useModal } from '../context/ModalContext';
import { supabase } from '@carluxe/shared';

const ConfirmDeliveryModal = () => {
  const { isConfirmDeliveryModalOpen, closeConfirmDeliveryModal, deliveryOSData } = useModal();
  const [loading, setLoading] = useState(false);
  const [observacao, setObservacao] = useState('');

  if (!isConfirmDeliveryModalOpen || !deliveryOSData) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('ordens_servico')
        .update({ 
          status: 'entregue', 
          data_saida: new Date().toISOString(),
          observacoes: deliveryOSData.observacoes 
            ? `${deliveryOSData.observacoes}\n\nEntrega: ${observacao}` 
            : `Entrega: ${observacao}`
        })
        .eq('id', deliveryOSData.id);

      if (error) throw error;
      
      // Toast manual ou alert para sucesso
      alert('Entrega registrada com sucesso!');
      closeConfirmDeliveryModal();
    } catch (error) {
      alert('Erro ao registrar entrega: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="card" style={{ width: '450px', padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
             <CheckCircle size={24} style={{ color: 'var(--status-pronto)' }} />
             <h2 style={{ fontSize: '20px' }}>Confirmar Entrega</h2>
          </div>
          <button onClick={closeConfirmDeliveryModal} className="btn-ghost">
            <X size={20} />
          </button>
        </div>
        
        <div style={{ height: '1px', background: 'var(--gold)', opacity: 0.3 }}></div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: 'var(--bg-page)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
             <p style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Cliente</p>
             <p style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '16px', marginBottom: '12px' }}>{deliveryOSData.cliente?.nome}</p>
             
             <p style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Veículo</p>
             <p style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{deliveryOSData.veiculo?.modelo}</p>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
            Confirma a entrega do veículo ao cliente? Esta ação marcará a Ordem de Serviço como concluída.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="label-gold">Observação de entrega (opcional)</label>
            <textarea 
              className="input-field" 
              style={{ height: '80px', resize: 'none', backgroundColor: 'var(--bg-page)' }} 
              placeholder="Ex: Veículo entregue para o cônjuge, observações sobre o serviço..."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '12px' }}>
            <button type="button" onClick={closeConfirmDeliveryModal} className="btn-ghost">Cancelar</button>
            <button 
              type="button" 
              disabled={loading}
              onClick={handleConfirm} 
              className="btn-primary" 
              style={{ 
                padding: '12px 24px', 
                backgroundColor: 'var(--status-pronto)', 
                borderColor: 'var(--status-pronto)',
                color: '#fff'
              }}
            >
              {loading ? 'Processando...' : 'Confirmar entrega'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeliveryModal;
