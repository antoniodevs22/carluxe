import React from 'react';
import { motion } from 'framer-motion';

const Terms = () => {
  return (
    <div style={{ paddingTop: '120px', paddingBottom: '80px', backgroundColor: 'var(--bg-main)' }}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="label-tag">LEGAL</span>
          <h1 style={{ marginTop: '16px', marginBottom: '40px' }}>Termos e Serviços</h1>
          
          <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', maxWidth: '800px' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>1. Aceitação dos Termos</h3>
            <p style={{ marginBottom: '24px' }}>
              Ao acessar o site da CAR LUXE, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis.
            </p>

            <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>2. Uso de Licença</h3>
            <p style={{ marginBottom: '24px' }}>
              É concedida permissão para baixar temporariamente uma cópia dos materiais no site apenas para visualização transitória pessoal e não comercial.
            </p>

            <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>3. Serviços de Estética</h3>
            <p style={{ marginBottom: '24px' }}>
              Os serviços agendados estão sujeitos à disponibilidade e avaliação técnica prévia do veículo. A CAR LUXE reserva-se o direito de ajustar orçamentos caso sejam identificadas necessidades adicionais durante a execução.
            </p>

            <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>4. Limitações</h3>
            <p style={{ marginBottom: '24px' }}>
              Em nenhum caso a CAR LUXE ou seus fornecedores serão responsáveis por quaisquer danos decorrentes do uso ou da incapacidade de usar os materiais em nosso site.
            </p>

            <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>5. Revisões e Erratas</h3>
            <p style={{ marginBottom: '24px' }}>
              Os materiais exibidos no site podem incluir erros técnicos, tipográficos ou fotográficos. A CAR LUXE não garante que qualquer material em seu site seja preciso, completo ou atual.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
