import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import Budget from './pages/Budget';
import Booking from './pages/Booking';
import Tracking from './pages/Tracking';
import NossaUnidade from './pages/NossaUnidade';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/servicos" element={<Services />} />
          <Route path="/orcamento" element={<Budget />} />
          <Route path="/agendar" element={<Booking />} />
          <Route path="/acompanhar" element={<Tracking />} />
          <Route path="/nossa-unidade" element={<NossaUnidade />} />
          <Route path="/privacidade" element={<Privacy />} />
          <Route path="/termos" element={<Terms />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
