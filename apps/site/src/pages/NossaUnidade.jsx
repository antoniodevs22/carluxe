import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Mail, ExternalLink } from 'lucide-react';

const NossaUnidade = () => {
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3986.101740618037!2d-44.2698352!3d-2.4937763!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7f68dbd71647e95%3A0x986655a95ffb6725!2sCarluxe!5e0!3m2!1spt-BR!2sbr!4v1713943600000!5m2!1spt-BR!2sbr";
  const directionsUrl = "https://www.google.com/maps/dir/-2.5012599,-44.2573764/Carluxe,+Av.+dos+Holandeses,+06+-+Calhau,+S%C3%A3o+Lu%C3%ADs+-+MA,+65071-380/@-2.5025995,-44.2762931,13.75z/data=!4m9!4m8!1m1!4e1!1m5!1m1!1s0x7f68dbd71647e95:0x986655a95ffb6725!2m2!1d-44.2676466!2d-2.4937763?entry=ttu&g_ep=EgoyMDI2MDQyMi4wIKXMDSoASAFQAw%3D%3D";

  return (
    <div style={{ paddingTop: '100px', backgroundColor: 'var(--bg-main)' }}>
      <section>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: '60px' }}
          >
            <h1 style={{ fontSize: '56px', fontWeight: '700', marginBottom: '24px' }}>
              ONDE O LUXO <br />
              <span style={{ 
                background: 'var(--brand-gradient)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent' 
              }}>ENCONTRA A PERFEIÇÃO</span>
            </h1>
            <p style={{ maxWidth: '600px', fontSize: '18px', lineHeight: '1.6' }}>
              Visite nosso showroom e oficina técnica em São Luís. Um ambiente projetado para oferecer o máximo conforto para você e o melhor cuidado para seu veículo.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-16 items-start">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col gap-16"
              style={{ paddingRight: '40px' }}
            >
              {/* Endereço */}
              <div className="flex gap-8 items-start">
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '16px', 
                  backgroundColor: 'rgba(201, 168, 76, 0.08)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--gold-accent)',
                  flexShrink: 0,
                  border: '1px solid rgba(201, 168, 76, 0.15)'
                }}>
                  <MapPin size={28} />
                </div>
                <div style={{ paddingTop: '8px' }}>
                  <h3 style={{ textTransform: 'uppercase', fontSize: '13px', fontWeight: '700', letterSpacing: '0.15em', color: 'var(--gold-accent)', marginBottom: '16px' }}>
                    Endereço
                  </h3>
                  <p style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '18px', fontWeight: '500', lineHeight: '1.5' }}>
                    Av. dos Holandeses, 06 - Calhau<br />
                    São Luís - MA, 65071-380
                  </p>
                  <a 
                    href={directionsUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ 
                      color: 'var(--text-secondary)', 
                      textDecoration: 'none', 
                      fontSize: '12px', 
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--gold-accent)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                  >
                    Ver no Google Maps <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              {/* Horário */}
              <div className="flex gap-8 items-start">
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '16px', 
                  backgroundColor: 'rgba(201, 168, 76, 0.08)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--gold-accent)',
                  flexShrink: 0,
                  border: '1px solid rgba(201, 168, 76, 0.15)'
                }}>
                  <Clock size={28} />
                </div>
                <div className="w-full" style={{ paddingTop: '8px' }}>
                  <h3 style={{ textTransform: 'uppercase', fontSize: '13px', fontWeight: '700', letterSpacing: '0.15em', color: 'var(--gold-accent)', marginBottom: '16px' }}>
                    Horário de Funcionamento
                  </h3>
                  <div className="flex flex-col gap-4" style={{ maxWidth: '350px' }}>
                    <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Segunda - Sexta</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>08h às 19h</span>
                    </div>
                    <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Sábado</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>09h às 13h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Domingo</span>
                      <span style={{ color: 'var(--gold-accent)', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase' }}>Fechado</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contato */}
              <div className="flex gap-8 items-start">
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '16px', 
                  backgroundColor: 'rgba(201, 168, 76, 0.08)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--gold-accent)',
                  flexShrink: 0,
                  border: '1px solid rgba(201, 168, 76, 0.15)'
                }}>
                  <Phone size={28} />
                </div>
                <div style={{ paddingTop: '8px' }}>
                  <h3 style={{ textTransform: 'uppercase', fontSize: '13px', fontWeight: '700', letterSpacing: '0.15em', color: 'var(--gold-accent)', marginBottom: '16px' }}>
                    Contato Direto
                  </h3>
                  <p style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '24px', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                    +55 (98) 99123-4567
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
                    contato@carluxe.com.br
                  </p>
                </div>
              </div>

              {/* Instagram */}
              <div className="flex gap-8 items-start">
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '16px', 
                  backgroundColor: 'rgba(201, 168, 76, 0.08)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--gold-accent)',
                  flexShrink: 0,
                  border: '1px solid rgba(201, 168, 76, 0.15)'
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </div>
                <div style={{ paddingTop: '8px' }}>
                  <h3 style={{ textTransform: 'uppercase', fontSize: '13px', fontWeight: '700', letterSpacing: '0.15em', color: 'var(--gold-accent)', marginBottom: '16px' }}>
                    Social Media
                  </h3>
                  <a 
                    href="https://www.instagram.com/carluxeoficial/" 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ 
                      color: 'var(--text-primary)', 
                      textDecoration: 'none', 
                      fontSize: '20px', 
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--gold-accent)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--text-primary)'}
                  >
                    @carluxeoficial
                    <ExternalLink size={16} style={{ opacity: 0.5 }} />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Mapa */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{ 
                height: '500px', 
                borderRadius: '24px', 
                overflow: 'hidden',
                border: '1px solid var(--border)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
              }}
            >
              <iframe 
                src={mapUrl}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NossaUnidade;
