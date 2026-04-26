import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Calendar, 
  Users, 
  Car, 
  Wrench, 
  Package, 
  LogOut,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import { supabase } from '@carluxe/shared';

const Sidebar = ({ isCollapsed, toggleCollapse }) => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error('Erro ao sair:', error.message);
    }
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <ClipboardList size={20} />, label: 'Ordens de Serviço', path: '/ordens' },
    { icon: <Calendar size={20} />, label: 'Agendamentos', path: '/agendamentos' },
    { icon: <Users size={20} />, label: 'Clientes', path: '/clientes' },
    { icon: <Car size={20} />, label: 'Veículos', path: '/veiculos' },
    { icon: <Wrench size={20} />, label: 'Serviços', path: '/servicos' },
    { icon: <Package size={20} />, label: 'Insumos', path: '/insumos' },
    { icon: <Settings size={20} />, label: 'Configurações', path: '/configuracoes' },

  ];

  const [user, setUser] = useState({ name: '...', role: '...' });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profile } = await supabase
          .from('users')
          .select('name, role')
          .eq('id', authUser.id)
          .maybeSingle();
        
        if (profile) {
          setUser({ name: profile.name, role: profile.role });
        } else {
          setUser({ 
            name: authUser.user_metadata?.name || authUser.email.split('@')[0], 
            role: authUser.user_metadata?.role || 'Usuário' 
          });
        }
      }
    };
    getUser();
  }, []);

  return (
    <aside style={{
      width: isCollapsed ? '80px' : 'var(--sidebar-width)',
      height: '100vh',
      backgroundColor: 'var(--bg-main)',
      borderRight: '1px solid var(--border)',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      overflowX: 'hidden'
    }}>
      {/* Topo Logo e Toggle */}
      <div style={{ 
        padding: '24px 16px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: isCollapsed ? 'center' : 'space-between',
        position: 'relative'
      }}>
        {!isCollapsed && (
          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <img src="/logo.png" alt="Carluxe Logo" style={{ height: '32px', width: 'auto', objectFit: 'contain', alignSelf: 'flex-start' }} />
            <p style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              admin
            </p>
          </div>
        )}
        
        <button 
          onClick={toggleCollapse}
          className="btn-ghost"
          style={{ 
            padding: '8px', 
            borderRadius: '8px', 
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            color: 'var(--gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div style={{ height: '1px', background: 'var(--border)', width: isCollapsed ? '40px' : '80%', margin: '0 auto', opacity: 0.5 }}></div>

      {/* Navegação */}
      <nav style={{ flex: 1, padding: '16px 0' }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={isCollapsed ? item.label : ''}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: isCollapsed ? '0' : '12px',
              padding: isCollapsed ? '12px 0' : '12px 24px',
              textDecoration: 'none',
              color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
              backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
              borderLeft: !isCollapsed && isActive ? '3px solid var(--gold)' : '3px solid transparent',
              transition: 'all 0.2s',
              fontSize: '14px',
              whiteSpace: 'nowrap'
            })}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: isCollapsed ? '100%' : 'auto', color: isCollapsed && 'inherit' }}>
              {item.icon}
            </div>
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Rodapé Usuário */}
      <div style={{ 
        padding: '20px 16px', 
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        backgroundColor: 'rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '50%', 
            background: 'var(--brand-gradient)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#000',
            fontSize: '12px',
            fontWeight: 'bold',
            flexShrink: 0
          }}>
            {(user.name || 'C').charAt(0).toUpperCase()}
          </div>
          {!isCollapsed && (
            <div style={{ overflow: 'hidden' }}>
              <p style={{ 
                fontSize: '13px', 
                color: 'var(--text-primary)', 
                fontWeight: '500',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '120px'
              }}>{user.name}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{user.role}</p>
            </div>
          )}
        </div>
        
        {!isCollapsed && (
          <button 
            className="btn-ghost" 
            title="Sair"
            onClick={handleLogout}
            style={{ padding: '8px', color: 'var(--status-cancelado)' }}
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
