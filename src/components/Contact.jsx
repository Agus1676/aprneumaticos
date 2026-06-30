import React from 'react';
import { MessageCircle, Phone, Mail, MapPin, Clock } from 'lucide-react';
import './Contact.css';

// Custom Instagram SVG matching Lucide style
const Instagram = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function Contact() {
  const contactMethods = [
    {
      icon: <MessageCircle size={24} />,
      name: "WhatsApp",
      value: "+54 9 2262 22-5731",
      link: "https://wa.me/5492262225731?text=Hola!%20Quiero%20hacer%20una%20consulta%20general.",
      color: "whatsapp"
    },
    {
      icon: <Instagram size={24} />,
      name: "Instagram",
      value: "@aprneumaticoss",
      link: "https://instagram.com/aprneumaticoss",
      color: "instagram"
    },
    {
      icon: <Phone size={24} />,
      name: "Llamar",
      value: "(2262) 225731",
      link: "tel:+5492262225731",
      color: "phone"
    },
    {
      icon: <Mail size={24} />,
      name: "Correo",
      value: "info@aprneumaticos.com.ar",
      link: "mailto:info@aprneumaticos.com.ar",
      color: "email"
    }
  ];

  return (
    <section id="contacto" className="contact-section">
      <div className="section-header">
        <span className="section-tag">Contacto</span>
        <h2 className="section-title">CANALES DE ATENCIÓN</h2>
      </div>

      <div className="contact-container">
        {/* Contact info grid */}
        <div className="contact-grid">
          {contactMethods.map((method, idx) => (
            <a 
              key={idx}
              href={method.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`contact-card ${method.color}`}
            >
              <div className="contact-icon-box">
                {method.icon}
              </div>
              <h3 className="contact-card-title">{method.name}</h3>
              <p className="contact-card-value">{method.value}</p>
            </a>
          ))}
        </div>

        {/* Location & Hours */}
        <div className="location-hours-box">
          {/* Location info */}
          <div className="info-block">
            <div className="block-title-row">
              <MapPin size={20} className="block-icon" />
              <h3>Nuestra Ubicación</h3>
            </div>
            <p className="block-desc">
              Necochea, Provincia de Buenos Aires, Argentina.<br />
              ¡Hacemos envíos gratis, rápidos y seguros a todo el país!
            </p>
          </div>

          {/* Business Hours */}
          <div className="info-block">
            <div className="block-title-row">
              <Clock size={20} className="block-icon" />
              <h3>Horarios de Atención</h3>
            </div>
            
            <div className="hours-table">
              <div className="hours-row">
                <span className="day">Lunes a Viernes</span>
                <span className="time">8:00 hs - 18:00 hs</span>
              </div>
              <div className="hours-row">
                <span className="day">Sábados</span>
                <span className="time">9:00 hs - 14:00 hs</span>
              </div>
              <div className="hours-row closed">
                <span className="day">Domingos</span>
                <span className="status">Cerrado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
