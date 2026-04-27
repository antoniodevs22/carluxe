import { useState, useEffect } from 'react';
import { Search, Eye, Edit2, Plus, Loader2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import { supabase } from '@carluxe/shared';

const WhatsAppIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const Clientes = () => {
  const { openNewClientModal, openEditClientModal } = useModal();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [clienteParaRemover, setClienteParaRemover] = useState(null);

  const formatarWhatsApp = (telefone) => {
    if (!telefone) return '';
    const numeros = telefone.replace(/\D/g, '');
    const comDDI = numeros.startsWith('55') ? numeros : `55${numeros}`;
    return `https://wa.me/${comDDI}`;
  };

  const confirmarRemocao = (cliente) => {
    setClienteParaRemover(cliente);
  };

  const executarRemocao = async () => {
    if (!clienteParaRemover) return;
    
    try {
      // 1. Buscar veículos
      const { data: veiculos } = await supabase
        .from('veiculos')
        .select('id')
        .eq('cliente_id', clienteParaRemover.id);
      
      const veiculoIds = veiculos?.map(v => v.id) ?? [];
      
      // 2. Buscar OS
      const { data: ordens } = await supabase
        .from('ordens_servico')
        .select('id')
        .eq('cliente_id', clienteParaRemover.id);
      
      const osIds = ordens?.map(o => o.id) ?? [];
      
      // 3. Deletar os_servicos
      if (osIds.length > 0) {
        await supabase.from('os_servicos').delete().in('os_id', osIds);
      }
      
      // 4. Deletar ordens_servico
      await supabase.from('ordens_servico').delete().eq('cliente_id', clienteParaRemover.id);
      
      // 5. Deletar agendamentos
      await supabase.from('agendamentos').delete().eq('cliente_id', clienteParaRemover.id);
      
      // 6. Deletar veículos
      await supabase.from('veiculos').delete().eq('cliente_id', clienteParaRemover.id);
      
      // 7. Deletar cliente
      await supabase.from('clientes').delete().eq('id', clienteParaRemover.id);
      
      alert('Cliente removido com sucesso!');
      setClienteParaRemover(null);
      fetchClientes();
      
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
      alert('Erro ao remover cliente');
    }
  };

  const fetchClientes = async () => {
    try {
      setLoading(true);
      // Busca clientes e conta quantos veículos e OS cada um tem
      const { data: clientsData, error } = await supabase
        .from('clientes')
        .select(`
          *,
          veiculos (id),
          ordens_servico (id, criado_em)
        `)
        .order('nome');

      if (error) throw error;
      setClientes(clientsData || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
    
    // Realtime sync
    const channel = supabase.channel('clientes_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clientes' }, () => {
        fetchClientes();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const filteredClientes = clientes.filter(c => 
    c.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.telefone?.includes(searchTerm)
  );

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* TopBar Extra */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou telefone..." 
              className="input-field" 
              style={{ paddingLeft: '48px', backgroundColor: 'var(--bg-surface)' }} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-primary" onClick={openNewClientModal}>
            <Plus size={18} />
            Novo cliente
          </button>
        </div>

        {/* Tabela */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <Loader2 size={24} className="animate-spin" style={{ color: 'var(--gold)' }} />
              <p style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>Carregando clientes...</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Telefone</th>
                  <th>E-mail</th>
                  <th>Veículos</th>
                  <th>Total OS</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredClientes.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      Nenhum cliente encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredClientes.map((row) => (
                    <tr key={row.id}>
                      <td style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{row.nome}</td>
                      <td>
                        <a 
                          href={formatarWhatsApp(row.telefone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#25D366', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                          onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                          onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                        >
                          <WhatsAppIcon />
                          {row.telefone}
                        </a>
                      </td>
                      <td>{row.email || '—'}</td>
                      <td>{row.veiculos?.length || 0} veículo(s)</td>
                      <td>{row.ordens_servico?.length || 0} OS</td>
                      <td>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <Link 
                            to={`/clientes/${row.id}`}
                            className="btn-ghost" 
                            title="Ver Detalhes"
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <Eye size={18} />
                          </Link>
                          <button
                            onClick={() => confirmarRemocao(row)}
                            title="Remover cliente"
                            style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                          >
                            <Trash2 size={18} />
                          </button>
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

      {/* Modal de Confirmação */}
      {clienteParaRemover && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#222222', border: '1px solid #EF4444', borderRadius: '12px', padding: '32px', maxWidth: '440px', width: '90%' }}>
            <h3 style={{ color: '#F0EDE8', marginBottom: '8px' }}>Remover cliente?</h3>
            <p style={{ color: '#A8A8A8', marginBottom: '8px' }}>
              Você está prestes a remover <strong style={{ color: '#F0EDE8' }}>{clienteParaRemover.nome}</strong>.
            </p>
            <p style={{ color: '#EF4444', fontSize: '13px', marginBottom: '24px' }}>
              ⚠️ Esta ação removerá permanentemente todos os veículos e ordens de serviço vinculados a este cliente.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setClienteParaRemover(null)} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #2E2E2E', color: '#A8A8A8', borderRadius: '8px', cursor: 'pointer' }}>
                Cancelar
              </button>
              <button onClick={executarRemocao} style={{ padding: '10px 20px', background: '#EF4444', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                Sim, remover
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Clientes;
