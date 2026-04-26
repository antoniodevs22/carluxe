import { useState, useEffect } from 'react';
import { Search, Check, ArrowRight, X, Calendar as CalendarIcon } from 'lucide-react';
import { useModal } from '../context/ModalContext';
import { supabase } from '@carluxe/shared';

const Agendamentos = () => {
  const { openNewOSModal } = useModal();
  const [activeTab, setActiveTab] = useState('pendente');
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const fetchAgendamentos = async () => {
    setLoading(true);
    try {
      // 1. Fetch agendamentos with joins
      const { data: agendData, error } = await supabase
        .from('agendamentos')
        .select(`
          *,
          cliente:clientes(nome, telefone),
          veiculo:veiculos(marca, modelo, porte, placa)
        `)
        .order('data_hora', { ascending: true });

      if (error) throw error;

      // 2. Fetch services names
      const { data: servicesData } = await supabase.from('servicos').select('id, nome');
      
      const formatted = agendData.map(a => ({
        ...a,
        serviceNames: a.servicos_ids?.map(id => servicesData?.find(s => s.id === id)?.nome).filter(Boolean).join(', ') || 'Sem serviços'
      }));

      setAgendamentos(formatted);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgendamentos();

    const channel = supabase
      .channel('agendamentos_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agendamentos' }, () => {
        fetchAgendamentos();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('agendamentos')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      const messages = {
        confirmado: 'Agendamento confirmado!',
        cancelado: 'Agendamento cancelado!',
        convertido: 'Agendamento convertido em OS!'
      };
      
      alert(messages[newStatus] || 'Status atualizado!');
    } catch (error) {
      alert('Erro ao atualizar status: ' + error.message);
    }
  };

  const handleCancel = (id) => {
    if (window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
      handleStatusUpdate(id, 'cancelado');
    }
  };

  const filteredAgendamentos = agendamentos.filter(item => {
    // Pendentes -> status = 'pendente'
    // Confirmados -> status = 'confirmado'
    // Todos -> todos exceto convertido (para não poluir)
    if (activeTab === 'pendente') return item.status === 'pendente';
    if (activeTab === 'confirmado') return item.status === 'confirmado';
    if (activeTab === 'todos') return item.status !== 'convertido';
    
    return true;
  }).filter(item => {
    const matchesSearch = 
      item.cliente?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.veiculo?.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.veiculo?.placa?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !filterDate || item.data_hora.startsWith(filterDate);

    return matchesSearch && matchesDate;
  });

  const counts = {
    pendente: agendamentos.filter(a => a.status === 'pendente').length,
    confirmado: agendamentos.filter(a => a.status === 'confirmado').length,
    todos: agendamentos.filter(a => a.status !== 'convertido').length
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid var(--border)' }}>
        {[
          { id: 'pendente', label: `Pendentes (${counts.pendente})` },
          { id: 'confirmado', label: `Confirmados (${counts.confirmado})` },
          { id: 'todos', label: `Todos (${counts.todos})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 0',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--gold)' : '2px solid transparent',
              color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === tab.id ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s',
              opacity: activeTab === tab.id ? 1 : 0.6
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Buscar agendamento..." 
            className="input-field" 
            style={{ paddingLeft: '40px', backgroundColor: 'var(--bg-surface)' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ position: 'relative' }}>
          <input 
            type="date" 
            className="input-field" 
            style={{ width: '180px', backgroundColor: 'var(--bg-surface)', paddingLeft: '40px' }}
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          <CalendarIcon size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>
      </div>

      {/* Tabela */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Carregando agendamentos...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>Cliente</th>
                <th>Veículo</th>
                <th>Serviços</th>
                <th>Valor Est.</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgendamentos.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    Nenhum agendamento encontrado nesta categoria.
                  </td>
                </tr>
              ) : (
                filteredAgendamentos.map((row) => (
                  <tr key={row.id}>
                    <td style={{ color: 'var(--gold)', fontWeight: '500' }}>{formatDateTime(row.data_hora)}</td>
                    <td>
                      <p style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{row.cliente?.nome || 'N/A'}</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{row.cliente?.telefone}</p>
                    </td>
                    <td>
                      <p>{row.veiculo?.modelo || 'N/A'}</p>
                      <p style={{ fontSize: '11px', color: 'var(--gold)' }}>{row.veiculo?.placa}</p>
                    </td>
                    <td style={{ maxWidth: '200px' }}>
                      <p style={{ fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={row.serviceNames}>
                        {row.serviceNames}
                      </p>
                    </td>
                    <td>{row.valor_estimado ? `R$ ${row.valor_estimado.toFixed(2)}` : '---'}</td>
                    <td>
                      <span className={`badge badge-status-${row.status === 'pendente' ? 'entrada' : row.status === 'confirmado' ? 'pronto' : 'cancelado'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {row.status === 'pendente' && (
                          <button 
                            className="btn-secondary" 
                            style={{ padding: '6px', borderColor: 'var(--status-pronto)', color: 'var(--status-pronto)' }} 
                            title="Confirmar Agendamento"
                            onClick={() => handleStatusUpdate(row.id, 'confirmado')}
                          >
                            <Check size={14} />
                          </button>
                        )}
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '6px' }} 
                          title="Converter em OS" 
                          onClick={() => openNewOSModal(row)}
                        >
                          <ArrowRight size={14} />
                        </button>
                        {row.status !== 'cancelado' && (
                          <button 
                            className="btn-secondary" 
                            style={{ padding: '6px', borderColor: 'var(--status-cancelado)', color: 'var(--status-cancelado)' }} 
                            title="Cancelar Agendamento"
                            onClick={() => handleCancel(row.id)}
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Agendamentos;
