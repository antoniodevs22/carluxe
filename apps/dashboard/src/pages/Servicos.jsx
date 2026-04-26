import { useState } from 'react';
import { Edit2, Clock, Plus, Trash2 } from 'lucide-react';
import { useModal } from '../context/ModalContext';

const ServiceCard = ({ category, title, description, prices, duration, active, onEdit }) => (
  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span className="label-gold">{category}</span>
      <div style={{ 
        width: '32px', height: '16px', borderRadius: '10px', 
        backgroundColor: active ? 'rgba(34, 197, 94, 0.2)' : 'var(--border)',
        position: 'relative', cursor: 'pointer'
      }}>
        <div style={{ 
          width: '12px', height: '12px', borderRadius: '50%', 
          backgroundColor: active ? 'var(--status-pronto)' : 'var(--text-muted)',
          position: 'absolute', right: active ? '2px' : 'auto', left: active ? 'auto' : '2px', top: '2px'
        }}></div>
      </div>
    </div>
    
    <div>
      <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '8px' }}>{title}</h3>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{description}</p>
    </div>

    <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {Object.entries(prices).map(([size, price]) => (
        <div key={size} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
          <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>{size}</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>R$ {price}</span>
        </div>
      ))}
    </div>

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={14} /> {duration}
        </span>
        <button 
          className="btn-ghost" 
          style={{ padding: '4px', color: 'var(--status-cancelado)' }}
          onClick={() => { if(confirm('Remover este serviço?')) alert('Serviço removido'); }}
        >
          <Trash2 size={14} />
        </button>
      </div>
      <button className="btn-secondary" style={{ padding: '6px 16px', fontSize: '12px' }} onClick={onEdit}>
        Editar
      </button>
    </div>
  </div>
);

const Servicos = () => {
  const { openNewServiceModal, openEditServiceModal } = useModal();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const categories = ['Todos', 'Lavagem', 'Polimento', 'Vitrificação', 'Higienização', 'PPF', 'Estética'];

  const servicesData = [
    { 
      category: 'LAVAGEM',
      title: 'Lavagem Premium',
      description: 'Limpeza completa com detalhamento de rodas, caixa de rodas e aplicação de selante rápido.',
      duration: '1h30',
      active: true,
      prices: { Pequeno: 120, Médio: 150, Grande: 180, SUV: 200, Pickup: 220 }
    },
    { 
      category: 'POLIMENTO',
      title: 'Polimento Técnico',
      description: 'Remoção de riscos superficiais, oxidação e devolução do brilho original da pintura.',
      duration: '4h00',
      active: true,
      prices: { Pequeno: 600, Médio: 750, Grande: 900, SUV: 1050, Pickup: 1200 }
    },
    { 
      category: 'VITRIFICAÇÃO',
      title: 'Vitrificação Cerâmica',
      description: 'Proteção de longa duração contra agentes químicos e raios UV com dureza 9H.',
      duration: '8h00',
      active: true,
      prices: { Pequeno: 1200, Médio: 1500, Grande: 1800, SUV: 2100, Pickup: 2400 }
    },
    { 
      category: 'PPF',
      title: 'Película Protetora (PPF)',
      description: 'Aplicação de filme de poliuretano para proteção física extrema contra pedriscos e riscos.',
      duration: '12h00',
      active: true,
      prices: { Pequeno: 2500, Médio: 3500, Grande: 4500, SUV: 5500, Pickup: 6500 }
    },
    { 
      category: 'HIGIENIZAÇÃO',
      title: 'Higienização Interna',
      description: 'Limpeza profunda de estofados, painel, teto e carpetes com eliminação de ácaros.',
      duration: '3h00',
      active: true,
      prices: { Pequeno: 250, Médio: 300, Grande: 350, SUV: 400, Pickup: 450 }
    },
    { 
      category: 'ESTÉTICA',
      title: 'Estética Completa',
      description: 'Pacote completo unindo polimento, higienização e vitrificação de vidros e plásticos.',
      duration: '16h00',
      active: true,
      prices: { Pequeno: 1800, Médio: 2200, Grande: 2600, SUV: 3000, Pickup: 3400 }
    }
  ];

  const filteredServices = activeCategory === 'Todos' 
    ? servicesData 
    : servicesData.filter(s => s.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Filtros Categoria e Botão Novo */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              style={{ 
                padding: '8px 20px', 
                borderRadius: '999px', 
                border: cat === activeCategory ? '1px solid var(--gold)' : '1px solid var(--border)',
                backgroundColor: cat === activeCategory ? 'rgba(201, 168, 76, 0.1)' : 'transparent',
                color: cat === activeCategory ? 'var(--gold)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '13px',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
        <button 
          className="btn-secondary" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px' }}
          onClick={openNewServiceModal}
        >
          <Plus size={18} />
          Novo Serviço
        </button>
      </div>

      {/* Grid de Serviços */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '24px' 
      }}>
        {filteredServices.map((service, idx) => (
          <ServiceCard 
            key={idx}
            {...service}
            onEdit={openEditServiceModal}
          />
        ))}
        {filteredServices.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            Nenhum serviço encontrado nesta categoria.
          </div>
        )}
      </div>
    </div>
  );
};

export default Servicos;
