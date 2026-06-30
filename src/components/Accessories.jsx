import React from 'react';
import { accessoriesData } from '../data/productsData';
import { MessageCircle } from 'lucide-react';
import './Accessories.css';

export default function Accessories() {
  const formatPrice = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getWhatsAppLink = (item) => {
    const number = "5492262225731";
    const text = `Hola! Me interesa consultar por el accesorio/herramienta:
*Marca:* ${item.brand}
*Nombre:* ${item.name}
*Precio:* ${formatPrice(item.price)}

¿Tienen disponibilidad para comprar?`;
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="accesorios" className="accessories-section">
      <div className="section-header">
        <span className="section-tag">Accesorios</span>
        <h2 className="section-title">Equipamiento & Herramientas</h2>
      </div>

      <div className="accessories-grid">
        {accessoriesData.map((item) => (
          <article key={item.id} className="accessory-card">
            <div className="accessory-image-container">
              <img 
                src={item.image} 
                alt={item.name} 
                className="accessory-image"
                loading="lazy"
              />
            </div>
            <div className="accessory-details">
              <span className="accessory-brand">{item.brand}</span>
              <h3 className="accessory-name">{item.name}</h3>
              <p className="accessory-desc">{item.description}</p>
              
              <div className="accessory-footer">
                <div className="accessory-price-box">
                  <span className="acc-price-label">Precio</span>
                  <span className="accessory-price">{formatPrice(item.price)}</span>
                </div>
                <a 
                  href={getWhatsAppLink(item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp-acc"
                >
                  <MessageCircle size={16} />
                  <span>Consultar</span>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
