import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  CheckCircle, 
  Calendar, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { useModal } from '../context/ModalContext';
import { supabase } from '@carluxe/shared';

const MetricCard = ({ icon: Icon, color, label, value, description }) => (
  <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ 
        width: '40px', 
        height: '40px', 
        borderRadius: '50%', 
        backgroundColor: 'var(--border)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'var(--gold)'
      }}>
        <Icon size={20} style={{ color: color }} />
      </div>
      <span className="label-gold">{label}</span>
    </div>
    <div>
      <h2 style={{ fontSize: '40px', fontWeight: '600' }}>{value}</h2>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{description}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { openNewOSModal, openConfirmDeliveryModal } = useModal();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    osAbertas: 0,
    prontas: 0,
    agendamentosHoje: 0,
    estoqueCritico: 0
  });
  const [agendamentosHoje, setAgendamentosHoje] = useState([]);
  const [prontasEntrega, setProntasEntrega] = useState([]);
  const [estoqueCritico, setEstoqueCritico] = useState([]);
  const [ultimasOS, setUltimasOS] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().split('T')[0];
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString().split('T')[0];

      // 1. Agendamentos de Hoje (Resiliente)
      const { data: agendData } = await supabase
        .from('agendamentos')
        .select('*')
        .gte('data_hora', `${today}T00:00:00`)
        .lt('data_hora', `${tomorrow}T00:00:00`)
        .in('status', ['pendente', 'confirmado'])
        .order('data_hora', { ascending: true });
      
      if (agendData) {
        const clientIds = [...new Set(agendData.map(a => a.cliente_id))];
        const veiculoIds = [...new Set(agendData.map(a => a.veiculo_id))];
        
        const { data: clientNames } = await supabase.from('clientes').select('id, nome').in('id', clientIds);
        const { data: vehicleNames } = await supabase.from('veiculos').select('id, modelo').in('id', veiculoIds);
        
        const fullAgend = agendData.map(a => ({
          ...a,
          cliente: clientNames?.find(c => c.id === a.cliente_id),
          veiculo: { modelo: vehicleNames?.find(v => v.id === a.veiculo_id)?.modelo }
        }));
        setAgendamentosHoje(fullAgend);
      }

      // 2. OS Abertas
      const { count: osCount } = await supabase
        .from('ordens_servico')
        .select('*', { count: 'exact', head: true })
        .not('status', 'in', '("entregue","cancelado")');

      // 3. Prontas para Entrega (Resiliente)
      const { data: prontasData, count: prontasCount } = await supabase
        .from('ordens_servico')
        .select('*', { count: 'exact' })
        .eq('status', 'pronto');
      
      if (prontasData) {
        const clientIds = [...new Set(prontasData.map(o => o.cliente_id))];
        const veiculoIds = [...new Set(prontasData.map(o => o.veiculo_id))];
        
        const { data: clientNames } = await supabase.from('clientes').select('id, nome').in('id', clientIds);
        const { data: vehicleNames } = await supabase.from('veiculos').select('id, modelo').in('id', veiculoIds);
        
        const fullProntas = prontasData.map(o => ({
          ...o,
          cliente: clientNames?.find(c => c.id === o.cliente_id),
          veiculo: { modelo: vehicleNames?.find(v => v.id === o.veiculo_id)?.modelo }
        }));
        setProntasEntrega(fullProntas);
      }

      // 5. Últimas OS (Resiliente)
      const { data: lastOSData } = await supabase
        .from('ordens_servico')
        .select('*')
        .order('criado_em', { ascending: false })
        .limit(5);
      
      if (lastOSData) {
        const clientIds = [...new Set(lastOSData.map(o => o.cliente_id))];
        const veiculoIds = [...new Set(lastOSData.map(o => o.veiculo_id))];
        
        const { data: clientNames } = await supabase.from('clientes').select('id, nome').in('id', clientIds);
        const { data: vehicleNames } = await supabase.from('veiculos').select('id, marca, modelo').in('id', veiculoIds);
        
        const fullOS = lastOSData.map(o => ({
          ...o,
          cliente: clientNames?.find(c => c.id === o.cliente_id),
          veiculo: vehicleNames?.find(v => v.id === o.veiculo_id)
        }));
        setUltimasOS(fullOS);
      }

      // 4. Estoque Crítico — buscar todos e filtrar no frontend
      const { data: insumosData } = await supabase
        .from('insumos')
        .select('id, nome, unidade, quantidade_atual, quantidade_minima');

      console.log('insumos fetch result:', insumosData);

      const criticos = (insumosData ?? []).filter(i =>
        parseFloat(i.quantidade_atual) < parseFloat(i.quantidade_minima)
      );
      setEstoqueCritico(criticos);

      setMetrics({
        osAbertas: osCount || 0,
        prontas: prontasCount || 0,
        agendamentosHoje: agendData?.length || 0,
        estoqueCritico: criticos.length
      });

    } catch (error) {
      console.error('Erro ao carregar dashboard:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeliver = (item) => {
    openConfirmDeliveryModal(item);
  };

  const handleRestock = async (insumoId, min) => {
    try {
      const { error } = await supabase
        .from('insumos')
        .update({ quantidade_atual: min + 10 })
        .eq('id', insumoId);
      if (error) throw error;
    } catch (error) {
      alert('Erro ao repor estoque: ' + error.message);
    }
  };

  useEffect(() => {
    fetchData();

    // Sincronização em tempo real para múltiplas tabelas
    const channel = supabase.channel('dashboard_sync')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        fetchData();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Grid de Métricas */}
      <div style={{ display: 'flex', gap: '24px' }}>
        <MetricCard 
          icon={ClipboardList} 
          color="#3B82F6" 
          label="OS Abertas" 
          value={metrics.osAbertas} 
          description="em andamento hoje" 
        />
        <MetricCard 
          icon={CheckCircle} 
          color="#22C55E" 
          label="Prontas p/ Entrega" 
          value={metrics.prontas} 
          description="aguardando retirada" 
        />
        <MetricCard 
          icon={Calendar} 
          color="#F59E0B" 
          label="Agendamentos Hoje" 
          value={metrics.agendamentosHoje} 
          description="confirmados e pendentes" 
        />
        <MetricCard 
          icon={AlertTriangle} 
          color="#EF4444" 
          label="Alertas de Estoque" 
          value={estoqueCritico.length} 
          description="insumos abaixo do mínimo" 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '60% 40%', gap: '24px' }}>
        {/* Coluna Esquerda */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Agendamentos */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 className="label-gold">Agendamentos de Hoje</h3>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {agendamentosHoje.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>Nenhum agendamento para hoje.</p>
              ) : agendamentosHoje.map((item, idx) => (
                <div key={idx} style={{ 
                  backgroundColor: 'var(--bg-page)', 
                  padding: '16px', 
                  borderRadius: '8px', 
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--gold)', fontWeight: '600' }}>{formatTime(item.data_hora)}</span>
                    <div>
                      <p style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{item.cliente?.nome}</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.veiculo?.modelo}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span className={`badge badge-status-${item.status === 'pendente' ? 'entrada' : 'pronto'}`}>
                      {item.status}
                    </span>
                    <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => openNewOSModal(item)}>
                      Converter em OS
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prontas para Entrega */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h3 className="label-gold">Prontas para Entrega</h3>
                <span className="badge badge-status-pronto" style={{ borderRadius: '4px' }}>{metrics.prontas}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {prontasEntrega.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>Nenhum veículo pronto.</p>
              ) : prontasEntrega.map((item, idx) => (
                <div key={idx} style={{ 
                  backgroundColor: 'var(--bg-page)', 
                  padding: '16px', 
                  borderRadius: '8px', 
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <p style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{item.cliente?.nome}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.veiculo?.modelo}</p>
                  </div>
                  <button 
                    className="btn-secondary" 
                    style={{ 
                      borderColor: 'var(--status-pronto)', 
                      color: 'var(--status-pronto)', 
                      padding: '8px 16px',
                      fontSize: '12px'
                    }}
                    onClick={() => handleDeliver(item)}
                  >
                    Registrar entrega
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna Direita */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Alertas de Estoque */}
          <div className="card">
            <h3 className="label-gold" style={{ color: 'var(--estoque-critico)', marginBottom: '24px' }}>Estoque Crítico</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {estoqueCritico.length === 0 ? (
                <p style={{ color: '#5E5E5E', textAlign: 'center' }}>Estoque em dia.</p>
              ) : (
                estoqueCritico.map(insumo => (
                  <div key={insumo.id} style={{ padding: '12px 0', borderBottom: '1px solid #2E2E2E' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ color: '#F0EDE8', fontWeight: 500, margin: 0 }}>{insumo.nome}</p>
                        <p style={{ color: '#EF4444', fontSize: '12px', margin: '4px 0 0' }}>
                          {insumo.quantidade_atual}{insumo.unidade} / mín {insumo.quantidade_minima}{insumo.unidade}
                        </p>
                        <div style={{ width: '120px', height: '4px', background: '#2E2E2E', borderRadius: '2px', marginTop: '6px' }}>
                          <div style={{
                            width: `${Math.min((parseFloat(insumo.quantidade_atual) / parseFloat(insumo.quantidade_minima)) * 100, 100)}%`,
                            height: '100%', background: '#EF4444', borderRadius: '2px'
                          }} />
                        </div>
                      </div>
                      <a href="/insumos" style={{ color: '#EF4444', fontSize: '12px', border: '1px solid #EF4444', padding: '4px 10px', borderRadius: '6px', textDecoration: 'none' }}>
                        Repor →
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Últimas OS */}
      <div className="card">
        <h3 className="label-gold" style={{ marginBottom: '24px' }}>Últimas Ordens de Serviço</h3>
        <table>
          <thead>
            <tr>
              <th>OS#</th>
              <th>Cliente</th>
              <th>Veículo</th>
              <th>Status</th>
              <th>Data entrada</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {ultimasOS.map((os) => (
              <tr key={os.id}>
                <td>{os.id.substring(0, 4)}</td>
                <td style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{os.cliente?.nome}</td>
                <td>{os.veiculo?.marca} {os.veiculo?.modelo}</td>
                <td>
                  <span className={`badge badge-status-${os.status}`}>{os.status}</span>
                </td>
                <td>{new Date(os.criado_em).toLocaleDateString()}</td>
                <td>
                  <button 
                    onClick={() => navigate(`/ordens/${os.id}`)}
                    style={{ 
                      background: 'transparent',
                      border: '1px solid #2E2E2E',
                      color: '#C9A84C',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    Ver <ArrowRight size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
