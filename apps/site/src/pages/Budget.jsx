import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Info } from 'lucide-react';
import { supabase } from '@carluxe/shared';

const Budget = () => {
  const navigate = useNavigate();
  const [selectedPorte, setSelectedPorte] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [dbServices, setDbServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase.from('servicos').select('id, nome');
      if (data) setDbServices(data);
    };
    fetchServices();
  }, []);

  const getServiceId = (name) => {
    const s = dbServices.find(ds => ds.nome.toLowerCase() === name.toLowerCase() || (name === 'PPF (Frontal)' && ds.nome === 'PPF Frontal'));
    return s ? s.id : null;
  };

  const services = [
    { id: getServiceId('Lavagem Premium') || 1, name: 'Lavagem Premium', desc: 'Limpeza detalhada externa e interna', prices: { pequeno: 120, medio: 150, grande: 180, suv: 200, pickup: 220 } },
    { id: getServiceId('Polimento Técnico') || 2, name: 'Polimento Técnico', desc: 'Restauração de brilho e correção', prices: { pequeno: 590, medio: 690, grande: 790, suv: 890, pickup: 990 } },
    { id: getServiceId('Vitrificação Cerâmica') || 3, name: 'Vitrificação Cerâmica', desc: 'Proteção 9H por até 3 anos', prices: { pequeno: 1890, medio: 2190, grande: 2490, suv: 2790, pickup: 3090 } },
    { id: getServiceId('Higienização Interna') || 4, name: 'Higienização Interna', desc: 'Sanitização profunda de tecidos', prices: { pequeno: 350, medio: 400, grande: 450, suv: 500, pickup: 550 } },
    { id: getServiceId('PPF (Frontal)') || 5, name: 'PPF (Frontal)', desc: 'Proteção contra impactos na frente', prices: { pequeno: 2500, medio: 3000, grande: 3500, suv: 4000, pickup: 4500 } },
  ];

  const handleBooking = () => {
    const servicosIds = selectedServices.filter(id => typeof id === 'string' && id.includes('-')).join(',');
    const finalIds = servicosIds || selectedServices.join(',');
    navigate(`/agendar?porte=${selectedPorte}&servicos=${finalIds}`);
  };

  const portes = [
    { id: 'pequeno', name: 'Pequeno', examples: 'Civic, Corolla' },
    { id: 'medio', name: 'Médio', examples: 'Camry, Fusion' },
    { id: 'grande', name: 'Grande', examples: 'S-Classe, Série 7' },
    { id: 'suv', name: 'SUV', examples: 'Cayenne, X5, GLE' },
    { id: 'pickup', name: 'Pickup', examples: 'RAM, Hilux, Ranger' },
  ];

  const toggleService = (id) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter(s => s !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const calculateTotal = () => {
    if (!selectedPorte) return 0;
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return total + (service ? service.prices[selectedPorte] : 0);
    }, 0);
  };

  const total = calculateTotal();

  return (
    <div style={{ backgroundColor: 'var(--bg-page)' }}>
      <style>{`
        .budget-hero {
          height: 30vh;
          display: flex;
          align-items: center;
          background-color: var(--bg-main);
        }
        .budget-hero h1 {
          font-size: 40px;
          margin-bottom: 8px;
        }
        .budget-grid {
          display: grid;
          grid-template-columns: 60% 40%;
          gap: 40px;
          align-items: start;
        }
        .budget-summary-sticky {
          position: sticky;
          top: 120px;
          height: fit-content;
        }
        .porte-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }
        .porte-card {
          padding: 16px;
          text-align: center;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .porte-card-name {
          font-size: 14px;
          font-weight: 600;
        }
        .porte-card-example {
          font-size: 10px;
          color: var(--text-muted);
        }
        .service-card {
          padding: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 20px;
          width: 100%;
          box-sizing: border-box;
        }
        .service-price {
          font-weight: 700;
          color: var(--gold-accent);
          white-space: nowrap;
          margin-left: auto;
        }
        @media (max-width: 768px) {
          .budget-hero {
            height: auto;
            padding: 60px 0 40px 0;
          }
          .budget-hero h1 {
            font-size: 28px;
          }
          .budget-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .budget-summary-sticky {
            position: static;
          }
          .porte-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
          }
          .porte-card {
            padding: 10px 8px;
          }
          .porte-card-name {
            font-size: 12px;
          }
          .porte-card-example {
            font-size: 9px;
          }
          .service-card {
            padding: 16px 12px;
            gap: 12px;
          }
          .btn-primary.w-full {
            width: 100% !important;
          }
        }
      `}</style>

      <section className="budget-hero">
        <div className="container">
          <h1>Simule seu Orçamento</h1>
          <p>Personalize os serviços para o seu veículo e obtenha uma estimativa instantânea.</p>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="budget-grid">
            {/* Left Column */}
            <div className="flex flex-col gap-12">
              {/* Step 1 — Porte */}
              <div>
                <span className="label-tag" style={{ display: 'block', marginBottom: '24px' }}>SELECIONE O PORTE DO VEÍCULO</span>
                <div className="porte-grid">
                  {portes.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => setSelectedPorte(p.id)}
                      className="card porte-card"
                      style={{ 
                        borderColor: selectedPorte === p.id ? 'var(--gold-accent)' : 'var(--border)',
                        backgroundColor: selectedPorte === p.id ? '#2E2E2E' : 'var(--surface-card)',
                      }}
                    >
                      <span className="porte-card-name">{p.name}</span>
                      <span className="porte-card-example">{p.examples.split(',')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2 — Serviços */}
              <div style={{ opacity: selectedPorte ? 1 : 0.5, pointerEvents: selectedPorte ? 'auto' : 'none' }}>
                <span className="label-tag" style={{ display: 'block', marginBottom: '24px' }}>SELECIONE OS SERVIÇOS</span>
                <div className="flex flex-col gap-4">
                  {services.map(s => (
                    <div 
                      key={s.id}
                      onClick={() => toggleService(s.id)}
                      className="card service-card"
                      style={{ 
                        borderLeft: selectedServices.includes(s.id) ? '4px solid var(--gold-accent)' : '0.5px solid var(--border)',
                        backgroundColor: selectedServices.includes(s.id) ? '#2E2E2E' : 'var(--surface-card)'
                      }}
                    >
                      <div style={{ 
                        width: '24px', 
                        height: '24px', 
                        minWidth: '24px',
                        border: '2px solid var(--gold-accent)',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: selectedServices.includes(s.id) ? 'var(--gold-accent)' : 'transparent'
                      }}>
                        {selectedServices.includes(s.id) && <Check size={16} color="#0D0D0D" strokeWidth={3} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>{s.name}</h3>
                        <p style={{ fontSize: '13px' }}>{s.desc}</p>
                      </div>
                      <div className="service-price">
                        {selectedPorte ? `R$ ${s.prices[selectedPorte]}` : '---'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column — Summary */}
            <div className="budget-summary-sticky">
              <div className="card" style={{ padding: '32px' }}>
                <h3 style={{ marginBottom: '24px', color: 'var(--gold-accent)' }}>Resumo do Orçamento</h3>
                
                <div className="flex flex-col gap-4" style={{ marginBottom: '24px' }}>
                  {!selectedPorte && <p style={{ fontSize: '14px', fontStyle: 'italic' }}>Selecione o porte do veículo...</p>}
                  {selectedPorte && selectedServices.length === 0 && <p style={{ fontSize: '14px', fontStyle: 'italic' }}>Selecione ao menos um serviço...</p>}
                  
                  {selectedServices.map(serviceId => {
                    const s = services.find(x => x.id === serviceId);
                    return (
                      <div key={serviceId} className="flex justify-between" style={{ fontSize: '14px' }}>
                        <span>{s.name}</span>
                        <span style={{ fontWeight: '600' }}>R$ {s.prices[selectedPorte]}</span>
                      </div>
                    );
                  })}
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', marginBottom: '32px' }}>
                  <div className="flex justify-between items-end">
                    <span style={{ color: 'var(--text-secondary)' }}>Total estimado</span>
                    <span style={{ fontSize: '32px', fontWeight: '700', color: 'var(--gold-accent)', lineHeight: 1 }}>
                      R$ {total.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>

                <div className="badge-pill" style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', backgroundColor: 'rgba(255, 204, 0, 0.1)', color: '#FFCC00', padding: '12px', borderRadius: '8px', marginBottom: '24px', width: '100%', boxSizing: 'border-box' }}>
                  <Info size={16} />
                  <span style={{ fontSize: '11px', fontWeight: '600' }}>⚡ Estimativa — valores podem variar após avaliação física</span>
                </div>

                <button 
                  className="btn-primary w-full" 
                  disabled={!selectedPorte || selectedServices.length === 0}
                  style={{ opacity: (!selectedPorte || selectedServices.length === 0) ? 0.5 : 1, width: '100%' }}
                  onClick={handleBooking}
                >
                  Agendar com estes serviços
                </button>
                
                <button 
                  onClick={() => { setSelectedServices([]); setSelectedPorte(null); }}
                  style={{ background: 'transparent', color: 'var(--text-muted)', width: '100%', marginTop: '16px', fontSize: '13px' }}
                >
                  Limpar seleção
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Budget;
