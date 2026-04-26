import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Search, Camera, CheckCircle2, Loader2, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@carluxe/shared';

const Tracking = () => {
  const [phone, setPhone] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);

  const statusMap = {
    'entrada': { label: 'Em Análise', color: '#3B82F6', index: 0 },
    'execucao': { label: 'Em execução', color: '#F59E0B', index: 1 },
    'finalizacao': { label: 'Em finalização', color: '#8B5CF6', index: 2 },
    'pronto': { label: 'Pronto para retirada', color: '#10B981', index: 3 },
    'entregue': { label: 'Entregue', color: '#22C55E', index: 4 },
  };

  const handleSearch = async () => {
    if (!phone) return;
    setLoading(true);
    setHasSearched(true);
    setResults([]);
    setSelectedResult(null);

    try {
      const telefoneLimpo = phone.replace(/\D/g, '');
      
      const { data: cliente, error: errCliente } = await supabase
        .from('clientes')
        .select('id, nome')
        .ilike('telefone', `%${telefoneLimpo}%`)
        .single();
      
      if (!cliente || errCliente) {
        setLoading(false);
        return; // Nenhum veículo
      }
      
      const { data: ordens, error: errOrdens } = await supabase
        .from('ordens_servico')
        .select(`
          id, status, criado_em, data_saida,
          fotos_entrada, observacoes,
          veiculos (marca, modelo, ano, placa, cor)
        `)
        .eq('cliente_id', cliente.id)
        .neq('status', 'cancelado')
        .order('criado_em', { ascending: false });

      if (errOrdens) {
        console.error("Erro ao buscar OS:", errOrdens);
        alert("Erro na busca: " + errOrdens.message);
      }

      if (ordens && ordens.length > 0) {
        setResults(ordens);
        setSelectedResult(ordens[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const handleNovaBusca = () => {
    setHasSearched(false);
    setSelectedResult(null);
    setResults([]);
    setPhone('');
  };

  const getTimeline = (os) => {
    const currentIndex = statusMap[os.status]?.index || 0;
    return [
      { label: 'Veículo recebido', date: formatDate(os.criado_em), completed: true, current: currentIndex === 0 },
      { label: 'Em execução', date: currentIndex >= 1 ? '--/--' : '', completed: currentIndex >= 1, current: currentIndex === 1 },
      { label: 'Em finalização', date: currentIndex >= 2 ? '--/--' : '', completed: currentIndex >= 2, current: currentIndex === 2 },
      { label: 'Pronto para retirada', date: currentIndex >= 3 ? '--/--' : '', completed: currentIndex >= 3, current: currentIndex === 3 },
      { label: 'Entregue', date: formatDate(os.data_saida), completed: currentIndex === 4, current: currentIndex === 4 },
    ];
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', display: 'flex', flexDirection: 'column', paddingTop: '80px' }}>
      {!hasSearched ? (
        <section style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="container text-center" style={{ maxWidth: '500px' }}>
            <div style={{ color: 'var(--gold-accent)', marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
              <Car size={80} strokeWidth={1} />
            </div>
            <h2 style={{ marginBottom: '16px' }}>Acompanhe seu veículo</h2>
            <p style={{ marginBottom: '40px' }}>Digite seu telefone para ver o status em tempo real do seu carro em nossa oficina.</p>
            
            <div className="flex flex-col gap-4">
              <input 
                type="text" 
                placeholder="(11) 99999-9999" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ fontSize: '18px', textAlign: 'center', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                className="btn-primary w-full" 
                onClick={handleSearch}
                disabled={loading}
                style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'Buscar Status'}
              </button>
            </div>
          </div>
        </section>
      ) : selectedResult ? (
        <section style={{ padding: '40px 0' }}>
          <div className="container" style={{ maxWidth: '900px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <button 
                onClick={handleNovaBusca} 
                style={{ background: 'transparent', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Search size={16} /> Nova busca
              </button>
              
              {results.length > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <List size={16} style={{ color: 'var(--text-secondary)' }} />
                  <select 
                    value={selectedResult.id} 
                    onChange={(e) => setSelectedResult(results.find(r => r.id === e.target.value))}
                    style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '6px 12px', borderRadius: '4px', fontSize: '14px' }}
                  >
                    {results.map((os, idx) => (
                      <option key={os.id} value={os.id}>
                        {os.veiculos?.marca} {os.veiculos?.modelo} - {os.veiculos?.placa}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
              {/* Card Header */}
              <div style={{ padding: '32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h2 style={{ marginBottom: '8px', fontSize: '24px' }}>
                    {selectedResult.veiculos?.marca} {selectedResult.veiculos?.modelo}
                  </h2>
                  <div className="badge-pill" style={{ backgroundColor: 'var(--border)', border: 'none', color: 'var(--text-secondary)' }}>
                    {selectedResult.veiculos?.placa} • {selectedResult.veiculos?.ano} • {selectedResult.veiculos?.cor}
                  </div>
                </div>
                {statusMap[selectedResult.status] && (
                  <div style={{ 
                    backgroundColor: `${statusMap[selectedResult.status].color}20`, 
                    color: statusMap[selectedResult.status].color, 
                    padding: '12px 24px', 
                    borderRadius: '999px',
                    fontWeight: '700',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: statusMap[selectedResult.status].color, 
                      animation: selectedResult.status === 'execucao' ? 'pulse 2s infinite' : 'none' 
                    }}></div>
                    {statusMap[selectedResult.status].label.toUpperCase()}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                {/* Timeline */}
                <div style={{ padding: '40px', borderRight: '1px solid var(--border)' }}>
                  <span className="label-tag" style={{ display: 'block', marginBottom: '32px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '1px' }}>STATUS DO SERVIÇO</span>
                  <div className="flex flex-col gap-0" style={{ display: 'flex', flexDirection: 'column' }}>
                    {getTimeline(selectedResult).map((item, idx, arr) => (
                      <div key={idx} className="flex gap-6" style={{ position: 'relative', paddingBottom: '32px', display: 'flex', gap: '24px' }}>
                        {/* Connector line */}
                        {idx !== arr.length - 1 && (
                          <div style={{ 
                            position: 'absolute', 
                            left: '11px', 
                            top: '24px', 
                            bottom: '0', 
                            width: '2px', 
                            backgroundColor: item.completed && arr[idx+1].completed ? 'var(--gold)' : 'var(--border)' 
                          }}></div>
                        )}
                        
                        <div style={{ 
                          width: '24px', 
                          height: '24px', 
                          borderRadius: '50%', 
                          backgroundColor: item.completed ? 'var(--gold)' : 'transparent',
                          border: item.completed ? 'none' : '2px solid var(--border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 1,
                          boxShadow: item.current ? '0 0 15px var(--gold)' : 'none'
                        }}>
                          {item.completed && <CheckCircle2 size={14} color="#0D0D0D" strokeWidth={3} />}
                        </div>

                        <div>
                          <p style={{ 
                            fontSize: '15px', 
                            fontWeight: '600', 
                            color: item.completed ? 'var(--text-primary)' : 'var(--text-muted)',
                            marginBottom: '4px'
                          }}>
                            {item.label}
                          </p>
                          {item.date && <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.date}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Photos & Message */}
                <div style={{ padding: '40px' }}>
                  <span className="label-tag" style={{ display: 'block', marginBottom: '32px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '1px' }}>FOTOS DO VEÍCULO</span>
                  
                  {selectedResult.fotos_entrada && selectedResult.fotos_entrada.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '40px' }}>
                      {selectedResult.fotos_entrada.map((photo, i) => (
                        <div key={i} style={{ aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                          <img src={photo} alt={`Foto do veículo ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', border: '1px dashed var(--border)', borderRadius: '12px', marginBottom: '40px' }}>
                      <Camera size={24} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                      <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Sem fotos registradas</p>
                    </div>
                  )}

                  <div style={{ backgroundColor: 'var(--bg-main)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                      {selectedResult.observacoes || '🏎️ Seu carro está em boas mãos. Nossa equipe está trabalhando com cuidado e precisão.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="container text-center" style={{ maxWidth: '500px' }}>
            <Search size={60} color="var(--text-muted)" style={{ marginBottom: '24px' }} />
            <h3 style={{ marginBottom: '16px' }}>Nenhum veículo encontrado</h3>
            <p style={{ marginBottom: '32px' }}>Não encontramos nenhum serviço ativo vinculado ao telefone <strong>{phone}</strong>.</p>
            <div className="flex flex-col gap-4">
              <button className="btn-secondary w-full" onClick={handleNovaBusca}>Tentar outro número</button>
              <Link to="/agendar" className="btn-primary w-full" style={{ textDecoration: 'none' }}>Agendar um serviço</Link>
            </div>
          </div>
        </section>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.7; }
        }
      `}} />
    </div>
  );
};

export default Tracking;
