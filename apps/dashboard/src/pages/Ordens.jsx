import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Camera, Plus, Loader2 } from 'lucide-react';
import { useModal } from '../context/ModalContext';
import { supabase } from '@carluxe/shared';

const KanbanCard = ({ id, client, car, services, date, size, hasPhotos, onDragStart }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="card" 
      draggable
      onDragStart={(e) => onDragStart(e, id)}
      onClick={() => navigate(`/ordens/${id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        padding: '16px', 
        marginBottom: '16px', 
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        border: isHovered ? '1px solid #C9A84C' : '0.5px solid #2E2E2E',
        boxShadow: isHovered ? '0 4px 12px rgba(201, 168, 76, 0.15)' : 'none'
      }} 
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ 
          backgroundColor: 'var(--border)', 
          color: 'var(--text-secondary)', 
          padding: '2px 8px', 
          borderRadius: '4px', 
          fontSize: '11px',
          fontWeight: '600'
        }}>
          {size}
        </span>
        {hasPhotos && <Camera size={14} style={{ color: 'var(--gold)' }} />}
      </div>
      
      <p style={{ color: 'var(--text-primary)', fontWeight: '500', marginBottom: '4px' }}>{client}</p>
      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '12px' }}>{car}</p>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
        {services?.map((s, i) => (
          <span key={i} style={{ 
            border: '1px solid rgba(201, 168, 76, 0.2)', 
            color: 'var(--gold)', 
            padding: '2px 8px', 
            borderRadius: '4px', 
            fontSize: '10px',
            textTransform: 'uppercase'
          }}>
            {s}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{date}</span>
        <div style={{ 
          width: '24px', 
          height: '24px', 
          borderRadius: '50%', 
          backgroundColor: 'var(--gold)', 
          color: '#0D0D0D', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '10px',
          fontWeight: 'bold'
        }}>
          {(client || 'U').charAt(0)}
        </div>
      </div>
    </div>
  );
};

const KanbanColumn = ({ id, title, color, count, cards, onAdd, onDrop, onDragStart }) => {
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDrop={(e) => onDrop(e, id)}
      style={{ 
        flex: 1, 
        minWidth: '280px', 
        backgroundColor: 'var(--bg-page)', 
        borderRadius: '12px', 
        border: '0.5px solid var(--border)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ 
        height: '4px', 
        width: '100%', 
        backgroundColor: color, 
        borderRadius: '4px 4px 0 0' 
      }}></div>
      
      <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '15px', color: 'var(--text-primary)' }}>{title}</h3>
        <span style={{ 
          backgroundColor: `${color}20`, 
          color: color, 
          width: '24px', 
          height: '24px', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          {count}
        </span>
      </div>

      <div style={{ padding: '0 16px', flex: 1, overflowY: 'auto' }}>
        {cards.map((card) => (
          <KanbanCard key={card.id} {...card} onDragStart={onDragStart} />
        ))}
      </div>

      <div style={{ padding: '16px' }}>
        <button 
          onClick={onAdd}
          style={{ 
          width: '100%', 
          padding: '12px', 
          backgroundColor: 'transparent', 
          border: '1px dashed var(--border)', 
          borderRadius: '8px',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
};

const Ordens = () => {
  const { openNewOSModal } = useModal();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEntregues, setShowEntregues] = useState(false);
  const [periodo, setPeriodo] = useState('todas');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('ordens_servico')
        .select(`
          id, status, data_entrada, criado_em,
          clientes (id, nome, telefone),
          veiculos (id, marca, modelo, placa, porte),
          os_servicos (id, preco_aplicado, servicos (id, nome))
        `)
        .order('data_entrada', { ascending: false });

      if (!showEntregues) {
        query = query.not('status', 'in', '("entregue","cancelado")');
      } else {
        query = query.neq('status', 'cancelado');
      }

      const { data, error } = await query;

      if (error) throw error;

      // Aplicar filtro de período no frontend
      let resultado = data ?? [];
      
      if (periodo === 'hoje') {
        const hoje = new Date().toDateString();
        resultado = resultado.filter(o => 
          new Date(o.data_entrada || o.criado_em).toDateString() === hoje
        );
      } else if (periodo === 'semana') {
        const seteDias = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        resultado = resultado.filter(o => 
          new Date(o.data_entrada || o.criado_em) >= seteDias
        );
      } else if (periodo === 'mes') {
        const trintaDias = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        resultado = resultado.filter(o => 
          new Date(o.data_entrada || o.criado_em) >= trintaDias
        );
      }

      const formatted = resultado.map(o => ({
        id: o.id,
        status: o.status,
        client: o.clientes?.nome || 'Cliente Restrito',
        car: o.veiculos ? `${o.veiculos.marca} ${o.veiculos.modelo}` : 'Veículo Restrito',
        services: o.os_servicos?.map(os => os.servicos?.nome).filter(Boolean) || ['Serviço Geral'],
        date: new Date(o.data_entrada || o.criado_em).toLocaleDateString(),
        size: o.veiculos?.porte || 'MÉDIO',
        hasPhotos: false
      }));

      setOrders(formatted);
    } catch (error) {
      console.error('Erro ao buscar OS:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const channel = supabase.channel('ordens_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ordens_servico' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [showEntregues, periodo]);

  const handleDragStart = (e, orderId) => {
    e.dataTransfer.setData('orderId', orderId);
  };

  const handleDrop = async (e, newStatus) => {
    const orderId = e.dataTransfer.getData('orderId');
    
    // Otimismo na UI
    const previousOrders = [...orders];
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

    try {
      const updatePayload = { status: newStatus };
      if (newStatus === 'entregue') {
        updatePayload.data_saida = new Date().toISOString();
      }

      const { error } = await supabase
        .from('ordens_servico')
        .update(updatePayload)
        .eq('id', orderId);

      if (error) throw error;
      
      // Recarrega os dados após o update
      fetchOrders();
    } catch (error) {
      setOrders(previousOrders);
      alert('Erro ao mover OS: ' + error.message);
    }
  };

  const columns = [
    { id: 'entrada', title: 'Entrada', color: '#3B82F6' },
    { id: 'execucao', title: 'Em Execução', color: '#F59E0B' },
    { id: 'finalizacao', title: 'Finalização', color: '#F97316' },
    { id: 'pronto', title: 'Pronto ✓', color: '#22C55E' },
  ];

  if (showEntregues) {
    columns.push({ id: 'entregue', title: 'Entregue', color: '#64748b' });
  }

  const filteredOrders = orders.filter(o => 
    o.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.car?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Filtros */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '16px', flex: 1, alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Buscar por cliente, placa..." 
              className="input-field" 
              style={{ paddingLeft: '40px', backgroundColor: 'var(--bg-surface)' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>
            <input 
              type="checkbox" 
              id="showEntregues" 
              checked={showEntregues} 
              onChange={(e) => setShowEntregues(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <label htmlFor="showEntregues" style={{ cursor: 'pointer' }}>Ver entregues</label>
          </div>

          <select 
            className="input-field" 
            style={{ width: '150px', backgroundColor: 'var(--bg-surface)' }}
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
          >
            <option value="hoje">Hoje</option>
            <option value="semana">Esta semana</option>
            <option value="mes">Este mês</option>
            <option value="todas">Todas</option>
          </select>
        </div>
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{filteredOrders.length} ordens</p>
        )}
      </div>

      {/* Kanban Board */}
      <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px' }}>
        {columns.map(col => (
          <KanbanColumn 
            key={col.id}
            id={col.id}
            title={col.title}
            color={col.color}
            count={filteredOrders.filter(o => o.status === col.id).length}
            cards={filteredOrders.filter(o => o.status === col.id)}
            onAdd={openNewOSModal}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
          />
        ))}
      </div>
    </div>
  );
};

export default Ordens;
