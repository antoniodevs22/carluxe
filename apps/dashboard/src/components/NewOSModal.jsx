import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useModal } from '../context/ModalContext';
import { supabase } from '@carluxe/shared';

const NewOSModal = () => {
  const { isNewOSModalOpen, closeNewOSModal, newOSData } = useModal();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);

  const [formData, setFormData] = useState({
    cliente_id: '',
    veiculo_id: '',
    servicos_ids: [],
    data_entrada: new Date().toISOString().split('T')[0],
    hora_entrada: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    observacoes: '',
    valor_total: 0,
  });

  const selectedVehicle = vehicles.find(v => v.id === formData.veiculo_id);
  const porteDoVeiculo = selectedVehicle?.porte || 'medio';
  // Só é conversão de agendamento se newOSData tiver um id válido (não é um evento React)
  const isConvertingAgendamento = !!(newOSData && newOSData.id && typeof newOSData.id === 'string');

  useEffect(() => {
    if (isNewOSModalOpen) {
      fetchInitialData();

      if (newOSData && typeof newOSData === 'object') {
        try {
          setFormData({
            cliente_id: newOSData.cliente_id || '',
            veiculo_id: newOSData.veiculo_id || '',
            servicos_ids: Array.isArray(newOSData.servicos_ids) ? newOSData.servicos_ids : [],
            data_entrada: typeof newOSData.data_hora === 'string'
              ? newOSData.data_hora.split('T')[0]
              : new Date().toISOString().split('T')[0],
            hora_entrada: newOSData.data_hora
              ? new Date(newOSData.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
              : '',
            observacoes: `Convertido do agendamento #${newOSData.id ? String(newOSData.id).slice(0, 8) : '---'}`,
            valor_total: Number(newOSData.valor_estimado) || 0,
          });
        } catch (err) {
          console.error('Erro ao processar dados do agendamento:', err);
        }
      } else {
        setFormData({
          cliente_id: '',
          veiculo_id: '',
          servicos_ids: [],
          data_entrada: new Date().toISOString().split('T')[0],
          hora_entrada: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          observacoes: '',
          valor_total: 0,
        });
      }
    }
  }, [isNewOSModalOpen, newOSData]);

  const fetchInitialData = async () => {
    setFetchLoading(true);
    try {
      const { data: cData, error: cError } = await supabase
        .from('clientes')
        .select('id, nome, telefone');

      const { data: sData, error: sError } = await supabase
        .from('servicos')
        .select('id, nome, categoria, preco, preco_pequeno, preco_medio, preco_grande, preco_suv, preco_pickup')
        .eq('ativo', true);

      console.log('clientes:', cData?.length, cError);
      console.log('servicos:', sData?.length, sError);

      setClients(Array.isArray(cData) ? cData : []);
      setServices(Array.isArray(sData) ? sData : []);
    } catch (err) {
      console.error('fetchInitialData error:', err);
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchVehicles = async (clientId) => {
    if (!clientId) { setVehicles([]); return; }
    try {
      const { data, error } = await supabase
        .from('veiculos')
        .select('id, marca, modelo, placa, porte')
        .eq('cliente_id', clientId);
      if (error) throw error;
      setVehicles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('fetchVehicles error:', err);
      setVehicles([]);
    }
  };

  useEffect(() => {
    if (formData.cliente_id) fetchVehicles(formData.cliente_id);
    else setVehicles([]);
  }, [formData.cliente_id]);

  const getPreco = (servico, porte) => ({
    pequeno: servico.preco_pequeno,
    medio:   servico.preco_medio,
    grande:  servico.preco_grande,
    suv:     servico.preco_suv,
    pickup:  servico.preco_pickup,
  }[porte] ?? servico.preco ?? 0);

  useEffect(() => {
    const total = (formData.servicos_ids ?? []).reduce((acc, id) => {
      const s = services.find(sv => sv.id === id);
      return acc + (s ? getPreco(s, porteDoVeiculo) : 0);
    }, 0);
    setFormData(prev => ({ ...prev, valor_total: total }));
  }, [formData.servicos_ids, formData.veiculo_id, services]);

  const handleServiceToggle = (serviceId) => {
    setFormData(prev => {
      const cur = Array.isArray(prev.servicos_ids) ? prev.servicos_ids : [];
      const has = cur.includes(serviceId);
      return { ...prev, servicos_ids: has ? cur.filter(id => id !== serviceId) : [...cur, serviceId] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.cliente_id || !formData.veiculo_id || formData.servicos_ids.length === 0) {
      alert('Preencha todos os campos obrigatórios e selecione ao menos um serviço.');
      return;
    }
    setLoading(true);
    try {
      const { data: os, error: osError } = await supabase
        .from('ordens_servico')
        .insert([{
          cliente_id: formData.cliente_id,
          veiculo_id: formData.veiculo_id,
          servicos_ids: formData.servicos_ids,
          status: 'entrada',
          data_entrada: `${formData.data_entrada}T${formData.hora_entrada || '08:00'}:00`,
          valor_total: formData.valor_total,
          observacoes: formData.observacoes,
        }])
        .select().single();
      if (osError) throw osError;

      const osServicos = formData.servicos_ids.map(id => {
        const s = services.find(sv => sv.id === id);
        return { os_id: os.id, servico_id: id, preco_aplicado: s ? getPreco(s, porteDoVeiculo) : 0 };
      });
      const { error: joinErr } = await supabase.from('os_servicos').insert(osServicos);
      if (joinErr) throw joinErr;

      if (newOSData?.id) {
        await supabase.from('agendamentos').update({ status: 'convertido' }).eq('id', newOSData.id);
      }

      alert('OS criada com sucesso!');
      closeNewOSModal();
      window.dispatchEvent(new Event('os_created'));
    } catch (err) {
      console.error('handleSubmit error:', err);
      alert('Erro ao criar OS: ' + (err.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  if (!isNewOSModalOpen) return null;

  const selectStyle = {
    width: '100%',
    padding: '10px',
    background: '#171717',
    color: '#F0EDE8',
    border: '1px solid #2E2E2E',
    borderRadius: '8px',
    fontSize: '14px',
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000,
    }}>
      <div className="card" style={{
        width: '620px', padding: 0,
        maxHeight: '95vh', display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <h2 style={{ fontSize: '20px' }}>
            {isConvertingAgendamento ? 'Converter em Ordem de Serviço' : 'Nova Ordem de Serviço'}
          </h2>
          <button onClick={closeNewOSModal} className="btn-ghost"><X size={20} /></button>
        </div>
        <div style={{ height: '1px', background: 'var(--gold)', opacity: 0.3 }} />

        {fetchLoading ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <Loader2 className="animate-spin" color="var(--gold)" size={32} />
          </div>
        ) : (
          <form
            style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}
            onSubmit={handleSubmit}
          >
            {/* ── Cliente & Veículo ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="label-gold">Cliente</label>
                <select
                  value={formData.cliente_id}
                  onChange={e => setFormData(prev => ({ ...prev, cliente_id: e.target.value, veiculo_id: '' }))}
                  disabled={isConvertingAgendamento}
                  style={selectStyle}
                >
                  <option value="">Selecionar cliente... ({clients.length})</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.nome}{c.telefone ? ` — ${c.telefone}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="label-gold">Veículo</label>
                <select
                  value={formData.veiculo_id}
                  onChange={e => setFormData(prev => ({ ...prev, veiculo_id: e.target.value }))}
                  disabled={!formData.cliente_id || isConvertingAgendamento}
                  style={{ ...selectStyle, opacity: !formData.cliente_id ? 0.5 : 1 }}
                >
                  <option value="">Selecionar veículo...</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.marca} {v.modelo} {v.placa}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ── Serviços ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="label-gold">Serviços Disponíveis</label>
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '12px',
                border: '1px solid var(--border)', borderRadius: '8px', backgroundColor: 'var(--bg-page)',
              }}>
                {services.map(s => {
                  const sel = (formData.servicos_ids ?? []).includes(s.id);
                  return (
                    <button
                      type="button" key={s.id}
                      onClick={() => handleServiceToggle(s.id)}
                      style={{
                        padding: '6px 14px', borderRadius: '999px',
                        border: sel ? '1px solid #C9A84C' : '1px solid #2E2E2E',
                        background: sel ? 'rgba(201,168,76,0.15)' : '#171717',
                        color: sel ? '#C9A84C' : '#A8A8A8',
                        cursor: 'pointer', fontSize: '13px',
                        fontWeight: sel ? 600 : 400, transition: 'all 0.2s',
                      }}
                    >
                      {s.nome}
                    </button>
                  );
                })}
              </div>
              <p style={{ color: '#C9A84C', fontWeight: 600, marginTop: '4px', fontSize: '14px' }}>
                Total estimado ({porteDoVeiculo}): R$ {(formData.valor_total ?? 0).toFixed(2)}
              </p>
            </div>

            {/* ── Data / Hora ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="label-gold">Data de Entrada</label>
                <input type="date" className="input-field" style={{ backgroundColor: 'var(--bg-page)' }}
                  value={formData.data_entrada}
                  onChange={e => setFormData(prev => ({ ...prev, data_entrada: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="label-gold">Hora de Entrada</label>
                <input type="time" className="input-field" style={{ backgroundColor: 'var(--bg-page)' }}
                  value={formData.hora_entrada}
                  onChange={e => setFormData(prev => ({ ...prev, hora_entrada: e.target.value }))} />
              </div>
            </div>

            {/* ── Observações ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="label-gold">Observações</label>
              <textarea className="input-field"
                style={{ height: '80px', resize: 'none', backgroundColor: 'var(--bg-page)' }}
                placeholder="Detalhes adicionais..."
                value={formData.observacoes}
                onChange={e => setFormData(prev => ({ ...prev, observacoes: e.target.value }))} />
            </div>

            {/* ── Ações ── */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '12px' }}>
              <button type="button" onClick={closeNewOSModal} className="btn-ghost" disabled={loading}>Cancelar</button>
              <button type="submit" className="btn-primary" style={{ padding: '12px 32px' }} disabled={loading}>
                {loading ? 'Processando...' : 'Criar OS'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default NewOSModal;
