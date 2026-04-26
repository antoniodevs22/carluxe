import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, Zap, Shield, Wind, Layers, Star, 
  ChevronDown, Trophy, FlaskConical, Camera, Clock 
} from 'lucide-react';
import heroBg from '../assets/hero-bg.png';

const Home = () => {
  const services = [
    { icon: <Sparkles size={24} />, name: 'Lavagem Premium', desc: 'Lavagem completa com produtos profissionais alemães', price: '120' },
    { icon: <Zap size={24} />, name: 'Polimento Técnico', desc: 'Remoção de riscos e restauração total do brilho', price: '590' },
    { icon: <Shield size={24} />, name: 'Vitrificação Cerâmica', desc: 'Proteção de longa duração contra agentes externos', price: '1.890' },
    { icon: <Wind size={24} />, name: 'Higienização Interna', desc: 'Sanitização e limpeza profunda de todos os tecidos', price: '350' },
    { icon: <Layers size={24} />, name: 'PPF (Película Protetora)', desc: 'Proteção física da pintura contra impactos e arranhões', price: '2.500' },
    { icon: <Star size={24} />, name: 'Estética Completa', desc: 'Pacote completo com todos os serviços combinados', price: '3.200' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        height: '100vh', 
        position: 'relative', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: 0,
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -1
        }}></div>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.65)',
          zIndex: -1
        }}></div>

        <div className="container text-center" style={{ zIndex: 1 }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="badge-pill" style={{ marginBottom: '24px' }}>
              ✦ ESTÉTICA AUTOMOTIVA PREMIUM
            </div>
            <h1 style={{ marginBottom: '24px', maxWidth: '800px', margin: '0 auto 24px' }}>
              Seu carro merece <br /> o melhor cuidado
            </h1>
            <p style={{ marginBottom: '40px', fontSize: '20px' }}>
              Serviços de alto padrão para veículos que exigem excelência
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/orcamento" className="btn-primary" style={{ textDecoration: 'none' }}>
                Fazer orçamento
              </Link>
              <Link to="/servicos" className="btn-outline-white" style={{ textDecoration: 'none' }}>
                Ver serviços
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ position: 'absolute', bottom: '40px', color: 'var(--text-secondary)' }}
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* Services Section */}
      <section>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '60px' }}>
            <span className="label-tag">O QUE FAZEMOS</span>
            <h2 style={{ marginTop: '12px' }}>Serviços que transformam seu veículo</h2>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {services.map((s, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="card"
              >
                <div style={{ color: 'var(--gold-accent)', marginBottom: '20px' }}>
                  {s.icon}
                </div>
                <h3 style={{ marginBottom: '12px' }}>{s.name}</h3>
                <p style={{ marginBottom: '24px', fontSize: '14px' }}>{s.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--gold-accent)', fontWeight: '600' }}>
                    a partir de R$ {s.price}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center" style={{ marginTop: '60px' }}>
            <Link to="/servicos" className="btn-secondary" style={{ textDecoration: 'none' }}>
              Ver todos os serviços
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section style={{ backgroundColor: 'var(--bg-page)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '60px' }}>
            <span className="label-tag">O PROCESSO</span>
            <h2 style={{ marginTop: '12px' }}>Simples, rápido e transparente</h2>
          </div>

          <div className="grid grid-cols-3 gap-8 relative">
            {/* Connector Line (Desktop) */}
            <div style={{ 
              position: 'absolute', 
              top: '40px', 
              left: '10%', 
              right: '10%', 
              height: '1px', 
              backgroundColor: 'var(--border)', 
              zIndex: 0 
            }}></div>

            {[
              { n: '01', title: 'Escolha os serviços', desc: 'Selecione o que seu veículo precisa e simule o orçamento' },
              { n: '02', title: 'Agende online', desc: 'Escolha data e horário sem sair de casa' },
              { n: '03', title: 'Acompanhe em tempo real', desc: 'Receba atualizações de cada etapa do serviço' },
            ].map((step, i) => (
              <div key={i} className="text-center" style={{ zIndex: 1, position: 'relative' }}>
                <div style={{ 
                  fontSize: '48px', 
                  fontWeight: '700', 
                  color: 'var(--gold-accent)', 
                  marginBottom: '20px',
                  backgroundColor: 'var(--bg-page)',
                  display: 'inline-block',
                  padding: '0 20px'
                }}>
                  {step.n}
                </div>
                <h3 style={{ marginBottom: '12px' }}>{step.title}</h3>
                <p style={{ fontSize: '14px' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Car Luxe */}
      <section>
        <div className="container">
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col justify-center">
              <span className="label-tag">DIFERENCIAIS</span>
              <h2 style={{ marginTop: '12px', marginBottom: '40px' }}>Por que a CAR LUXE?</h2>
              
              <div className="grid grid-cols-2 gap-8">
                {[
                  { icon: <Trophy />, title: '10 anos de experiência', desc: 'especialistas certificados em marcas premium' },
                  { icon: <FlaskConical />, title: 'Produtos de alto padrão', desc: 'parceiros Motul, Carpro e 3M' },
                  { icon: <Camera />, title: 'Registro fotográfico', desc: 'documentamos cada etapa do processo' },
                  { icon: <Clock />, title: 'Entrega no prazo', desc: 'compromisso com seu tempo' },
                ].map((d, i) => (
                  <div key={i}>
                    <div style={{ color: 'var(--gold-accent)', marginBottom: '12px' }}>{d.icon}</div>
                    <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>{d.title}</h3>
                    <p style={{ fontSize: '14px' }}>{d.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ 
              borderRadius: '24px', 
              overflow: 'hidden', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              border: '1px solid var(--border)'
            }}>
              <img src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=1000" alt="Car Detail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section style={{ paddingTop: '0' }}>
        <div className="container">
          <div className="card text-center" style={{ padding: '80px 40px', borderRadius: '16px' }}>
            <h2 style={{ marginBottom: '16px' }}>Pronto para transformar seu carro?</h2>
            <p style={{ marginBottom: '40px' }}>Agende agora e sinta a diferença de um serviço verdadeiramente premium.</p>
            <Link to="/agendar" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
              Agendar agora
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
