import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowX: 'hidden' }}>
      <Header />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
      
      <a href="https://wa.me/5598992341126?text=Ol%C3%A1%2C%20estou%20no%20site%20da%20Carluxe%20e%20preciso%20de%20atendimento" 
         className="whatsapp-float" 
         target="_blank" 
         rel="noreferrer">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.031 0C5.385 0 0 5.386 0 12.032c0 2.128.553 4.205 1.604 6.03L.045 23.951l6.042-1.584A11.96 11.96 0 0012.031 24c6.645 0 12.031-5.385 12.031-12.031C24.062 5.386 18.676 0 12.031 0zm3.555 17.273c-.53.147-1.52.548-2.915-.028-2.176-.9-3.766-2.92-4.148-3.414-.147-.193-1.077-1.433-1.077-2.735 0-1.303.676-1.95.918-2.191.242-.242.593-.306.79-.306.196 0 .392.003.555.011.177.011.417-.07.633.45.228.549.771 1.884.84 2.025.07.142.115.308.017.502-.095.196-.145.316-.29.48-.145.163-.312.355-.443.493-.142.148-.293.308-.131.588.161.278.718 1.187 1.542 1.922 1.066.95 1.968 1.241 2.246 1.385.278.145.437.123.599-.044.161-.166.697-.81.884-1.088.188-.278.375-.232.628-.142.253.09 1.597.753 1.869.89.273.136.456.204.523.318.067.114.067.663-.223 1.488z"/>
        </svg>
      </a>
    </div>
  );
};

export default Layout;
