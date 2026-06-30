import React from 'react';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import './Footer.css';

export default function Footer({ onAdminAccess, sectionsConfig }) {
  const handleScrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getWhatsAppFloatingLink = () => {
    const number = "5492262225731";
    const text = "Hola! Quiero realizar una consulta por neumáticos/accesorios.";
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  };

  const handleAdminClick = (e) => {
    e.preventDefault();
    onAdminAccess(true);
  };

  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          {/* Col 1: Brand Info */}
          <div className="footer-col brand-col">
            <a href="#inicio" className="footer-logo-link" onClick={handleScrollToTop}>
              <img src="/logo.png" alt="APR Neumáticos" className="footer-logo-img" />
              <div className="footer-logo-text">
                <span className="footer-logo-title">APR</span>
                <span className="footer-logo-subtitle">NEUMÁTICOSS</span>
              </div>
            </a>
            <p className="footer-desc">
              Tu experto en neumáticos y accesorios de confianza. Brindamos asesoría personalizada y productos de máxima calidad en Necochea y todo el país.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="footer-col links-col">
            <h3 className="footer-title">Enlaces Rápidos</h3>
            <ul className="footer-links">
              <li><a href="#inicio">Inicio</a></li>
              {sectionsConfig.catalog && <li><a href="#catalogo">Catálogo Neumáticos</a></li>}
              {sectionsConfig.accessories && <li><a href="#accesorios">Accesorios & herramientas</a></li>}
              {sectionsConfig.services && <li><a href="#servicios">Nuestros Servicios</a></li>}
              {sectionsConfig.brands && <li><a href="#marcas">Marcas Aliadas</a></li>}
            </ul>
          </div>

          {/* Col 3: Contact Info */}
          <div className="footer-col info-col">
            <h3 className="footer-title">Contacto</h3>
            <ul className="footer-info-list">
              <li>
                <Phone size={14} className="info-icon" />
                <a href="tel:+5492262225731">(2262) 225731</a>
              </li>
              <li>
                <Mail size={14} className="info-icon" />
                <a href="mailto:info@aprneumaticos.com.ar" className="email-link">info@aprneumaticos.com.ar</a>
              </li>
              <li>
                <MapPin size={14} className="info-icon" />
                <span>Necochea, Buenos Aires</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <p>© {new Date().getFullYear()} APR Neumáticos. Todos los derechos reservados.</p>
          <a href="#admin" onClick={handleAdminClick} className="admin-link-footer" style={{ fontSize: '0.75rem', opacity: 0.5, transition: 'opacity 0.2s', textDecoration: 'underline' }}>
            Acceso Administración
          </a>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href={getWhatsAppFloatingLink()} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="whatsapp-floating-btn"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle size={28} />
        <span className="floating-badge">1</span>
      </a>
    </>
  );
}
