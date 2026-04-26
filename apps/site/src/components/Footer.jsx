import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ 
      backgroundColor: '#0D0D0D', 
      borderTop: '1px solid #2E2E2E',
      padding: '80px 0 40px 0',
      position: 'relative',
      overflow: 'visible',
      height: 'auto'
    }}>
      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }
        /* Social Card */
        .social-card {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0D0D0D;
          border: 1px solid rgba(201, 168, 76, 0.4);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          overflow: hidden;
          height: 50px;
          width: 220px;
          cursor: pointer;
          border-radius: 8px;
        }
        .social-card::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 50%;
          height: 100%;
          background-color: #C9A84C;
          transition: 0.35s linear;
          z-index: 1;
        }
        .social-card::after {
          content: "";
          position: absolute;
          right: 0;
          top: 0;
          width: 50%;
          height: 100%;
          background-color: #C9A84C;
          transition: 0.35s linear;
          z-index: 1;
        }
        .social-card:hover::before {
          transform: translateY(-100%);
        }
        .social-card:hover::after {
          transform: translateY(100%);
        }
        .social-card span {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          color: #0D0D0D;
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          z-index: 2;
          transition: opacity 0.2s;
          pointer-events: none;
        }
        .social-card:hover span {
          opacity: 0;
        }
        .social-card .social-link {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 25%;
          height: 100%;
          color: #C9A84C;
          text-decoration: none;
          z-index: 0;
          transition: 0.25s;
        }
        .social-card:hover .social-link {
          z-index: 3;
        }
        .social-card .social-link:hover {
          background-color: rgba(201, 168, 76, 0.15);
          animation: bounce_carluxe 0.4s linear;
        }
        @keyframes bounce_carluxe {
          40% { transform: scale(1.4); }
          60% { transform: scale(0.8); }
          80% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .footer-bottom-inner {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
          }
          footer {
            overflow: visible !important;
            height: auto !important;
            min-height: unset !important;
            padding-bottom: 48px !important;
          }
          footer .container {
            overflow: visible !important;
            height: auto !important;
          }
        }
      `}</style>

      {/* Accent line */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '2px', 
        background: 'var(--gold-accent)' 
      }}></div>

      <div className="container">
        <div className="footer-grid">
          {/* Logo & Tagline */}
          <div className="flex flex-col gap-4">
            <img src="/logo.png" alt="Carluxe Logo" style={{ height: '40px', width: 'auto', objectFit: 'contain', alignSelf: 'flex-start' }} />
            <p style={{ maxWidth: '250px', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
              Estética automotiva premium para quem não aceita menos que o melhor.
            </p>
            <div className="social-card" style={{ marginTop: '20px' }}>
              <span>REDES</span>
              {/* Instagram */}
              <a href="https://instagram.com/carluxeoficial" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              {/* Facebook */}
              <a href="https://facebook.com/carluxe" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              {/* YouTube */}
              <a href="https://youtube.com/@carluxe" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
                </svg>
              </a>
              {/* WhatsApp */}
              <a href="https://wa.me/5598992341126" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="WhatsApp">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-3">
            <span className="label-tag" style={{ marginBottom: '10px' }}>Links Úteis</span>
            {[
              { name: 'Serviços', path: '/servicos' },
              { name: 'Orçamento', path: '/orcamento' },
              { name: 'Agendar', path: '/agendar' },
              { name: 'Acompanhar', path: '/acompanhar' },
              { name: 'Nossa Unidade', path: '/nossa-unidade' },
            ].map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                style={{ 
                  color: 'var(--text-secondary)', 
                  textDecoration: 'none', 
                  fontSize: '14px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--gold-accent)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Localização */}
          <div className="flex flex-col gap-4">
            <span className="label-tag">LOCALIZAÇÃO</span>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              <p>
                Av. dos Holandeses, 06 - Calhau<br />
                São Luís - MA, 65071-380
              </p>
              
              <div style={{ marginTop: '20px' }}>
                <p><span style={{ color: 'var(--text-primary)' }}>Segunda a Sexta:</span> 08h às 17h</p>
                <p><span style={{ color: 'var(--text-primary)' }}>Sábado:</span> 08h às 14h</p>
              </div>

              <Link 
                to="/nossa-unidade" 
                style={{ 
                  marginTop: '20px', 
                  display: 'inline-block',
                  color: 'var(--gold-accent)',
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'opacity 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                📍 Ver no Google Maps
              </Link>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(201, 168, 76, 0.3)',
          marginTop: '40px',
          padding: '24px 0'
        }}>
          <div className="footer-bottom-inner" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>
              © 2025 CAR LUXE. Todos os direitos reservados.
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <Link to="/privacidade" style={{ color: 'var(--text-secondary)', fontSize: '12px', textDecoration: 'none' }}>
                Políticas de Privacidade
              </Link>
              <Link to="/termos" style={{ color: 'var(--text-secondary)', fontSize: '12px', textDecoration: 'none' }}>
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
