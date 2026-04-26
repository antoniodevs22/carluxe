import { useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useModal } from '../context/ModalContext';

const TopBar = () => {
  const location = useLocation();
  const { openNewOSModal } = useModal();
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Dashboard';
    if (path.includes('ordens')) return 'Ordens de Serviço';
    if (path.includes('agendamentos')) return 'Agendamentos';
    if (path.includes('clientes')) return 'Clientes';
    if (path.includes('veiculos')) return 'Veículos';
    if (path.includes('servicos')) return 'Serviços';
    if (path.includes('insumos')) return 'Insumos';
    if (path.includes('configuracoes')) return 'Configurações';
    return 'Admin';
  };

  const isConfigPage = location.pathname.includes('configuracoes');

  return (
    <header style={{
      height: 'var(--topbar-height)',
      backgroundColor: 'var(--bg-page)',
      borderBottom: '1px solid var(--border)',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 90,
    }}>
      <h1>{getPageTitle()}</h1>
      
      {!isConfigPage && (
        <button className="btn-primary" onClick={() => openNewOSModal()}>
          <Plus size={18} />
          Nova OS
        </button>
      )}
    </header>
  );
};

export default TopBar;
