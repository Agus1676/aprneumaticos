import React from 'react';
import { MessageCircle, FileText, GitCompare } from 'lucide-react';
import './ProductCard.css';

export default function ProductCard({ product, onViewDetails, onAddToCompare, isCompared }) {
  const { brand, model, width, profile, rim, price, stock, tag, image } = product;

  // Format currency
  const formatPrice = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Generate WhatsApp link
  const getWhatsAppLink = () => {
    const number = "5492262225731"; // Real business whatsapp number
    const text = `Hola! Me interesa consultar por el neumático:
*Marca:* ${brand}
*Modelo:* ${model}
*Medida:* ${width}/${profile} R${rim}
*Precio:* ${formatPrice(price)}

¿Tienen disponibilidad y stock actualmente?`;
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  };

  return (
    <article className={`product-card ${isCompared ? 'compared-active' : ''}`}>
      {tag && <span className="product-tag">{tag}</span>}
      
      {/* Compare top toggle button */}
      <button 
        type="button" 
        className={`btn-compare-badge ${isCompared ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onAddToCompare(product);
        }}
        title="Comparar neumático"
      >
        <GitCompare size={14} />
        <span>{isCompared ? 'Quitar' : 'Comparar'}</span>
      </button>

      <div className="product-image-container">
        <img 
          src={image} 
          alt={`${brand} ${model}`} 
          className="product-image" 
          loading="lazy"
        />
      </div>

      <div className="product-details">
        <div className="product-brand-row">
          <span className="product-brand">{brand}</span>
          <span className={`product-stock ${stock <= 4 ? 'low-stock' : ''}`}>
            {stock > 0 ? `Stock: ${stock}` : 'Sin stock'}
          </span>
        </div>

        <h3 className="product-title">{model}</h3>
        
        <div className="product-measure">
          {profile === '--' ? (
            <>
              <span className="measure-badge">{width}</span>
              <span className="measure-separator">-</span>
              <span className="measure-badge">{rim}</span>
            </>
          ) : profile.includes('.') ? (
            <>
              <span className="measure-badge">{Math.round(parseFloat(width))}</span>
              <span className="measure-separator">x</span>
              <span className="measure-badge">{profile}</span>
              <span className="measure-separator">R</span>
              <span className="measure-badge">{rim}</span>
            </>
          ) : (
            <>
              <span className="measure-badge">{width}</span>
              <span className="measure-separator">/</span>
              <span className="measure-badge">{profile}</span>
              <span className="measure-separator">R</span>
              <span className="measure-badge">{rim}</span>
            </>
          )}
        </div>

        <div className="product-price-row">
          <div className="price-wrapper">
            <span className="price-label">Precio Contado</span>
            <span className="product-price">{formatPrice(price)}</span>
          </div>
        </div>

        <div className="product-actions-grid">
          <a 
            href={getWhatsAppLink()} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-whatsapp"
          >
            <MessageCircle size={14} />
            <span>Consultar</span>
          </a>
          
          <button 
            type="button" 
            onClick={() => onViewDetails(product)} 
            className="btn-details"
          >
            <FileText size={14} />
            <span>Detalles</span>
          </button>
        </div>
      </div>
    </article>
  );
}
