import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Ordens from './pages/Ordens';
import OrdemDetalhe from './pages/OrdemDetalhe';
import Agendamentos from './pages/Agendamentos';
import Clientes from './pages/Clientes';
import ClienteDetalhe from './pages/ClienteDetalhe';
import Insumos from './pages/Insumos';
import Servicos from './pages/Servicos';
import Veiculos from './pages/Veiculos';
import Configuracoes from './pages/Configuracoes';

import { ModalProvider } from './context/ModalContext';
import { supabase } from '@carluxe/shared';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Pegar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Ouvir mudanças (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;

  return (
    <ModalProvider>
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={session ? <Navigate to="/dashboard" replace /> : <Login />} 
          />
          
          <Route 
            path="/" 
            element={session ? <Layout /> : <Navigate to="/login" replace />}
          >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="ordens" element={<Ordens />} />
          <Route path="ordens/:id" element={<OrdemDetalhe />} />
          <Route path="agendamentos" element={<Agendamentos />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="clientes/:id" element={<ClienteDetalhe />} />
          <Route path="veiculos" element={<Veiculos />} />
          <Route path="insumos" element={<Insumos />} />
          <Route path="servicos" element={<Servicos />} />
          <Route path="configuracoes" element={<Configuracoes />} />

        </Route>
      </Routes>
      </Router>
    </ModalProvider>
  );
}

export default App;
