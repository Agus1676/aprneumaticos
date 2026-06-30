import React, { useState } from 'react';
import { X, ShieldCheck, Check, MessageCircle, HelpCircle, Calculator } from 'lucide-react';
import './ProductDetailModal.css';

export default function ProductDetailModal({ product, isOpen, onClose }) {
  if (!isOpen || !product) return null;

  const { brand, model, width, profile, rim, price, stock, tag, image, description, speedRating, loadIndex, features, category } = product;

  const [selectedPlan, setSelectedPlan] = useState(3); // 3 or 6 cuotas

  const formatPrice = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Calculator logic
  const getInstallmentDetails = () => {
    const interestRate = 0.33; // 33% surcharge for MercadoPago
    const finalPrice = price * (1 + interestRate);
    const installmentValue = finalPrice / selectedPlan;
    
    return {
      total: finalPrice,
      installment: Math.round(installmentValue),
      isFree: false
    };
  };

  const { total, installment, isFree } = getInstallmentDetails();

  const getWhatsAppLink = () => {
    const number = "5492262225731";
    const text = `Hola! Me interesa comprar el neumático de la ficha técnica:
*Marca y Modelo:* ${brand} ${model}
*Medida:* ${profile === '--' ? `${width}-${rim}` : profile.includes('.') ? `${Math.round(parseFloat(width))} x ${profile} R${rim}` : `${width}/${profile} R${rim}`}
*Opción de Pago:* ${selectedPlan} cuotas de ${formatPrice(installment)} (${isFree ? 'Sin Interés' : 'Con recargo MercadoPago'})
*Total:* ${formatPrice(total)} (Incluye 33% recargo MP)

¿Tienen disponibilidad y stock actualmente?`;
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="detail-close-btn" onClick={onClose} aria-label="Cerrar Ficha">
          <X size={20} />
        </button>

        <div className="detail-modal-layout">
          {/* Col 1: Images & Tags */}
          <div className="detail-visuals">
            {tag && <span className="detail-tag-badge">{tag}</span>}
            <div className="detail-img-box">
              <img src={image} alt={`${brand} ${model}`} />
            </div>
            <div className="detail-warranty-card">
              <ShieldCheck size={20} className="warranty-icon" />
              <div>
                <h4>Garantía Oficial APR</h4>
                <p>5 años de cobertura oficial contra fallas de fabricación.</p>
              </div>
            </div>
          </div>

          {/* Col 2: Info & Technical Specs */}
          <div className="detail-info">
            <span className="detail-brand">{brand}</span>
            <h2 className="detail-model-title">{model}</h2>
            <p className="detail-dimensions">
              {profile === '--' ? `${width}-${rim}` : profile.includes('.') ? `${Math.round(parseFloat(width))} x ${profile} R${rim}` : `${width} / ${profile} R${rim}`}
            </p>

            <div className="detail-specs-table">
              <div className="spec-row">
                <span className="spec-name">Marca</span>
                <span className="spec-val">{brand}</span>
              </div>
              <div className="spec-row">
                <span className="spec-name">Modelo</span>
                <span className="spec-val">{model}</span>
              </div>
              <div className="spec-row">
                <span className="spec-name">Medida</span>
                <span className="spec-val">
                  {profile === '--' ? `${width}-${rim}` : profile.includes('.') ? `${Math.round(parseFloat(width))} x ${profile} R${rim}` : `${width}/${profile} R${rim}`}
                </span>
              </div>
              <div className="spec-row">
                <span className="spec-name">Índice de Carga</span>
                <span className="spec-val">{loadIndex}</span>
              </div>
              <div className="spec-row">
                <span className="spec-name">Rango de Velocidad</span>
                <span className="spec-val">{speedRating}</span>
              </div>
              <div className="spec-row">
                <span className="spec-name">Categoría</span>
                <span className="spec-val" style={{ textTransform: 'capitalize' }}>{category}</span>
              </div>
              <div className="spec-row">
                <span className="spec-name">Disponibilidad</span>
                <span className={`spec-val stock-val ${stock <= 4 ? 'low' : 'ok'}`}>
                  {stock > 0 ? `Stock Disponible (${stock} u.)` : 'A pedido (48 hs)'}
                </span>
              </div>
            </div>

            <p className="detail-description-text">
              {(() => {
                if (!description) return null;
                const parts = description.split(/(APR Neumáticos)/gi);
                return parts.map((part, i) => 
                  part.toLowerCase() === 'apr neumáticos' 
                    ? <strong key={i} style={{ color: 'var(--color-primary)', fontWeight: '700' }}>{part}</strong> 
                    : part
                );
              })()}
            </p>

            {features && features.length > 0 && (
              <div className="detail-features-list">
                <h3>Características del diseño:</h3>
                <ul>
                  {features.map((feat, idx) => (
                    <li key={idx}>
                      <Check size={14} className="feature-check" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Installment Calculator */}
            <div className="finance-calculator">
              <div className="calc-title">
                <Calculator size={16} />
                <h3>Calculadora de Cuotas</h3>
              </div>
              
              <div className="plan-buttons">
                {[3, 6].map((plan) => (
                  <button
                    key={plan}
                    className={`plan-btn ${selectedPlan === plan ? 'active' : ''}`}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    {plan} Cuotas
                  </button>
                ))}
              </div>

              <div className="calc-results">
                <div className="result-item">
                  <span className="res-label">Pago Mensual</span>
                  <span className="res-val">{formatPrice(installment)}</span>
                </div>
                
                <div className="result-item text-right">
                  <span className="res-label">Costo Financiado</span>
                  <span className="res-val total-val">
                    {formatPrice(total)} 
                    <span className="interest-badge">
                      {isFree ? 'Sin Interés' : 'Con recargo MP (33%)'}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="detail-actions">
              <a 
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp-detail"
              >
                <MessageCircle size={18} />
                <span>Pedir y consultar por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
