import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useModal } from '../context/ModalContext';
import { supabase } from '@carluxe/shared';

const EditVehicleModal = () => {
  const { isEditVehicleModalOpen, closeEditVehicleModal, selectedVehicleId } = useModal();
  const [loading, setLoading] = useState(false);

  if (!isEditVehicleModalOpen) return null;

  // selectedVehicleId contém o objeto inteiro do veículo (item)
  const vehicle = selectedVehicleId || {};
  const nomeDoProprietarioAtual = vehicle.cliente?.nome || 'Não informado';

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!vehicle.id) {
      alert('Erro: ID do veículo não encontrado.');
      return;
    }

    setLoading(true);
    const form = new FormData(e.target);
    const formData = Object.fromEntries(form.entries());

    console.log('Dados enviados:', formData);
    console.log('ID do veículo:', vehicle.id);

    try {
      const { error } = await supabase
        .from('veiculos')
        .update({
          marca: formData.marca,
          modelo: formData.modelo,
          ano: formData.ano,
          cor: formData.cor,
          placa: formData.placa,
          porte: formData.porte
        })
        .eq('id', vehicle.id);

      console.log('Erro Supabase:', error);

      if (error) throw error;
      
      console.log('Update executado com sucesso');
      
      // Forçar reload na página pai se fornecido o onSuccess
      vehicle.onSuccess?.();
      
      closeEditVehicleModal();
    } catch (error) {
      alert('Erro ao salvar veículo: ' + error.message);
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
      <div className="card" style={{ width: '480px', padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '20px' }}>Editar Veículo</h2>
          <button onClick={closeEditVehicleModal} className="btn-ghost">
            <X size={20} />
          </button>
        </div>
        
        <div style={{ height: '1px', background: 'var(--gold)', opacity: 0.3 }}></div>

        <form style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={handleSave}>
          <div>
            <label style={{ color: 'var(--gold)', fontSize: '12px' }}>
              PROPRIETÁRIO
            </label>
            <p style={{ color: 'var(--text-primary)', marginTop: '4px' }}>
              {nomeDoProprietarioAtual}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="label-gold">Marca</label>
              <input type="text" name="marca" className="input-field" defaultValue={vehicle.marca || ''} style={{ backgroundColor: 'var(--bg-page)' }} required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="label-gold">Modelo</label>
              <input type="text" name="modelo" className="input-field" defaultValue={vehicle.modelo || ''} style={{ backgroundColor: 'var(--bg-page)' }} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="label-gold">Placa</label>
              <input type="text" name="placa" className="input-field" defaultValue={vehicle.placa || ''} style={{ backgroundColor: 'var(--bg-page)' }} required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="label-gold">Ano</label>
              <input type="text" name="ano" className="input-field" defaultValue={vehicle.ano || ''} style={{ backgroundColor: 'var(--bg-page)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="label-gold">Cor</label>
              <input type="text" name="cor" className="input-field" defaultValue={vehicle.cor || ''} style={{ backgroundColor: 'var(--bg-page)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="label-gold">Categoria / Porte</label>
              <select name="porte" className="input-field" style={{ backgroundColor: 'var(--bg-page)' }} defaultValue={vehicle.porte || "MÉDIO"}>
                <option value="PEQUENO">PEQUENO</option>
                <option value="MÉDIO">MÉDIO</option>
                <option value="SUV">SUV</option>
                <option value="PICKUP">PICKUP</option>
                <option value="ESPORTIVO">ESPORTIVO</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '12px' }}>
            <button type="button" onClick={closeEditVehicleModal} className="btn-ghost" disabled={loading}>Cancelar</button>
            <button type="submit" className="btn-primary" style={{ padding: '12px 32px', display: 'flex', gap: '8px', alignItems: 'center' }} disabled={loading}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVehicleModal;
