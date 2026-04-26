import { AlertTriangle, Package, Edit2, Plus, ArrowUpRight, ArrowDownRight, Trash2 } from 'lucide-react';
import { useModal } from '../context/ModalContext';

const Insumos = () => {
  const { openNewInsumoModal, openEditInsumoModal } = useModal();

  const handleStockAction = (type, name) => {
    const qty = prompt(`Quantidade de ${type} para ${name}:`, "1");
    if (qty) {
      alert(`${type} de ${qty} registrado para ${name}!`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Resumo e Botão Novo */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px' }}>
        <div style={{ display: 'flex', gap: '24px', flex: 1 }}>
          <div className="card" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ 
              width: '48px', height: '48px', borderRadius: '12px', 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--estoque-critico)' 
            }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '32px', color: 'var(--estoque-critico)' }}>2</h2>
              <p className="label-gold" style={{ fontSize: '10px' }}>Insumos Críticos</p>
            </div>
          </div>
          <div className="card" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ 
              width: '48px', height: '48px', borderRadius: '12px', 
              backgroundColor: 'rgba(201, 168, 76, 0.1)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' 
            }}>
              <Package size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '32px' }}>14</h2>
              <p className="label-gold" style={{ fontSize: '10px' }}>Total de Insumos</p>
            </div>
          </div>
        </div>
        <button 
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
          onClick={openNewInsumoModal}
        >
          <Plus size={18} />
          Novo Insumo
        </button>
      </div>

      {/* Tabela */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Unidade</th>
              <th>Qtd Atual</th>
              <th>Qtd Mínima</th>
              <th>Situação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Cera Carnaúba', unit: 'litro', current: 0.3, min: 1.0, percent: 30, critical: true },
              { name: 'Shampoo Neutro', unit: 'litro', current: 0.8, min: 2.0, percent: 40, critical: true },
              { name: 'Clay Bar', unit: 'unid', current: 5, min: 3, percent: 100, critical: false },
              { name: 'Alcool Isopropílico', unit: 'litro', current: 3.5, min: 2.0, percent: 100, critical: false },
              { name: 'Microfibra Premium', unit: 'unid', current: 12, min: 10, percent: 100, critical: false },
              { name: 'Espuma de Polimento', unit: 'unid', current: 2, min: 5, percent: 40, critical: true },
            ].map((row, idx) => (
              <tr key={idx} style={{ backgroundColor: row.critical ? 'rgba(239, 68, 68, 0.05)' : '' }}>
                <td style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{row.name}</td>
                <td>{row.unit}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ width: '40px' }}>{row.current}{row.unit.charAt(0)}</span>
                    <div style={{ flex: 1, minWidth: '100px', height: '6px', backgroundColor: 'var(--border)', borderRadius: '3px' }}>
                      <div style={{ 
                        width: `${row.percent}%`, 
                        height: '100%', 
                        backgroundColor: row.critical ? 'var(--estoque-critico)' : 'var(--estoque-ok)',
                        borderRadius: '3px'
                      }}></div>
                    </div>
                  </div>
                </td>
                <td>{row.min}{row.unit.charAt(0)}</td>
                <td>
                  <span className={`badge ${row.critical ? 'badge-status-cancelado' : 'badge-status-pronto'}`}>
                    {row.critical ? 'CRÍTICO' : 'OK'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button 
                      className="btn-secondary" 
                      style={{ padding: '6px 12px', fontSize: '11px', borderColor: 'var(--status-pronto)', color: 'var(--status-pronto)' }}
                      onClick={() => handleStockAction('Entrada', row.name)}
                    >
                      Entrada
                    </button>
                    <button 
                      className="btn-secondary" 
                      style={{ padding: '6px 12px', fontSize: '11px', borderColor: 'var(--status-execucao)', color: 'var(--status-execucao)' }}
                      onClick={() => handleStockAction('Uso', row.name)}
                    >
                      Uso
                    </button>
                    <button className="btn-ghost" onClick={openEditInsumoModal}>
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="btn-ghost" 
                      style={{ color: 'var(--status-cancelado)' }}
                      onClick={() => { if(confirm('Excluir este insumo?')) alert('Insumo removido'); }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Histórico Recomente */}
      <div>
        <h3 className="label-gold" style={{ marginBottom: '16px' }}>Histórico Recente</h3>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ fontSize: '13px' }}>
            <thead>
              <tr>
                <th>Data</th>
                <th>Insumo</th>
                <th>Tipo</th>
                <th>Qtd</th>
                <th>OS Relacionada</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: '23/06 14:20', item: 'Shampoo Neutro', type: 'saída', qty: '0.2L', os: '#0041' },
                { date: '23/06 11:00', item: 'Microfibra Premium', type: 'entrada', qty: '10 un', os: '—' },
                { date: '22/06 16:45', item: 'Cera Carnaúba', type: 'saída', qty: '0.1L', os: '#0040' },
              ].map((row, idx) => (
                <tr key={idx}>
                  <td>{row.date}</td>
                  <td style={{ color: 'var(--text-primary)' }}>{row.item}</td>
                  <td>
                    <span style={{ 
                      color: row.type === 'entrada' ? 'var(--status-pronto)' : 'var(--status-cancelado)',
                      display: 'flex', alignItems: 'center', gap: '4px'
                    }}>
                      {row.type === 'entrada' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {row.type}
                    </span>
                  </td>
                  <td>{row.qty}</td>
                  <td>{row.os}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Insumos;
