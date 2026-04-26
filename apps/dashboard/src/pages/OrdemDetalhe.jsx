import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, X, Check, Loader2, Plus, Save } from 'lucide-react';
import { supabase } from '@carluxe/shared';

const OrdemDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [os, setOs] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estados editáveis
  const [observacoes, setObservacoes] = useState('');
  const [checklist, setChecklist] = useState([]);
  
  // Serviços
  const [todosServicos, setTodosServicos] = useState([]);
  const [adicionandoServico, setAdicionandoServico] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Fotos
  const fotoInputRef = useRef(null);
  const [uploadingFotos, setUploadingFotos] = useState(false);

  const fetchOS = async () => {
    try {
      const { data, error } = await supabase
        .from('ordens_servico')
        .select(`
          *,
          clientes (id, nome, telefone, email),
          veiculos (id, marca, modelo, ano, cor, placa, porte),
          os_servicos (id, preco_aplicado, servicos (id, nome))
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setOs(data);
      setObservacoes(data.observacoes || '');
      setChecklist(data.checklist_avarias || []);
    } catch (error) {
      console.error('Erro ao buscar OS:', error.message);
      alert('Erro ao buscar OS: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOS();
    
    const fetchServicos = async () => {
      const { data } = await supabase.from('servicos').select('*').order('nome');
      if (data) setTodosServicos(data);
    };
    fetchServicos();
  }, [id]);

  const handleFotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploadingFotos(true);
    const newUrls = [];

    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `${os.id}/entrada/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('os-fotos')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('os-fotos')
          .getPublicUrl(filePath);

        newUrls.push(publicUrl);
      }

      const updatedFotos = [...(os.fotos_entrada || []), ...newUrls];

      const { error: updateError } = await supabase
        .from('ordens_servico')
        .update({ fotos_entrada: updatedFotos })
        .eq('id', os.id);

      if (updateError) throw updateError;

      setOs({ ...os, fotos_entrada: updatedFotos });
    } catch (error) {
      alert('Erro ao fazer upload: ' + error.message);
    } finally {
      setUploadingFotos(false);
      if (fotoInputRef.current) {
        fotoInputRef.current.value = '';
      }
    }
  };

  const handleRemoveFoto = async (urlToRemove) => {
    if (!window.confirm('Deseja realmente excluir esta foto?')) return;
    
    try {
      const urlObj = new URL(urlToRemove);
      const parts = urlObj.pathname.split('/os-fotos/');
      if (parts.length > 1) {
         const filePath = parts[1];
         await supabase.storage.from('os-fotos').remove([filePath]);
      }
      
      const updatedFotos = (os.fotos_entrada || []).filter(url => url !== urlToRemove);
      
      const { error } = await supabase
        .from('ordens_servico')
        .update({ fotos_entrada: updatedFotos })
        .eq('id', os.id);
        
      if (error) throw error;
      setOs({ ...os, fotos_entrada: updatedFotos });
    } catch(err) {
      alert('Erro ao excluir foto: ' + err.message);
    }
  };

  // --- Funções de Checklist ---
  const handleChecklistChange = (index, field, value) => {
    const newList = [...checklist];
    newList[index][field] = value;
    setChecklist(newList);
  };

  const handleAddAvaria = () => {
    setChecklist([...checklist, { tipo: 'Nova avaria', local: '', marcado: true }]);
  };

  // --- Funções de Serviços ---
  const handleAddServico = async (servicoId) => {
    if (!servicoId) return;
    setAdicionandoServico(true);
    
    const servicoSelecionado = todosServicos.find(s => s.id === servicoId);
    
    try {
      const { error } = await supabase.from('os_servicos').insert({
        ordem_id: id,
        servico_id: servicoId,
        preco_aplicado: 0 // Valor base provisório, ou poderia vir de outro campo
      });
      if (error) throw error;
      
      await fetchOS();
    } catch(err) {
      alert('Erro ao adicionar serviço: ' + err.message);
    } finally {
      setAdicionandoServico(false);
    }
  };
  
  const handleRemoveServico = async (osServicoId) => {
    if (!window.confirm('Remover este serviço da OS?')) return;
    try {
      const { error } = await supabase.from('os_servicos').delete().eq('id', osServicoId);
      if (error) throw error;
      await fetchOS();
    } catch(err) {
      alert('Erro ao remover serviço: ' + err.message);
    }
  };

  // --- Salvar Geral ---
  const handleSalvarGeral = async () => {
    setSalvando(true);
    try {
      const { error } = await supabase
        .from('ordens_servico')
        .update({
          observacoes,
          checklist_avarias: checklist
        })
        .eq('id', id);
        
      if (error) throw error;
      alert('Alterações salvas com sucesso!');
    } catch(err) {
      alert('Erro ao salvar: ' + err.message);
    } finally {
      setSalvando(false);
    }
  };

  // --- Ações de Status ---
  const handleAvancar = async () => {
    const proximoStatus = {
      'entrada': 'execucao',
      'execucao': 'finalizacao', 
      'finalizacao': 'pronto'
    };
    const novoStatus = proximoStatus[os.status];
    if (!novoStatus) return;
    
    try {
      const { error } = await supabase
        .from('ordens_servico')
        .update({ status: novoStatus })
        .eq('id', os.id);
        
      if (error) throw error;
      setOs(prev => ({ ...prev, status: novoStatus }));
    } catch (err) {
      alert('Erro ao avançar OS: ' + err.message);
    }
  };

  const handleCancelar = async () => {
    if (!window.confirm('Tem certeza que deseja cancelar esta OS?')) return;
    
    try {
      const { error } = await supabase
        .from('ordens_servico')
        .update({ status: 'cancelado' })
        .eq('id', os.id);
        
      if (error) throw error;
      navigate('/ordens');
    } catch (err) {
      alert('Erro ao cancelar OS: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--gold)' }} />
      </div>
    );
  }

  if (!os) {
    return <div style={{ color: 'var(--text-secondary)', padding: '24px' }}>Ordem de serviço não encontrada.</div>;
  }

  const totalServicos = os.os_servicos?.reduce((acc, curr) => acc + (parseFloat(curr.preco_aplicado) || 0), 0) || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Detalhe */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/ordens" className="btn-ghost" style={{ display: 'flex', alignItems: 'center' }}>
            <ChevronLeft size={24} />
          </Link>
          <h2 style={{ fontSize: '22px' }}>OS #{os.id.substring(0, 4)} — {os.veiculos?.marca} {os.veiculos?.modelo}</h2>
          <span className={`badge badge-status-${os.status === 'pendente' ? 'entrada' : os.status}`}>{os.status}</span>
        </div>
        
        <select className="btn-secondary" style={{ backgroundColor: 'var(--bg-surface)', padding: '8px 16px' }} defaultValue={os.status}>
          <option value="entrada">Entrada</option>
          <option value="execucao">Em Execução</option>
          <option value="finalizacao">Finalização</option>
          <option value="pronto">Pronto</option>
          <option value="entregue">Entregue</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '55% 45%', gap: '24px' }}>
        {/* Coluna Esquerda - Dados */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Cliente (Movido para cima) */}
          <div className="card">
            <h3 className="label-gold" style={{ marginBottom: '20px' }}>Cliente</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: '500' }}>{os.clientes?.nome || 'Não informado'}</p>
                {os.clientes?.telefone ? (
                  <a 
                    href={`https://wa.me/55${os.clientes.telefone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#25D366', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '14px' }}
                  >
                    📱 {os.clientes.telefone}
                  </a>
                ) : (
                  <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>---</p>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{os.clientes?.email || '---'}</span>
                {os.clientes?.email && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(os.clientes.email);
                      alert('Email copiado!');
                    }}
                    style={{ background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer', fontSize: '11px' }}
                  >
                    Copiar
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Veículo (Movido para baixo) */}
          <div className="card">
            <h3 className="label-gold" style={{ marginBottom: '20px' }}>Veículo</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Marca</p>
                <p style={{ color: 'var(--text-primary)', marginTop: '4px' }}>{os.veiculos?.marca || '---'}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Modelo</p>
                <p style={{ color: 'var(--text-primary)', marginTop: '4px' }}>{os.veiculos?.modelo || '---'}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ano</p>
                <p style={{ color: 'var(--text-primary)', marginTop: '4px' }}>{os.veiculos?.ano || '---'}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cor</p>
                <p style={{ color: 'var(--text-primary)', marginTop: '4px' }}>{os.veiculos?.cor || '---'}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Placa</p>
                <p style={{ color: 'var(--text-primary)', marginTop: '4px' }}>{os.veiculos?.placa || '---'}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Porte</p>
                <span style={{ backgroundColor: 'var(--border)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', color: 'var(--text-secondary)' }}>{os.veiculos?.porte || '---'}</span>
              </div>
            </div>
          </div>

          {/* Serviços Dinâmicos */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="label-gold">Serviços</h3>
              <select 
                className="btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: 'var(--bg-surface)' }}
                onChange={(e) => {
                  handleAddServico(e.target.value);
                  e.target.value = "";
                }}
                disabled={adicionandoServico}
              >
                <option value="">{adicionandoServico ? 'Adicionando...' : '+ Adicionar Serviço'}</option>
                {todosServicos
                  .filter(s => !os.os_servicos?.find(os_s => os_s.servicos?.id === s.id))
                  .map(s => (
                    <option key={s.id} value={s.id}>{s.nome}</option>
                  ))
                }
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {os.os_servicos && os.os_servicos.length > 0 ? (
                os.os_servicos.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button 
                        onClick={() => handleRemoveServico(item.id)} 
                        style={{ background: 'transparent', border: 'none', color: 'var(--status-cancelado)', cursor: 'pointer', display: 'flex', padding: 0 }}
                      >
                        <X size={16} />
                      </button>
                      <p>{item.servicos?.nome || 'Serviço'}</p>
                    </div>
                    <p style={{ color: 'var(--text-primary)' }}>
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.preco_aplicado || 0)}
                    </p>
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Nenhum serviço registrado.</p>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total</p>
                  <p style={{ fontSize: '20px', color: 'var(--gold)', fontWeight: '600' }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalServicos)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Observações Vinculada ao Estado */}
          <div className="card">
            <h3 className="label-gold" style={{ marginBottom: '16px' }}>Observações</h3>
            <textarea 
              className="input-field" 
              style={{ height: '100px', resize: 'none' }}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Nenhuma observação registrada."
            ></textarea>
          </div>

          {/* Histórico */}
          <div className="card">
            <h3 className="label-gold" style={{ marginBottom: '24px' }}>Histórico</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {[
                { status: 'OS Criada', date: new Date(os.criado_em).toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' }), done: true },
                { status: 'Em execução', date: '--/--', done: os.status === 'execucao' || os.status === 'finalizacao' || os.status === 'pronto' || os.status === 'entregue' },
                { status: 'Finalização', date: '--/--', done: os.status === 'finalizacao' || os.status === 'pronto' || os.status === 'entregue' },
                { status: 'Pronto para retirada', date: '--/--', done: os.status === 'pronto' || os.status === 'entregue' },
                { status: 'Entregue', date: os.data_saida ? new Date(os.data_saida).toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '--/--', done: os.status === 'entregue' },
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
                  <div style={{ 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    backgroundColor: step.done ? 'var(--gold)' : 'var(--border)',
                    zIndex: 2
                  }}></div>
                  {i < 4 && <div style={{ 
                    position: 'absolute', 
                    left: '5.5px', 
                    top: '12px', 
                    width: '1px', 
                    height: '24px', 
                    backgroundColor: 'var(--border)' 
                  }}></div>}
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: step.done ? 'var(--text-primary)' : 'var(--text-muted)' }}>{step.status}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botão Salvar Geral */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button 
              onClick={handleSalvarGeral}
              disabled={salvando}
              className="btn-primary" 
              style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
            >
              {salvando ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {salvando ? 'Salvando...' : '💾 Salvar Alterações'}
            </button>
          </div>

          {/* Ações (Avançar/Cancelar) */}
          <div style={{ display: 'flex', gap: '16px' }}>
            {os.status !== 'pronto' && os.status !== 'entregue' && os.status !== 'cancelado' && (
              <button 
                onClick={handleAvancar}
                className="btn-primary" 
                style={{ backgroundColor: 'var(--status-pronto)', backgroundImage: 'none', flex: 1 }}
              >
                <Check size={18} />
                {os.status === 'entrada' ? 'Avançar para Execução' : 
                 os.status === 'execucao' ? 'Avançar para Finalização' : 
                 'Avançar para Pronto'}
              </button>
            )}
            <button 
              onClick={handleCancelar}
              className="btn-secondary" 
              style={{ borderColor: 'var(--status-cancelado)', color: 'var(--status-cancelado)' }}
            >
              Cancelar OS
            </button>
          </div>
        </div>

        {/* Coluna Direita - Fotos e Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Fotos de Entrada */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="label-gold">Fotos de Entrada</h3>
              {uploadingFotos && <Loader2 size={16} className="animate-spin" style={{ color: 'var(--gold)' }} />}
            </div>
            <div 
              style={{ 
                backgroundColor: 'var(--bg-page)', 
                border: '2px dashed var(--border)', 
                borderRadius: '12px',
                padding: '32px',
                textAlign: 'center',
                cursor: 'pointer',
                marginBottom: '20px'
              }}
              onClick={() => fotoInputRef.current?.click()}
            >
              <Camera size={32} style={{ color: 'var(--text-muted)', marginBottom: '12px', margin: '0 auto' }} />
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {uploadingFotos ? 'Enviando...' : 'Arraste fotos ou clique para selecionar'}
              </p>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handleFotoUpload} 
              style={{ display: 'none' }} 
              ref={fotoInputRef} 
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {os.fotos_entrada?.map((url, i) => (
                <div key={i} style={{ 
                  aspectRatio: '1/1', 
                  backgroundColor: '#111', 
                  borderRadius: '8px', 
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundImage: `url(${url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>
                  <div 
                    onClick={() => handleRemoveFoto(url)}
                    style={{ position: 'absolute', top: '4px', right: '4px', cursor: 'pointer', color: 'var(--status-cancelado)', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <X size={14} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist de Avarias Dinâmico */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="label-gold">Checklist de Avarias</h3>
              <button 
                onClick={handleAddAvaria}
                style={{ background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', borderRadius: '4px', padding: '4px 12px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={14} /> Adicionar
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {checklist.length > 0 ? checklist.map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div 
                      onClick={() => handleChecklistChange(idx, 'marcado', !item.marcado)}
                      style={{ 
                        width: '20px', 
                        height: '20px', 
                        borderRadius: '4px', 
                        border: item.marcado ? 'none' : '1px solid var(--border)',
                        backgroundColor: item.marcado ? 'var(--gold)' : 'var(--bg-page)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}>
                      {item.marcado && <Check size={14} color="#0D0D0D" />}
                    </div>
                    <input 
                      type="text"
                      value={item.tipo || ''}
                      onChange={(e) => handleChecklistChange(idx, 'tipo', e.target.value)}
                      style={{ background: 'transparent', border: 'none', color: item.marcado ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '14px', outline: 'none', flex: 1 }}
                      placeholder="Ex: Amassado..."
                    />
                    <button 
                      onClick={() => setChecklist(checklist.filter((_, i) => i !== idx))}
                      style={{ background: 'transparent', border: 'none', color: 'var(--status-cancelado)', cursor: 'pointer', padding: '4px' }}
                      title="Remover avaria"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  {item.marcado && (
                    <input 
                      type="text" 
                      className="input-field" 
                      style={{ marginTop: '12px', fontSize: '12px', padding: '8px', marginLeft: '32px', width: 'calc(100% - 32px)' }} 
                      value={item.local || ''}
                      onChange={(e) => handleChecklistChange(idx, 'local', e.target.value)}
                      placeholder="Onde? (Ex: Paralama dianteiro)"
                    />
                  )}
                </div>
              )) : (
                 <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Nenhuma avaria registrada.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdemDetalhe;
