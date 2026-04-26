import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import NewOSModal from './NewOSModal';
import NewClientModal from './NewClientModal';
import EditClientModal from './EditClientModal';
import NewVehicleModal from './NewVehicleModal';
import EditVehicleModal from './EditVehicleModal';
import NewServiceModal from './NewServiceModal';
import EditServiceModal from './EditServiceModal';
import NewInsumoModal from './NewInsumoModal';
import EditInsumoModal from './EditInsumoModal';
import ConfirmDeliveryModal from './ConfirmDeliveryModal';

const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div>
      <Sidebar isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
      <div 
        className="main-wrapper"
        style={{ 
          marginLeft: isCollapsed ? '80px' : 'var(--sidebar-width)',
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <TopBar />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
      <NewOSModal />
      <NewClientModal />
      <EditClientModal />
      <NewVehicleModal />
      <EditVehicleModal />
      <NewServiceModal />
      <EditServiceModal />
      <NewInsumoModal />
      <EditInsumoModal />
      <ConfirmDeliveryModal />
    </div>
  );
};

export default Layout;
