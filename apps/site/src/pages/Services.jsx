import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Shield, Wind, Layers, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  const [filter, setFilter] = useState('Todos');

  const categories = ['Todos', 'Lavagem', 'Polimento', 'Vitrificação', 'Higienização', 'PPF', 'Estética'];

  const servicesData = [
    { 
      id: 1, 
      category: 'Lavagem', 
      name: 'Lavagem Premium', 
      icon: <Sparkles />, 
      desc: 'Nossa lavagem utiliza técnica de dois baldes para evitar riscos, com shampoo neutro premium e finalização com selante rápido para brilho e proteção imediata.',
      duration: '1.5 - 2h',
      prices: [
        { porte: 'Pequeno', valor: '120' },
        { porte: 'Médio', valor: '150' },
        { porte: 'Grande', valor: '180' },
        { porte: 'SUV', valor: '200' },
        { porte: 'Pickup', valor: '220' },
      ]
    },
    { 
      id: 2, 
      category: 'Polimento', 
      name: 'Polimento Técnico', 
      icon: <Zap />, 
      desc: 'Correção de pintura em múltiplos estágios para remover hologramas, riscos superficiais e restaurar o brilho original de fábrica. Utilizamos máquinas e compostos de última geração.',
      duration: '1 - 2 dias',
      prices: [
        { porte: 'Pequeno', valor: '590' },
        { porte: 'Médio', valor: '690' },
        { porte: 'Grande', valor: '790' },
        { porte: 'SUV', valor: '890' },
        { porte: 'Pickup', valor: '990' },
      ]
    },
    { 
      id: 3, 
      category: 'Vitrificação', 
      name: 'Vitrificação Cerâmica', 
      icon: <Shield />, 
      desc: 'Aplicação de revestimento cerâmico (9H) que cria uma camada de vidro sobre o verniz, oferecendo proteção extrema contra raios UV, fezes de pássaros e agentes químicos por até 3 anos.',
      duration: '2 dias',
      prices: [
        { porte: 'Pequeno', valor: '1.890' },
        { porte: 'Médio', valor: '2.190' },
        { porte: 'Grande', valor: '2.490' },
        { porte: 'SUV', valor: '2.790' },
        { porte: 'Pickup', valor: '3.090' },
      ]
    },
    { 
      id: 4, 
      category: 'Higienização', 
      name: 'Higienização Interna', 
      icon: <Wind />, 
      desc: 'Limpeza profunda de todo o interior, incluindo extração de sujeira dos bancos, teto, carpetes e revitalização de plásticos e couros com condicionadores premium.',
      duration: '4 - 6h',
      prices: [
        { porte: 'Pequeno', valor: '350' },
        { porte: 'Médio', valor: '400' },
        { porte: 'Grande', valor: '450' },
        { porte: 'SUV', valor: '500' },
        { porte: 'Pickup', valor: '550' },
      ]
    },
    { 
      id: 5, 
      category: 'PPF', 
      name: 'PPF (Película Protetora)', 
      icon: <Layers />, 
      desc: 'Paint Protection Film - Uma película de uretano transparente e auto-regenerativa que protege a pintura contra impactos de pedras, arranhões e vandalismo.',
      duration: '3 - 5 dias',
      prices: [
        { porte: 'Pequeno', valor: '2.500' },
        { porte: 'Médio', valor: '3.000' },
        { porte: 'Grande', valor: '3.500' },
        { porte: 'SUV', valor: '4.000' },
        { porte: 'Pickup', valor: '4.500' },
      ]
    },
    { 
      id: 6, 
      category: 'Estética', 
      name: 'Estética Completa', 
      icon: <Star />, 
      desc: 'O tratamento definitivo para seu carro. Combina Lavagem Premium, Polimento Técnico, Higienização Interna e Vitrificação de Plásticos e Rodas.',
      duration: '3 dias',
      prices: [
        { porte: 'Pequeno', valor: '3.200' },
        { porte: 'Médio', valor: '3.600' },
        { porte: 'Grande', valor: '4.000' },
        { porte: 'SUV', valor: '4.400' },
        { porte: 'Pickup', valor: '4.800' },
      ]
    },
  ];

  const filteredServices = filter === 'Todos' 
    ? servicesData 
    : servicesData.filter(s => s.category === filter);

  return (
    <div style={{ backgroundColor: 'var(--bg-page)' }}>
      {/* Hero com Imagem */}
      <section style={{
        position: 'relative',
        width: '100%',
        height: '350px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        marginBottom: '40px'
      }}>
        {/* Imagem de fundo */}
        <img 
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80"
          alt="Car background"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            filter: 'brightness(0.35)'
          }}
        />
        
        {/* Overlay gradiente */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(13,13,13,0.3) 0%, rgba(13,13,13,0.8) 100%)'
        }} />
        
        {/* Conteúdo por cima */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }} className="container">
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: '800',
            color: '#FFFFFF',
            marginBottom: '16px'
          }}>
            Nossos Serviços
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.8)'
          }}>
            Excelência e cuidado em cada detalhe do seu veículo
          </p>
        </div>
      </section>

      {/* Filters */}
      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <div className="flex justify-center gap-4 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  padding: '10px 24px',
                  borderRadius: '999px',
                  border: filter === cat ? 'none' : '1px solid var(--border)',
                  backgroundColor: filter === cat ? 'var(--gold-accent)' : 'transparent',
                  color: filter === cat ? '#0D0D0D' : 'var(--text-secondary)',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredServices.map(service => (
                <motion.div
                  layout
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="card"
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  <div className="flex items-center gap-4" style={{ marginBottom: '20px' }}>
                    <div style={{ color: 'var(--gold-accent)' }}>{service.icon}</div>
                    <span className="label-tag">{service.category}</span>
                  </div>
                  <h3 style={{ marginBottom: '16px' }}>{service.name}</h3>
                  <p style={{ fontSize: '14px', marginBottom: '24px', flex: 1 }}>{service.desc}</p>
                  
                  <div style={{ marginBottom: '24px' }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tabela de Preços</p>
                    <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                      <tbody>
                        {service.prices.map((p, idx) => (
                          <tr key={idx} style={{ borderBottom: idx === service.prices.length - 1 ? 'none' : '1px solid #2E2E2E' }}>
                            <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>{p.porte}</td>
                            <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: '600', color: 'var(--text-primary)' }}>R$ {p.valor}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between" style={{ marginTop: 'auto' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>Duração: {service.duration}</span>
                    <Link to="/orcamento" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '12px', textDecoration: 'none' }}>
                      Adicionar ao orçamento
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="text-center" style={{ marginTop: '80px' }}>
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px' }}>
              <h3 style={{ marginBottom: '16px' }}>Simule seu orçamento completo</h3>
              <p style={{ marginBottom: '24px' }}>Selecione o porte do seu carro e todos os serviços desejados para uma estimativa precisa.</p>
              <Link to="/orcamento" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
                Ir para o Simulador
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
