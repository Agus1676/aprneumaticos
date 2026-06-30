import React from 'react';
import { ShieldCheck, Truck, CreditCard } from 'lucide-react';
import './Services.css';

export default function Services() {
  const serviceItems = [
    {
      icon: <ShieldCheck size={32} className="service-icon" />,
      title: "Garantía Oficial",
      description: "Todos nuestros neumáticos cuentan con garantía oficial de fábrica para brindarte total tranquilidad."
    },
    {
      icon: <Truck size={32} className="service-icon" />,
      title: "Envíos Gratis a Todo el País",
      description: "Despachamos 100% gratis y de forma segura a cualquier punto del país. El envío no tiene ningún costo para vos."
    },
    {
      icon: <CreditCard size={32} className="service-icon" />,
      title: "3 y 6 Cuotas Sin Interés",
      description: "Pagá con tarjeta de crédito en 3 o 6 cuotas sin interés y aprovechá las mejores promociones bancarias."
    }
  ];

  return (
    <section id="servicios" className="services-section">
      <div className="section-header">
        <span className="section-tag">Servicios</span>
        <h2 className="section-title">¿POR QUÉ ELEGIR APR NEUMÁTICOSS?</h2>
      </div>

      <div className="services-grid">
        {serviceItems.map((item, idx) => (
          <div key={idx} className="service-card">
            <div className="service-icon-box">
              {item.icon}
            </div>
            <h3 className="service-card-title">{item.title}</h3>
            <p className="service-card-desc">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
