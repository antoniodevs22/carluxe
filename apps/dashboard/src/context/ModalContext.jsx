import { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isNewOSModalOpen, setIsNewOSModalOpen] = useState(false);
  const [newOSData, setNewOSData] = useState(null);
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
  const [isNewVehicleModalOpen, setIsNewVehicleModalOpen] = useState(false);
  const [isEditVehicleModalOpen, setIsEditVehicleModalOpen] = useState(false);
  const [isNewServiceModalOpen, setIsNewServiceModalOpen] = useState(false);
  const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false);
  const [isNewInsumoModalOpen, setIsNewInsumoModalOpen] = useState(false);
  const [isEditInsumoModalOpen, setIsEditInsumoModalOpen] = useState(false);
  const [isConfirmDeliveryModalOpen, setIsConfirmDeliveryModalOpen] = useState(false);
  const [deliveryOSData, setDeliveryOSData] = useState(null);
  
  // Data contexts for modals
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [selectedServiceData, setSelectedServiceData] = useState(null);
  const [selectedInsumoData, setSelectedInsumoData] = useState(null);
  const [selectedClientData, setSelectedClientData] = useState(null);

  const openNewOSModal = (data = null) => {
    setNewOSData(data);
    setIsNewOSModalOpen(true);
  };
  const closeNewOSModal = () => {
    setIsNewOSModalOpen(false);
    setNewOSData(null);
  };
  
  const openNewClientModal = () => setIsNewClientModalOpen(true);
  const closeNewClientModal = () => setIsNewClientModalOpen(false);

  const openEditClientModal = (data) => {
    setSelectedClientData(data);
    setIsEditClientModalOpen(true);
  };
  const closeEditClientModal = () => {
    setIsEditClientModalOpen(false);
    setSelectedClientData(null);
  };

  const openNewVehicleModal = (clientId = null) => {
    setSelectedClientId(clientId);
    setIsNewVehicleModalOpen(true);
  };
  const closeNewVehicleModal = () => {
    setIsNewVehicleModalOpen(false);
    setSelectedClientId(null);
  };

  const openEditVehicleModal = (vehicleId) => {
    setSelectedVehicleId(vehicleId);
    setIsEditVehicleModalOpen(true);
  };
  const closeEditVehicleModal = () => {
    setIsEditVehicleModalOpen(false);
    setSelectedVehicleId(null);
  };

  const openNewServiceModal = () => setIsNewServiceModalOpen(true);
  const closeNewServiceModal = () => setIsNewServiceModalOpen(false);

  const openEditServiceModal = (data) => {
    setSelectedServiceData(data);
    setIsEditServiceModalOpen(true);
  };
  const closeEditServiceModal = () => {
    setIsEditServiceModalOpen(false);
    setSelectedServiceData(null);
  };

  const openNewInsumoModal = () => setIsNewInsumoModalOpen(true);
  const closeNewInsumoModal = () => setIsNewInsumoModalOpen(false);

  const openEditInsumoModal = (data) => {
    setSelectedInsumoData(data);
    setIsEditInsumoModalOpen(true);
  };
  const closeEditInsumoModal = () => {
    setIsEditInsumoModalOpen(false);
    setSelectedInsumoData(null);
  };

  const openConfirmDeliveryModal = (data) => {
    setDeliveryOSData(data);
    setIsConfirmDeliveryModalOpen(true);
  };
  const closeConfirmDeliveryModal = () => {
    setIsConfirmDeliveryModalOpen(false);
    setDeliveryOSData(null);
  };

  return (
    <ModalContext.Provider value={{ 
      isNewOSModalOpen, openNewOSModal, closeNewOSModal, newOSData,
      isNewClientModalOpen, openNewClientModal, closeNewClientModal,
      isEditClientModalOpen, openEditClientModal, closeEditClientModal, selectedClientData,
      isNewVehicleModalOpen, openNewVehicleModal, closeNewVehicleModal, selectedClientId,
      isEditVehicleModalOpen, openEditVehicleModal, closeEditVehicleModal, selectedVehicleId,
      isNewServiceModalOpen, openNewServiceModal, closeNewServiceModal,
      isEditServiceModalOpen, openEditServiceModal, closeEditServiceModal, selectedServiceData,
      isNewInsumoModalOpen, openNewInsumoModal, closeNewInsumoModal,
      isEditInsumoModalOpen, openEditInsumoModal, closeEditInsumoModal, selectedInsumoData,
      isConfirmDeliveryModalOpen, openConfirmDeliveryModal, closeConfirmDeliveryModal, deliveryOSData
    }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
