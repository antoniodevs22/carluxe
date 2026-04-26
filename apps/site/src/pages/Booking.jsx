import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, ChevronLeft, Calendar as CalendarIcon, Clock as ClockIcon, Loader2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@carluxe/shared';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [servicesList, setServicesList] = useState([]);
  const [bookingResult, setBookingResult] = useState(null);
  const [horariosOcupados, setHorariosOcupados] = useState([]);

  const today = new Date().toISOString().split('T')[0];

  const porteParam = searchParams.get('porte') || 'medio';
  const servicosParamString = searchParams.get('servicos');
  const initialServices = servicosParamString 
    ? servicosParamString.split(',').filter(id => id.trim() !== '')
    : [];

  const [formData, setFormData] = useState({
    name: '', phone: '', email: '',
    brand: '', model: '', year: '', color: '', plate: '', porte: porteParam,
    services: initialServices, date: '', time: '', notes: ''
  });

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase.from('servicos').select('*');
      if (data) setServicesList(data);
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchOccupiedTimes = async () => {
      if (!formData.date) {
        setHorariosOcupados([]);
        return;
      }
      
      const { data } = await supabase
        .from('agendamentos')
        .select('data_hora')
        .gte('data_hora', `${formData.date}T00:00:00`)
        .lt('data_hora', `${formData.date}T23:59:59`)
        .neq('status', 'cancelado');
      
      if (data) {
        const occupied = data.map(agend => {
          const utcString = agend.data_hora;
          const date = new Date(utcString);
          const brasiliaHour = String(date.getHours()).padStart(2, '0');
          const brasiliaMinute = String(date.getMinutes()).padStart(2, '0');
          return `${brasiliaHour}:${brasiliaMinute}`;
        });
        setHorariosOcupados(occupied);
      }
    };
    
    fetchOccupiedTimes();
  }, [formData.date]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleService = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const calculateTotal = () => {
    return formData.services.reduce((total, sId) => {
      const service = servicesList.find(s => s.id === sId);
      return total + (service?.preco || 0);
    }, 0);
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      // 0) Verificar disponibilidade (Prevenir duplicidade de última hora)
      const dateTime = formData.date + 'T' + formData.time + ':00';
      const { data: existing } = await supabase
        .from('agendamentos')
        .select('id')
        .ilike('data_hora', `${dateTime}%`)
        .neq('status', 'cancelado')
        .limit(1);

      if (existing && existing.length > 0) {
        alert('Este horário já foi reservado por outro cliente. Por favor, volte e escolha outro horário.');
        setLoading(false);
        return;
      }
      // a) Verificar se já existe cliente com aquele telefone
      let { data: cliente, error: clientError } = await supabase
        .from('clientes')
        .select('id')
        .eq('telefone', formData.phone)
        .single();

      let clienteId = cliente?.id;

      // b) Se não existir -> INSERT em clientes
      if (!clienteId) {
        const { data: newClient, error: insertClientError } = await supabase
          .from('clientes')
          .insert([{ nome: formData.name, telefone: formData.phone, email: formData.email }])
          .select()
          .single();
        
        if (insertClientError) throw insertClientError;
        clienteId = newClient.id;
      }

      // c) INSERT em veiculos
      const vehicleData = {
        cliente_id: clienteId,
        marca: formData.brand,
        modelo: formData.model,
        ano: parseInt(formData.year) || new Date().getFullYear(),
        cor: formData.color,
        placa: formData.plate,
        porte: formData.porte.trim()
      };
      
      console.log('Enviando dados do veículo:', vehicleData);

      const { data: veiculo, error: vehicleError } = await supabase
        .from('veiculos')
        .insert([vehicleData])
        .select()
        .single();

      if (vehicleError) throw vehicleError;

      // d) INSERT em agendamentos
      const total = calculateTotal();
      const { data: agendamento, error: agendError } = await supabase
        .from('agendamentos')
        .insert([{
          cliente_id: clienteId,
          veiculo_id: veiculo.id,
          data_hora: `${formData.date}T${formData.time}:00`,
          servicos_ids: formData.services,
          status: 'pendente',
          valor_estimado: total,
          observacoes: formData.notes
        }])
        .select()
        .single();

      if (agendError) throw agendError;

      setBookingResult({
        id: agendamento.id,
        date: formData.date,
        time: formData.time,
        vehicle: `${formData.brand} ${formData.model}`,
        services: servicesList.filter(s => formData.services.includes(s.id)).map(s => s.nome).join(', '),
        total: total
      });

      setIsSuccess(true);
    } catch (error) {
      alert('Erro ao realizar agendamento: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { n: 1, label: 'Seus dados' },
    { n: 2, label: 'Seu veículo' },
    { n: 3, label: 'Serviços e data' },
  ];

  if (isSuccess && bookingResult) {
    const formattedDate = new Date(bookingResult.date).toLocaleDateString('pt-BR');
    return (
      <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card text-center" 
          style={{ maxWidth: '500px', padding: '60px 40px' }}
        >
          <div style={{ color: '#22C55E', marginBottom: '24px' }}>
            <CheckCircle2 size={80} strokeWidth={1.5} />
          </div>
          <h2 style={{ marginBottom: '16px' }}>Agendamento realizado!</h2>
          <div className="badge-pill" style={{ marginBottom: '32px' }}>#AG-{bookingResult.id.substring(0, 8).toUpperCase()}</div>
          
          <div style={{ textAlign: 'left', backgroundColor: 'var(--bg-main)', padding: '24px', borderRadius: '8px', marginBottom: '32px', fontSize: '14px' }}>
            <p style={{ marginBottom: '8px' }}><strong>Data/Hora:</strong> {formattedDate} às {bookingResult.time}</p>
            <p style={{ marginBottom: '8px' }}><strong>Veículo:</strong> {bookingResult.vehicle}</p>
            <p><strong>Serviços:</strong> {bookingResult.services}</p>
            <p style={{ marginTop: '8px', color: 'var(--gold-accent)', fontWeight: '700' }}><strong>Valor Estimado:</strong> R$ {bookingResult.total.toFixed(2)}</p>
          </div>

          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '40px' }}>
            Entraremos em contato via WhatsApp para confirmar o agendamento.
          </p>

          <div className="flex flex-col gap-4">
            <Link to="/acompanhar" className="btn-secondary" style={{ textDecoration: 'none' }}>Acompanhar meu veículo</Link>
            <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '14px', textDecoration: 'none' }}>Voltar ao início</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-page)' }}>
      <section style={{ height: '30vh', display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <h1 style={{ fontSize: '40px' }}>Agendar Serviço</h1>
        </div>
      </section>

      <section>
        <div className="container" style={{ maxWidth: '800px' }}>
          {/* Stepper */}
          <div className="flex justify-between items-center relative" style={{ marginBottom: '60px' }}>
            <div style={{ position: 'absolute', top: '20px', left: '10%', right: '10%', height: '1px', backgroundColor: 'var(--border)', zIndex: 0 }}></div>
            {steps.map((s, idx) => (
              <div key={s.n} className="flex flex-col items-center gap-3" style={{ zIndex: 1, position: 'relative', width: '80px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: step === s.n ? 'var(--gold-accent)' : step > s.n ? 'var(--gold-accent)' : 'var(--bg-page)',
                  border: step >= s.n ? 'none' : '1px solid var(--border)',
                  color: step === s.n ? '#0D0D0D' : step > s.n ? '#0D0D0D' : 'var(--text-muted)',
                  fontWeight: '700'
                }}>
                  {step > s.n ? '✓' : s.n}
                </div>
                <span style={{ fontSize: '12px', fontWeight: '600', color: step === s.n ? 'var(--text-primary)' : 'var(--text-muted)' }}>{s.label}</span>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="card"
              style={{ padding: '40px' }}
            >
              {step === 1 && (
                <div className="flex flex-col gap-6">
                  <span className="label-tag">INFORMAÇÕES PESSOAIS</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>NOME COMPLETO *</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ex: João Silva" 
                        required
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>TELEFONE *</label>
                      <input 
                        type="text" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(11) 99999-9999" 
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>E-MAIL (OPCIONAL)</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="seu@email.com" 
                    />
                  </div>
                  <div className="flex justify-end" style={{ marginTop: '20px' }}>
                    <button className="btn-primary flex items-center gap-2" onClick={nextStep} disabled={!formData.name || !formData.phone}>
                      Próximo <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-6">
                  <span className="label-tag">DADOS DO VEÍCULO</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>MARCA</label>
                      <input 
                        type="text" 
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        placeholder="Ex: Porsche" 
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>MODELO</label>
                      <input 
                        type="text" 
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        placeholder="Ex: 911 Carrera S" 
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>ANO</label>
                      <input 
                        type="text" 
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        placeholder="Ex: 2024" 
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>PLACA</label>
                      <input 
                        type="text" 
                        name="plate"
                        value={formData.plate}
                        onChange={handleInputChange}
                        placeholder="Ex: ABC-1234" 
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>PORTE DO VEÍCULO</label>
                      <select 
                        name="porte"
                        value={formData.porte}
                        onChange={handleInputChange}
                        className="input-field"
                        style={{ backgroundColor: 'var(--bg-page)' }}
                      >
                        <option value="pequeno">Pequeno (Hatch, Sedan Compacto)</option>
                        <option value="medio">Médio (Sedan, SUV Compacto)</option>
                        <option value="grande">Grande (Pick-up, SUV Luxo)</option>
                        <option value="suv">SUV</option>
                        <option value="pickup">Pickup</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-between" style={{ marginTop: '20px' }}>
                    <button className="btn-secondary flex items-center gap-2" onClick={prevStep}>
                      <ChevronLeft size={20} /> Voltar
                    </button>
                    <button className="btn-primary flex items-center gap-2" onClick={nextStep}>
                      Próximo <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-8">
                  <div>
                    <span className="label-tag" style={{ display: 'block', marginBottom: '16px' }}>SERVIÇOS DESEJADOS</span>
                    <div className="flex gap-2 flex-wrap">
                      {servicesList.length === 0 ? (
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Carregando serviços...</p>
                      ) : servicesList.map(s => (
                        <div 
                          key={s.id} 
                          className="badge-pill" 
                          style={{ 
                            cursor: 'pointer', 
                            backgroundColor: formData.services.includes(s.id) ? 'var(--gold-accent)' : 'transparent',
                            color: formData.services.includes(s.id) ? '#0D0D0D' : 'var(--text-secondary)',
                            border: formData.services.includes(s.id) ? 'none' : '1px solid var(--border)'
                          }}
                          onClick={() => toggleService(s.id)}
                        >
                          {s.nome}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="label-tag" style={{ display: 'block', marginBottom: '16px' }}>DATA E HORÁRIO</span>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                          <CalendarIcon size={16} /> <span style={{ fontSize: '12px' }}>DATA</span>
                        </div>
                        <input 
                          type="date" 
                          name="date"
                          min={today}
                          value={formData.date}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                          <ClockIcon size={16} /> <span style={{ fontSize: '12px' }}>HORÁRIO</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map(t => {
                            const now = new Date();
                            const currentHourMinute = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
                            const isPast = formData.date === today && t < currentHourMinute;
                            const isOccupied = horariosOcupados.includes(t) || isPast;

                            return (
                              <div 
                                key={t} 
                                className="card" 
                                style={{ 
                                  padding: '8px', 
                                  fontSize: '12px', 
                                  textAlign: 'center', 
                                  cursor: isOccupied ? 'not-allowed' : 'pointer',
                                  backgroundColor: formData.time === t ? 'rgba(201, 168, 76, 0.2)' : 'transparent',
                                  borderColor: formData.time === t ? 'var(--gold)' : 'var(--border)',
                                  opacity: isOccupied ? 0.3 : 1
                                }}
                                onClick={() => !isOccupied && setFormData(prev => ({ ...prev, time: t }))}
                              >
                                {t}
                                {isOccupied && <span style={{display: 'block', fontSize: '10px', marginTop: '2px'}}>(ocupado)</span>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="label-tag" style={{ display: 'block', marginBottom: '16px' }}>OBSERVAÇÕES</span>
                    <textarea 
                      rows="4" 
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Algum detalhe especial que devemos saber?"
                    ></textarea>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-main)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>TOTAL ESTIMADO</p>
                        <p style={{ fontSize: '24px', fontWeight: '700', color: 'var(--gold-accent)' }}>R$ {calculateTotal().toFixed(2)}</p>
                      </div>
                      <div className="text-center">
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>PREVISÃO</p>
                        <p style={{ fontSize: '14px', fontWeight: '600' }}>Conforme serviços</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between" style={{ marginTop: '20px' }}>
                    <button className="btn-secondary flex items-center gap-2" onClick={prevStep}>
                      <ChevronLeft size={20} /> Voltar
                    </button>
                    <button className="btn-primary" onClick={handleFinish} disabled={loading || !formData.date || !formData.time || formData.services.length === 0}>
                      {loading ? <Loader2 className="animate-spin" /> : 'Confirmar agendamento'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default Booking;

