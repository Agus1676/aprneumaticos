import React from 'react';
import { X, Check, MessageCircle, GitCompare } from 'lucide-react';
import './TireComparer.css';

export default function TireComparer({ selectedTires, isOpen, onClose, onRemove }) {
  if (!isOpen) return null;

  const formatPrice = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getWhatsAppLink = (tire) => {
    const number = "5492262225731";
    const text = `Hola! Estaba comparando cubiertas en su web y me decidí por esta:
*Marca:* ${tire.brand}
*Modelo:* ${tire.model}
*Medida:* ${tire.width}/${tire.profile} R${tire.rim}
*Precio:* ${formatPrice(tire.price)}

¿Me confirman si tienen disponibilidad de stock?`;
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="comparer-modal" onClick={(e) => e.stopPropagation()}>
        <button className="comparer-close-btn" onClick={onClose} aria-label="Cerrar Comparador">
          <X size={20} />
        </button>

        <div className="comparer-header">
          <GitCompare size={24} className="comparer-header-icon" />
          <h2>Comparador de Neumáticos</h2>
          <p>Contrastá las especificaciones técnicas para tomar la mejor decisión.</p>
        </div>

        {selectedTires.length === 0 ? (
          <div className="comparer-empty">
            <p>No seleccionaste neumáticos para comparar. Cerrá este panel y hacé clic en "Comparar" en los productos del catálogo.</p>
          </div>
        ) : (
          <div className="comparer-table-wrapper">
            <table className="comparer-table">
              <thead>
                <tr>
                  <th className="feature-col">Especificación</th>
                  {selectedTires.map(tire => (
                    <th key={tire.id} className="tire-col">
                      <div className="tire-header-cell">
                        <button className="remove-tire-btn" onClick={() => onRemove(tire.id)}>
                          Quitar de la lista &times;
                        </button>
                        <div className="tire-cell-img">
                          <img src={tire.image} alt={tire.model} />
                        </div>
                        <span className="tire-cell-brand">{tire.brand}</span>
                        <h4 className="tire-cell-model">{tire.model}</h4>
                      </div>
                    </th>
                  ))}
                  {selectedTires.length === 1 && (
                    <th className="tire-col empty-slot">
                      <div className="empty-slot-content">
                        <span>Esperando neumático...</span>
                        <p>Seleccioná otra cubierta en el catálogo para comparar.</p>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {/* Price */}
                <tr>
                  <td className="feature-name">Precio Contado</td>
                  {selectedTires.map(tire => (
                    <td key={tire.id} className="feature-value price-val">
                      {formatPrice(tire.price)}
                    </td>
                  ))}
                  {selectedTires.length === 1 && <td className="empty-cell"></td>}
                </tr>

                {/* Medida */}
                <tr>
                  <td className="feature-name">Medida (Dimensiones)</td>
                  {selectedTires.map(tire => (
                    <td key={tire.id} className="feature-value specs-val">
                      {tire.profile === '--' ? `${tire.width}-${tire.rim}` : tire.profile.includes('.') ? `${Math.round(parseFloat(tire.width))} x ${tire.profile} R${tire.rim}` : `${tire.width} / ${tire.profile} R${tire.rim}`}
                    </td>
                  ))}
                  {selectedTires.length === 1 && <td className="empty-cell"></td>}
                </tr>

                {/* Índice de carga */}
                <tr>
                  <td className="feature-name">Índice de Carga</td>
                  {selectedTires.map(tire => (
                    <td key={tire.id} className="feature-value">
                      {tire.loadIndex}
                    </td>
                  ))}
                  {selectedTires.length === 1 && <td className="empty-cell"></td>}
                </tr>

                {/* Rango de velocidad */}
                <tr>
                  <td className="feature-name">Rango de Velocidad</td>
                  {selectedTires.map(tire => (
                    <td key={tire.id} className="feature-value">
                      {tire.speedRating}
                    </td>
                  ))}
                  {selectedTires.length === 1 && <td className="empty-cell"></td>}
                </tr>

                {/* Stock */}
                <tr>
                  <td className="feature-name">Stock Disponible</td>
                  {selectedTires.map(tire => (
                    <td key={tire.id} className="feature-value">
                      <span className={`stock-indicator ${tire.stock <= 4 ? 'low' : 'ok'}`}>
                        {tire.stock} unidades
                      </span>
                    </td>
                  ))}
                  {selectedTires.length === 1 && <td className="empty-cell"></td>}
                </tr>

                {/* Detalle del diseño */}
                <tr>
                  <td className="feature-name">Características clave</td>
                  {selectedTires.map(tire => (
                    <td key={tire.id} className="feature-value bullet-cell">
                      <ul>
                        {tire.features.map((feat, idx) => (
                          <li key={idx}>
                            <Check size={12} className="bullet-check" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                  {selectedTires.length === 1 && <td className="empty-cell"></td>}
                </tr>

                {/* Actions */}
                <tr className="actions-row">
                  <td className="feature-name">Coordinar compra</td>
                  {selectedTires.map(tire => (
                    <td key={tire.id} className="action-cell">
                      <a 
                        href={getWhatsAppLink(tire)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-whatsapp-comparer"
                      >
                        <MessageCircle size={14} />
                        <span>Pedir Cubierta</span>
                      </a>
                    </td>
                  ))}
                  {selectedTires.length === 1 && <td className="empty-cell"></td>}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
