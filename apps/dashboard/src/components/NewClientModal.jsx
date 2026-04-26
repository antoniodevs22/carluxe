import { X } from 'lucide-react';
import { useModal } from '../context/ModalContext';

const NewClientModal = () => {
  const { isNewClientModalOpen, closeNewClientModal } = useModal();

  if (!isNewClientModalOpen) return null;

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
          <h2 style={{ fontSize: '20px' }}>Cadastrar Novo Cliente</h2>
          <button onClick={closeNewClientModal} className="btn-ghost">
            <X size={20} />
          </button>
        </div>
        
        <div style={{ height: '1px', background: 'var(--gold)', opacity: 0.3 }}></div>

        <form style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={(e) => e.preventDefault()}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="label-gold">Nome Completo</label>
            <input type="text" className="input-field" placeholder="Ex: João da Silva" style={{ backgroundColor: 'var(--bg-page)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="label-gold">WhatsApp / Telefone</label>
              <input type="text" className="input-field" placeholder="(11) 99999-9999" style={{ backgroundColor: 'var(--bg-page)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="label-gold">E-mail</label>
              <input type="email" className="input-field" placeholder="exemplo@email.com" style={{ backgroundColor: 'var(--bg-page)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="label-gold">Endereço</label>
            <input type="text" className="input-field" placeholder="Rua, número, bairro..." style={{ backgroundColor: 'var(--bg-page)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="label-gold">Observações Internas</label>
            <textarea className="input-field" style={{ height: '60px', resize: 'none', backgroundColor: 'var(--bg-page)' }} placeholder="Notas sobre o cliente..."></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '12px' }}>
            <button type="button" onClick={closeNewClientModal} className="btn-ghost">Cancelar</button>
            <button type="button" onClick={() => { alert('Cliente Cadastrado!'); closeNewClientModal(); }} className="btn-primary" style={{ padding: '12px 32px' }}>
              Cadastrar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewClientModal;
