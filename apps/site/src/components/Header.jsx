import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Serviços', path: '/servicos' },
    { name: 'Orçamento', path: '/orcamento' },
    { name: 'Agendar', path: '/agendar' },
  ];

  const headerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 100,
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.3s ease',
    backgroundColor: isScrolled || menuAberto ? 'rgba(13, 13, 13, 0.95)' : 'transparent',
    backdropFilter: isScrolled || menuAberto ? 'blur(10px)' : 'none',
    borderBottom: isScrolled || menuAberto ? '1px solid #2E2E2E' : 'none'
  };

  return (
    <>
      <style>{`
        .desktop-nav {
          display: flex;
        }
        .mobile-btn {
          display: none;
        }
        .nav-mobile {
          display: none;
        }
        
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-btn {
            display: block;
          }
          .nav-mobile {
            display: flex;
            position: absolute;
            top: 80px;
            left: 0;
            width: 100%;
            flex-direction: column;
            background-color: #0D0D0D;
            padding: 24px;
            gap: 24px;
            border-bottom: 1px solid #2E2E2E;
            transform: translateY(-150%);
            transition: transform 0.3s ease;
            z-index: 99;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          }
          .nav-mobile.aberto {
            transform: translateY(0);
          }
        }
      `}</style>

      <header style={headerStyle}>
        <div className="flex items-center justify-between w-full" style={{ padding: '0 5%', maxWidth: '1800px', margin: '0 auto' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <img src="/logo.png" alt="Carluxe Logo" style={{ height: '40px', width: 'auto' }} />
          </Link>

          <nav className="desktop-nav items-center" style={{ gap: '64px' }}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                style={{
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: location.pathname === link.path ? 'var(--gold-accent)' : 'var(--text-secondary)',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== link.path) {
                    e.target.style.color = 'var(--text-primary)';
                    e.target.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== link.path) {
                    e.target.style.color = 'var(--text-secondary)';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="desktop-nav">
            <Link to="/acompanhar" className="btn-secondary" style={{ padding: '12px 24px', fontSize: '13px', textDecoration: 'none', fontWeight: '700' }}>
              ACOMPANHAR MEU CARRO
            </Link>
          </div>

          <button 
            className="mobile-btn"
            onClick={() => setMenuAberto(!menuAberto)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            {menuAberto ? '✕' : '☰'}
          </button>
        </div>
      </header>

      <nav className={`nav-mobile ${menuAberto ? 'aberto' : ''}`}>
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            onClick={() => setMenuAberto(false)}
            style={{
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
              color: location.pathname === link.path ? 'var(--gold-accent)' : 'var(--text-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            {link.name}
          </Link>
        ))}
        <Link 
          to="/acompanhar" 
          onClick={() => setMenuAberto(false)}
          className="btn-secondary" 
          style={{ padding: '14px 24px', fontSize: '14px', textDecoration: 'none', fontWeight: '700', textAlign: 'center', marginTop: '16px' }}
        >
          ACOMPANHAR MEU CARRO
        </Link>
      </nav>
    </>
  );
};

export default Header;
