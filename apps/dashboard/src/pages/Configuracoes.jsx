import { useState, useEffect } from 'react';
import { 
  Settings, 
  Key, 
  Webhook, 
  User, 
  Shield, 
  Copy, 
  Eye, 
  EyeOff, 
  CheckCircle2,
  ExternalLink,
  Save,
  Bell
} from 'lucide-react';
import { supabase } from '@carluxe/shared';

const Configuracoes = () => {
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
    avatar: ''
  });

  // Valores fixos da documentação (normalmente viriam de variáveis de ambiente no front)
  const apiSettings = {
    url: 'https://sbbsgjsoqhgsjbtsraij.supabase.co',
    apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiYnNnanNvcWhnc2pidHNyYWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NjUyODgsImV4cCI6MjA5MjA0MTI4OH0.sPdrzsXAsj-aqh3-GyH2cYdGtCY_Dig2q7anqjNj31A',
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profileData } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();

        setProfile({
          name: profileData?.name || authUser.user_metadata?.name || authUser.email.split('@')[0],
          email: authUser.email,
          role: profileData?.role || 'Administrador',
          avatar: authUser.user_metadata?.avatar_url || ''
        });
      }
    };
    fetchProfile();
  }, []);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    // Simulação de salvamento
    setTimeout(() => {
      setLoading(false);
      alert('Configurações salvas com sucesso!');
    }, 1000);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '64px' }}>
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div className="label-gold">Painel de Administração</div>
          <h1 style={{ marginTop: '8px' }}>Configurações & Integração</h1>
        </div>
        <button className="btn-primary" onClick={handleSaveProfile} disabled={loading}>
          {loading ? <Settings className="animate-spin" size={18} /> : <Save size={18} />}
          Salvar Alterações
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px' }}>
        
        {/* Coluna Esquerda: Documentação e Perfil */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* API & Integrações - Credenciais */}
          <section className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ padding: '8px', background: 'rgba(201, 168, 76, 0.1)', borderRadius: '8px', color: 'var(--gold)' }}>
                <Key size={20} />
              </div>
              <h2 style={{ fontSize: '18px' }}>Credenciais de Acesso</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label className="label-gold" style={{ display: 'block', marginBottom: '8px' }}>URL do Projeto (Supabase)</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input type="text" className="input-field" value={apiSettings.url} readOnly style={{ fontFamily: 'monospace', fontSize: '13px' }} />
                  <button className="btn-secondary" style={{ padding: '0 12px' }} onClick={() => handleCopy(apiSettings.url, 'url')}>
                    {copiedField === 'url' ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="label-gold" style={{ display: 'block', marginBottom: '8px' }}>API Key / Service Role</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <input type={showApiKey ? "text" : "password"} className="input-field" value={apiSettings.apiKey} readOnly style={{ fontFamily: 'monospace', fontSize: '12px', paddingRight: '48px' }} />
                    <button 
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <button className="btn-secondary" style={{ padding: '0 12px' }} onClick={() => handleCopy(apiSettings.apiKey, 'key')}>
                    {copiedField === 'key' ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Guia de Integração WhatsApp / n8n */}
          <section className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ padding: '8px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', color: '#22C55E' }}>
                <Webhook size={20} />
              </div>
              <h2 style={{ fontSize: '18px' }}>Guia de Integração (n8n / WhatsApp)</h2>
            </div>

            <p style={{ marginBottom: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              Utilize os comandos abaixo nos nós <strong>HTTP Request</strong> do n8n para automatizar o fluxo do WhatsApp.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Endpoint 1 */}
              <div style={{ background: 'var(--bg-page)', borderRadius: '10px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>1. Buscar Cliente (Pelo Telefone)</span>
                  <button className="btn-ghost" onClick={() => handleCopy(`curl -X GET '${apiSettings.url}/rest/v1/clientes?telefone=eq.SEU_NUMERO_AQUI&select=id,nome' -H 'apikey: ${apiSettings.apiKey}' -H 'Authorization: Bearer ${apiSettings.apiKey}'`, 'c1')}>
                    {copiedField === 'c1' ? <CheckCircle2 size={16} color="#22C55E" /> : <Copy size={16} />}
                  </button>
                </div>
                <pre style={{ padding: '20px', fontSize: '13px', color: '#E2BF6A', overflowX: 'auto', margin: 0, lineHeight: '1.6', backgroundColor: '#0A0A0A' }}>
{`curl -X GET '${apiSettings.url}/rest/v1/clientes?telefone=eq.TELEFONE&select=id,nome' \\
-H 'apikey: ${apiSettings.apiKey.substring(0, 20)}...' \\
-H 'Authorization: Bearer ${apiSettings.apiKey.substring(0, 20)}...'`}
                </pre>
              </div>

              {/* Endpoint 2 */}
              <div style={{ background: 'var(--bg-page)', borderRadius: '10px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>2. Criar Novo Cliente</span>
                  <button className="btn-ghost" onClick={() => handleCopy(`curl -X POST '${apiSettings.url}/rest/v1/clientes' -H 'apikey: ${apiSettings.apiKey}' -H 'Authorization: Bearer ${apiSettings.apiKey}' -H 'Content-Type: application/json' -H 'Prefer: return=representation' -d '{"nome": "Nome", "telefone": "5511...", "email": "..."}'`, 'c2')}>
                    {copiedField === 'c2' ? <CheckCircle2 size={16} color="#22C55E" /> : <Copy size={16} />}
                  </button>
                </div>
                <pre style={{ padding: '20px', fontSize: '13px', color: '#E2BF6A', overflowX: 'auto', margin: 0, lineHeight: '1.6', backgroundColor: '#0A0A0A' }}>
{`curl -X POST '${apiSettings.url}/rest/v1/clientes' \\
-H 'apikey: ${apiSettings.apiKey.substring(0, 20)}...' \\
-H 'Authorization: Bearer ${apiSettings.apiKey.substring(0, 20)}...' \\
-H 'Content-Type: application/json' \\
-H 'Prefer: return=representation' \\
-d '{
  "nome": "Nome do Cliente",
  "telefone": "5511999999999",
  "email": "email@exemplo.com"
}'`}
                </pre>
              </div>

              {/* Endpoint 3 */}
              <div style={{ background: 'var(--bg-page)', borderRadius: '10px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>3. Criar Veículo</span>
                  <button className="btn-ghost" onClick={() => handleCopy(`curl -X POST '${apiSettings.url}/rest/v1/veiculos' -H 'apikey: ${apiSettings.apiKey}' -H 'Authorization: Bearer ${apiSettings.apiKey}' -H 'Content-Type: application/json' -H 'Prefer: return=representation' -d '{"cliente_id": "...", "marca": "Porsche", "modelo": "911", "placa": "ABC1234"}'`, 'c3')}>
                    {copiedField === 'c3' ? <CheckCircle2 size={16} color="#22C55E" /> : <Copy size={16} />}
                  </button>
                </div>
                <pre style={{ padding: '20px', fontSize: '13px', color: '#E2BF6A', overflowX: 'auto', margin: 0, lineHeight: '1.6', backgroundColor: '#0A0A0A' }}>
{`curl -X POST '${apiSettings.url}/rest/v1/veiculos' \\
-H 'apikey: ${apiSettings.apiKey.substring(0, 20)}...' \\
-H 'Authorization: Bearer ${apiSettings.apiKey.substring(0, 20)}...' \\
-H 'Content-Type: application/json' \\
-H 'Prefer: return=representation' \\
-d '{
  "cliente_id": "ID_CLIENTE",
  "marca": "Porsche",
  "modelo": "911",
  "placa": "ABC1234",
  "cor": "Preto",
  "ano": "2024"
}'`}
                </pre>
              </div>

              {/* Endpoint 4 */}
              <div style={{ background: 'var(--bg-page)', borderRadius: '10px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>4. Criar Agendamento</span>
                  <button className="btn-ghost" onClick={() => handleCopy(`curl -X POST '${apiSettings.url}/rest/v1/agendamentos' -H 'apikey: ${apiSettings.apiKey}' -H 'Authorization: Bearer ${apiSettings.apiKey}' -H 'Content-Type: application/json' -H 'Prefer: return=representation' -d '{"cliente_id": "...", "veiculo_id": "...", "data_hora": "...", "status": "pendente"}'`, 'c4')}>
                    {copiedField === 'c4' ? <CheckCircle2 size={16} color="#22C55E" /> : <Copy size={16} />}
                  </button>
                </div>
                <pre style={{ padding: '20px', fontSize: '13px', color: '#E2BF6A', overflowX: 'auto', margin: 0, lineHeight: '1.6', backgroundColor: '#0A0A0A' }}>
{`curl -X POST '${apiSettings.url}/rest/v1/agendamentos' \\
-H 'apikey: ${apiSettings.apiKey.substring(0, 20)}...' \\
-H 'Authorization: Bearer ${apiSettings.apiKey.substring(0, 20)}...' \\
-H 'Content-Type: application/json' \\
-H 'Prefer: return=representation' \\
-d '{
  "cliente_id": "ID_CLIENTE",
  "veiculo_id": "ID_VEICULO",
  "data_hora": "2026-04-25T14:30:00-03:00",
  "status": "pendente",
  "valor_estimado": 250.00
}'`}
                </pre>
              </div>
            </div>

            {/* Dicas n8n */}
            <div style={{ marginTop: '24px', padding: '24px', background: 'rgba(201, 168, 76, 0.05)', borderRadius: '12px', border: '1px solid rgba(201, 168, 76, 0.2)' }}>
              <h3 style={{ fontSize: '16px', color: 'var(--gold)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                <CheckCircle2 size={20} />
                Dicas para o Node HTTP Request do n8n:
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Mude o Method para POST ou GET conforme o comando.',
                  'Authentication: Selecione "None" e use as chaves nos Headers.',
                  'Adicione apikey, Authorization e Content-Type nos Headers.',
                  'Body: Use formato JSON/RAW e expressões do n8n (ex: {{$json.telefone}}).'
                ].map((tip, i) => (
                  <li key={i} style={{ fontSize: '14px', color: 'var(--text-primary)', display: 'flex', gap: '10px', lineHeight: '1.4' }}>
                    <span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>•</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          </section>


          {/* Perfil do Usuário */}
          <section className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ padding: '8px', background: 'rgba(201, 168, 76, 0.1)', borderRadius: '8px', color: 'var(--gold)' }}>
                <User size={20} />
              </div>
              <h2 style={{ fontSize: '18px' }}>Perfil do Usuário</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label className="label-gold" style={{ display: 'block', marginBottom: '8px' }}>Nome Completo</label>
                <input type="text" className="input-field" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} />
              </div>
              <div>
                <label className="label-gold" style={{ display: 'block', marginBottom: '8px' }}>E-mail</label>
                <input type="email" className="input-field" value={profile.email} disabled style={{ opacity: 0.7, cursor: 'not-allowed' }} />
              </div>
              <div>
                <label className="label-gold" style={{ display: 'block', marginBottom: '8px' }}>Cargo / Role</label>
                <input type="text" className="input-field" value={profile.role} disabled style={{ opacity: 0.7, cursor: 'not-allowed' }} />
              </div>
              <div>
                <label className="label-gold" style={{ display: 'block', marginBottom: '8px' }}>Avatar URL</label>
                <input type="text" className="input-field" placeholder="https://..." value={profile.avatar} onChange={(e) => setProfile({...profile, avatar: e.target.value})} />
              </div>
            </div>
          </section>

        </div>

        {/* Coluna Direita: Status & Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <section className="card" style={{ padding: '20px' }}>
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} color="var(--gold)" />
              Segurança
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px' }}>Autenticação MFA</span>
                <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>Desativado</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px' }}>Sessão Ativa</span>
                <span className="badge" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22C55E' }}>Segura</span>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '4px 0' }} />
              <button className="btn-secondary" style={{ width: '100%', fontSize: '12px' }}>Alterar Senha</button>
            </div>
          </section>

          <section className="card" style={{ padding: '20px' }}>
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} color="var(--gold)" />
              Notificações
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--gold)' }} />
                <span style={{ fontSize: '13px' }}>Novos Agendamentos</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--gold)' }} />
                <span style={{ fontSize: '13px' }}>Estoque Crítico</span>
              </label>
            </div>
          </section>

          <div style={{ 
            padding: '24px', 
            background: 'var(--brand-gradient)', 
            borderRadius: '12px',
            color: '#000000',
            textAlign: 'center',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)'
          }}>
            <h4 style={{ fontWeight: '800', fontSize: '18px', marginBottom: '8px', color: '#000000' }}>Suporte Técnico</h4>
            <p style={{ color: '#000000', fontSize: '14px', marginBottom: '16px', fontWeight: '500', lineHeight: '1.4' }}>
              Dúvidas na integração n8n? Clique para abrir o chat.
            </p>
            <button style={{ 
              background: '#000000', 
              color: '#FFFFFF', 
              border: 'none', 
              padding: '12px 24px', 
              borderRadius: '8px', 
              fontSize: '14px', 
              fontWeight: '700', 
              cursor: 'pointer',
              width: '100%',
              transition: 'transform 0.2s',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
            }}>
              Ajuda Imediata
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Configuracoes;
