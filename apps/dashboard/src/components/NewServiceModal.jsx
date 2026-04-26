import { X, Plus, Trash2 } from 'lucide-react';
import { useModal } from '../context/ModalContext';

const NewServiceModal = () => {
  const { isNewServiceModalOpen, closeNewServiceModal } = useModal();

  if (!isNewServiceModalOpen) return null;

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
      <div className="card" style={{ width: '520px', padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '20px' }}>Cadastrar Novo Serviço</h2>
          <button onClick={closeNewServiceModal} className="btn-ghost">
            <X size={20} />
          </button>
        </div>
        
        <div style={{ height: '1px', background: 'var(--gold)', opacity: 0.3 }}></div>

        <form style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={(e) => e.preventDefault()}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="label-gold">Nome do Serviço</label>
              <input type="text" className="input-field" placeholder="Ex: Lavagem de Chassi" style={{ backgroundColor: 'var(--bg-page)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="label-gold">Categoria</label>
              <select className="input-field" style={{ backgroundColor: 'var(--bg-page)' }}>
                <option>LAVAGEM</option>
                <option>POLIMENTO</option>
                <option>VITRIFICAÇÃO</option>
                <option>HIGIENIZAÇÃO</option>
                <option>PPF</option>
                <option>ESTÉTICA</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="label-gold">Descrição Curta</label>
            <textarea className="input-field" style={{ height: '60px', resize: 'none', backgroundColor: 'var(--bg-page)' }} placeholder="O que está incluso no serviço..."></textarea>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label className="label-gold">Preços por Porte</label>
            {['Pequeno', 'Médio', 'SUV', 'Pickup'].map(size => (
              <div key={size} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{size}</span>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '13px' }}>R$</span>
                  <input type="number" className="input-field" style={{ paddingLeft: '35px', backgroundColor: 'var(--bg-page)' }} placeholder="0,00" />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="label-gold">Duração Estimada</label>
            <input type="text" className="input-field" placeholder="Ex: 2h00" style={{ backgroundColor: 'var(--bg-page)', width: '120px' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '12px' }}>
            <button type="button" onClick={closeNewServiceModal} className="btn-ghost">Cancelar</button>
            <button type="button" onClick={() => { alert('Serviço Cadastrado!'); closeNewServiceModal(); }} className="btn-primary" style={{ padding: '12px 32px' }}>
              Salvar Serviço
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewServiceModal;
