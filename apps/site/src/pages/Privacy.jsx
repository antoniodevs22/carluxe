import React from 'react';
import { motion } from 'framer-motion';

const Privacy = () => {
  return (
    <div style={{ paddingTop: '120px', paddingBottom: '80px', backgroundColor: 'var(--bg-main)' }}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="label-tag">POLÍTICAS</span>
          <h1 style={{ marginTop: '16px', marginBottom: '40px' }}>Privacidade</h1>
          
          <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', maxWidth: '800px' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>1. Coleta de Informações</h3>
            <p style={{ marginBottom: '24px' }}>
              Coletamos informações necessárias para a prestação de nossos serviços de estética automotiva, como nome, telefone e dados do veículo, quando você solicita um orçamento ou agendamento.
            </p>

            <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>2. Uso de Dados</h3>
            <p style={{ marginBottom: '24px' }}>
              Seus dados são utilizados exclusivamente para processar seus pedidos, enviar atualizações sobre o serviço do seu veículo e, caso autorizado, informar sobre promoções e novidades da CAR LUXE.
            </p>

            <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>3. Proteção de Dados</h3>
            <p style={{ marginBottom: '24px' }}>
              Implementamos medidas de segurança para garantir a proteção de suas informações pessoais contra acesso não autorizado ou divulgação.
            </p>

            <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>4. Cookies</h3>
            <p style={{ marginBottom: '24px' }}>
              Utilizamos cookies para melhorar sua experiência em nosso site e entender como os visitantes interagem com nossas páginas.
            </p>

            <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>5. Contato</h3>
            <p style={{ marginBottom: '24px' }}>
              Se você tiver dúvidas sobre nossa política de privacidade, entre em contato através do e-mail: contato@carluxe.com.br
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;
