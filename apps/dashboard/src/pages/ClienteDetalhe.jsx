import { useState, useEffect } from 'react';
import { ChevronLeft, User, Car, Phone, Mail, MapPin, History } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import { supabase } from '@carluxe/shared';

const ClienteDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openEditClientModal, openNewVehicleModal } = useModal();
  
  const [cliente, setCliente] = useState(null);
  const [veiculos, setVeiculos] = useState([]);
  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Buscar dados reais do cliente
      const { data: clienteData, error: clienteError } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', id)
        .single();

      if (clienteError || !clienteData) {
        navigate('/clientes');
        return;
      }
      setCliente(clienteData);

      // 2. Buscar veículos reais do cliente
      const { data: veiculosData } = await supabase
        .from('veiculos')
        .select('*')
        .eq('cliente_id', id)
        .order('criado_em', { ascending: false });
      setVeiculos(veiculosData || []);

      // 3. Buscar histórico real de OS do cliente
      const { data: ordensData } = await supabase
        .from('ordens_servico')
        .select(`
          id,
          status,
          valor_total,
          data_entrada,
          data_saida,
          os_servicos (
            servicos ( nome )
          )
        `)
        .eq('cliente_id', id)
        .order('data_entrada', { ascending: false });
      setOrdens(ordensData || []);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Carregando dados...</div>;
  }

  if (!cliente) return null;

  const isRecurrent = ordens.length >= 3;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/clientes" className="btn-ghost" style={{ display: 'flex', alignItems: 'center' }}>
            <ChevronLeft size={24} />
          </Link>
          <h2 style={{ fontSize: '22px' }}>{cliente.nome}</h2>
          {isRecurrent && (
            <span className="badge" style={{ backgroundColor: 'rgba(201, 168, 76, 0.1)', color: 'var(--gold)', border: '1px solid rgba(201, 168, 76, 0.2)' }}>
              CLIENTE RECORRENTE
            </span>
          )}
        </div>
        <button className="btn-secondary" onClick={() => openEditClientModal(cliente)}>Editar Perfil</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '40% 60%', gap: '24px' }}>
        {/* Coluna Esquerda - Perfil e Veículos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Card Dados */}
          <div className="card">
            <h3 className="label-gold" style={{ marginBottom: '20px' }}>Dados do Cliente</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Phone size={16} color="var(--text-muted)" />
                <a
                  href={`https://wa.me/${(() => { const n = (cliente.telefone || '').replace(/\D/g, ''); return n.startsWith('55') ? n : '55' + n; })()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#25D366', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px' }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  {cliente.telefone}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Mail size={16} color="var(--text-muted)" />
                <span>{cliente.email || 'Não informado'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MapPin size={16} color="var(--text-muted)" />
                <span style={{ fontSize: '13px' }}>{cliente.endereco || 'Endereço não cadastrado'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <User size={16} color="var(--text-muted)" />
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Cliente desde {new Date(cliente.criado_em).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {/* Card Veículos */}
          <div className="card">
            <h3 className="label-gold" style={{ marginBottom: '20px' }}>Veículos Cadastrados</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {veiculos.length === 0 ? (
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
                  Nenhum veículo cadastrado.
                </p>
              ) : (
                veiculos.map((v) => (
                  <div key={v.id} style={{ 
                    backgroundColor: 'var(--bg-page)', 
                    padding: '16px', 
                    borderRadius: '8px', 
                    border: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Car size={20} color="var(--gold)" />
                      <div>
                        <p style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{v.modelo} {v.marca}</p>
                        <p style={{ fontSize: '12px', color: 'var(--gold)' }}>{v.placa}</p>
                      </div>
                    </div>
                    <span style={{ backgroundColor: 'var(--border)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>{v.porte}</span>
                  </div>
                ))
              )}
              <button 
                className="btn-ghost" 
                style={{ fontSize: '13px', marginTop: '8px', color: 'var(--gold)' }}
                onClick={() => openNewVehicleModal(cliente.id)}
              >
                + Adicionar veículo
              </button>
            </div>
          </div>
        </div>

        {/* Coluna Direita - Histórico */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 className="label-gold">Histórico de Ordens de Serviço</h3>
            <History size={18} color="var(--text-muted)" />
          </div>

          {ordens.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              Nenhum serviço realizado ainda
            </div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: 'hidden', backgroundColor: 'var(--bg-page)' }}>
              <table>
                <thead>
                  <tr>
                    <th>OS#</th>
                    <th>Data</th>
                    <th>Serviço Principal</th>
                    <th>Valor</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ordens.map((os) => {
                    const servicoPrincipal = os.os_servicos?.[0]?.servicos?.nome ?? 'Serviço não especificado';
                    const numeroOS = `#${os.id.slice(-4).toUpperCase()}`;
                    const data = new Date(os.data_entrada).toLocaleDateString('pt-BR');
                    
                    return (
                      <tr key={os.id}>
                        <td>
                          <Link to={`/ordens/${os.id}`} style={{ color: 'var(--gold)', fontWeight: '600', textDecoration: 'none' }}>
                            {numeroOS}
                          </Link>
                        </td>
                        <td>{data}</td>
                        <td style={{ color: 'var(--text-primary)' }}>
                          {servicoPrincipal}
                          {os.os_servicos?.length > 1 && ` (+${os.os_servicos.length - 1})`}
                        </td>
                        <td>
                          {os.valor_total 
                            ? `R$ ${os.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` 
                            : 'A definir'
                          }
                        </td>
                        <td>
                          <span className={`badge badge-status-${os.status.toLowerCase()}`}>{os.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClienteDetalhe;
