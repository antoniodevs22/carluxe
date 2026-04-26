import { X } from 'lucide-react';
import { useModal } from '../context/ModalContext';

const EditServiceModal = () => {
  const { isEditServiceModalOpen, closeEditServiceModal } = useModal();

  if (!isEditServiceModalOpen) return null;

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
          <h2 style={{ fontSize: '20px' }}>Editar Serviço</h2>
          <button onClick={closeEditServiceModal} className="btn-ghost">
            <X size={20} />
          </button>
        </div>
        
        <div style={{ height: '1px', background: 'var(--gold)', opacity: 0.3 }}></div>

        <form style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={(e) => e.preventDefault()}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="label-gold">Nome do Serviço</label>
              <input type="text" className="input-field" defaultValue="Lavagem Premium" style={{ backgroundColor: 'var(--bg-page)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="label-gold">Categoria</label>
              <select className="input-field" style={{ backgroundColor: 'var(--bg-page)' }} defaultValue="LAVAGEM">
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
            <textarea className="input-field" style={{ height: '60px', resize: 'none', backgroundColor: 'var(--bg-page)' }} defaultValue="Limpeza completa com detalhamento de rodas, caixa de rodas e aplicação de selante rápido."></textarea>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label className="label-gold">Preços por Porte</label>
            {[
              { size: 'Pequeno', price: 120 },
              { size: 'Médio', price: 150 },
              { size: 'SUV', price: 200 },
              { size: 'Pickup', price: 220 }
            ].map(item => (
              <div key={item.size} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{item.size}</span>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '13px' }}>R$</span>
                  <input type="number" className="input-field" style={{ paddingLeft: '35px', backgroundColor: 'var(--bg-page)' }} defaultValue={item.price} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '12px' }}>
            <button type="button" onClick={closeEditServiceModal} className="btn-ghost">Cancelar</button>
            <button type="button" onClick={() => { alert('Alterações salvas!'); closeEditServiceModal(); }} className="btn-primary" style={{ padding: '12px 32px' }}>
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditServiceModal;
