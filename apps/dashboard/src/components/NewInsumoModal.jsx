import { X } from 'lucide-react';
import { useModal } from '../context/ModalContext';

const NewInsumoModal = () => {
  const { isNewInsumoModalOpen, closeNewInsumoModal } = useModal();

  if (!isNewInsumoModalOpen) return null;

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
          <h2 style={{ fontSize: '20px' }}>Cadastrar Novo Insumo</h2>
          <button onClick={closeNewInsumoModal} className="btn-ghost">
            <X size={20} />
          </button>
        </div>
        
        <div style={{ height: '1px', background: 'var(--gold)', opacity: 0.3 }}></div>

        <form style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={(e) => e.preventDefault()}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="label-gold">Nome do Insumo</label>
            <input type="text" className="input-field" placeholder="Ex: Cera de Carnaúba" style={{ backgroundColor: 'var(--bg-page)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="label-gold">Unidade</label>
              <select className="input-field" style={{ backgroundColor: 'var(--bg-page)' }}>
                <option>litro</option>
                <option>unid</option>
                <option>kg</option>
                <option>ml</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="label-gold">Quantidade Atual</label>
              <input type="text" className="input-field" placeholder="Ex: 5" style={{ backgroundColor: 'var(--bg-page)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="label-gold">Estoque Mínimo (Alerta)</label>
            <input type="text" className="input-field" placeholder="Ex: 2" style={{ backgroundColor: 'var(--bg-page)' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '12px' }}>
            <button type="button" onClick={closeNewInsumoModal} className="btn-ghost">Cancelar</button>
            <button type="button" onClick={() => { alert('Insumo Cadastrado!'); closeNewInsumoModal(); }} className="btn-primary" style={{ padding: '12px 32px' }}>
              Cadastrar Insumo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewInsumoModal;
