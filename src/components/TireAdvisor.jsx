import React, { useState } from 'react';
import { X, Check, Award, ArrowRight, RefreshCw, MessageCircle } from 'lucide-react';
import { tiresData } from '../data/productsData';
import './TireAdvisor.css';

export default function TireAdvisor({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [vehicle, setVehicle] = useState('');
  const [width, setWidth] = useState('');
  const [profile, setProfile] = useState('');
  const [rim, setRim] = useState('');
  const [usage, setUsage] = useState('');
  const [priority, setPriority] = useState('');

  if (!isOpen) return null;

  const totalSteps = 4;

  const handleNextStep = (value) => {
    if (step === 1) {
      setVehicle(value);
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setUsage(value);
      setStep(4);
    } else if (step === 4) {
      setPriority(value);
      setStep(5); // Recommendation step
    }
  };

  const handleReset = () => {
    setStep(1);
    setVehicle('');
    setWidth('');
    setProfile('');
    setRim('');
    setUsage('');
    setPriority('');
  };

  // Get unique widths, profiles, rims dynamically for the selected vehicle category
  const getFilterOptions = () => {
    if (!vehicle) return { widths: [], profiles: [], rims: [] };
    
    // Filter tires by selected vehicle category
    const categoryTires = tiresData.filter(t => t.category === vehicle);
    
    // Widths available for this vehicle category
    const widths = [...new Set(categoryTires.map(t => t.width))].sort((a, b) => {
      return parseFloat(a) - parseFloat(b);
    });
    
    // Profiles available for this vehicle category and selected width (if any)
    const profiles = [...new Set(
      categoryTires
        .filter(t => !width || t.width === width)
        .map(t => t.profile)
    )].sort((a, b) => {
      if (a === '--') return -1;
      if (b === '--') return 1;
      return parseFloat(a) - parseFloat(b);
    });
    
    // Rims available for this vehicle category, selected width, and selected profile (if any)
    const rims = [...new Set(
      categoryTires
        .filter(t => (!width || t.width === width) && (!profile || t.profile === profile))
        .map(t => t.rim)
    )].sort((a, b) => {
      return parseFloat(a) - parseFloat(b);
    });
    
    return { widths, profiles, rims };
  };

  const { widths, profiles, rims } = getFilterOptions();

  // Recommendation logic
  const getRecommendation = () => {
    // 1. Filter by category
    let filtered = tiresData.filter(t => t.category === vehicle);
    
    // 2. Filter by size if selected
    if (width) {
      filtered = filtered.filter(t => t.width === width);
    }
    if (profile) {
      filtered = filtered.filter(t => t.profile === profile);
    }
    if (rim) {
      filtered = filtered.filter(t => t.rim === rim);
    }
    
    if (filtered.length === 0) return null;

    // 3. Score tires
    const scoredTires = filtered.map(tire => {
      let score = 0;
      if (tire.bestFor.usage === usage) score += 3;
      if (tire.bestFor.priority === priority) score += 2;
      return { tire, score };
    });

    // 4. Sort by score descending
    scoredTires.sort((a, b) => b.score - a.score);
    return scoredTires[0].tire;
  };

  const recommendedTire = step === 5 ? getRecommendation() : null;

  const formatPrice = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getWhatsAppAdvisorLink = (tire) => {
    const number = "5492262225731";
    const measureStr = tire.profile === '--' 
      ? `${tire.width}-${tire.rim}` 
      : tire.profile.includes('.') 
        ? `${Math.round(parseFloat(tire.width))} x ${tire.profile} R${tire.rim}` 
        : `${tire.width}/${tire.profile} R${tire.rim}`;
    
    let text = `Hola! Completé el asesor interactivo de neumáticos en su web y me recomendó el siguiente neumático:
*Marca y Modelo:* ${tire.brand} ${tire.model} (${measureStr})
*Uso del Vehículo:* ${usage.toUpperCase()}
*Prioridad:* ${priority.toUpperCase()}`;

    if (width || profile || rim) {
      const searchMeasure = `${width}${profile ? `/${profile}` : ''}${rim ? ` R${rim}` : ''}`;
      text += `\n*Medida buscada:* ${searchMeasure}`;
    }

    text += `\n*Precio sugerido:* ${formatPrice(tire.price)}\n\n¿Tienen disponibilidad para coordinar la compra?`;
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="modal-overlay">
      <div className="advisor-modal" onClick={(e) => e.stopPropagation()}>
        <button className="advisor-close-btn" onClick={onClose} aria-label="Cerrar Asistente">
          <X size={20} />
        </button>

        {step <= totalSteps && (
          <div className="advisor-header">
            <span className="advisor-steps-count">PREGUNTA {step} DE {totalSteps}</span>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${(step / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Step 1: Vehicle type */}
        {step === 1 && (
          <div className="step-content animate-slideUp">
            <h2 className="step-question">¿Qué tipo de vehículo tenés?</h2>
            <p className="step-subtitle">Seleccioná la categoría para filtrar neumáticos adecuados.</p>
            <div className="options-grid">
              <button className="option-card" onClick={() => handleNextStep('autos')}>
                <span className="option-title">Auto / Sedán</span>
                <span className="option-desc">Uso diario, familiar, urbano o deportivo</span>
              </button>
              <button className="option-card" onClick={() => handleNextStep('camionetas')}>
                <span className="option-title">SUV / Pickup 4x4</span>
                <span className="option-desc">Todoterreno, viajes o transporte mixto</span>
              </button>
              <button className="option-card" onClick={() => handleNextStep('camiones')}>
                <span className="option-title">Camión / Utilitario</span>
                <span className="option-desc">Transporte comercial o carga pesada</span>
              </button>
              <button className="option-card" onClick={() => handleNextStep('agricolas')}>
                <span className="option-title">Maquinaria Agrícola</span>
                <span className="option-desc">Tractores, implementos y labranza rural</span>
              </button>
            </div>
          </div>
        )}

    {/* Step 2: Tire Measure selection */}
    {step === 2 && (
      <div className="step-content animate-slideUp">
        <h2 className="step-question">¿Cuál es la medida de tus neumáticos?</h2>
        <p className="step-subtitle">Seleccioná la medida de tu cubierta actual. Podés omitir este paso si no la recordás.</p>
        
        <div className="advisor-size-form">
          <div className="advisor-select-row">
            <div className="advisor-select-group">
              <label htmlFor="adv-width">Ancho</label>
              <select 
                id="adv-width" 
                value={width} 
                onChange={(e) => {
                  setWidth(e.target.value);
                  setProfile('');
                  setRim('');
                }}
              >
                <option value="">Ancho</option>
                {widths.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            <div className="advisor-select-group">
              <label htmlFor="adv-profile">Perfil</label>
              <select 
                id="adv-profile" 
                value={profile} 
                onChange={(e) => {
                  setProfile(e.target.value);
                  setRim('');
                }}
              >
                <option value="">Perfil</option>
                {profiles.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="advisor-select-group">
              <label htmlFor="adv-rim">Rodado</label>
              <select 
                id="adv-rim" 
                value={rim} 
                onChange={(e) => setRim(e.target.value)}
              >
                <option value="">Rodado</option>
                {rims.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="advisor-actions-row">
            <button 
              className="btn-advisor-next" 
              onClick={() => handleNextStep()}
            >
              <span>Continuar</span>
              <ArrowRight size={16} />
            </button>
            <button 
              className="btn-advisor-skip" 
              onClick={() => {
                setWidth('');
                setProfile('');
                setRim('');
                handleNextStep();
              }}
            >
              No sé mi medida / Omitir paso
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Step 3: Usage */}
    {step === 3 && (
      <div className="step-content animate-slideUp">
        <h2 className="step-question">¿Dónde conducís principalmente?</h2>
        <p className="step-subtitle">El tipo de terreno define el diseño ideal de la banda de rodadura.</p>
        <div className="options-grid">
          <button className="option-card" onClick={() => handleNextStep('ciudad')}>
            <span className="option-title">Ciudad / Pavimento</span>
            <span className="option-desc">Calles pavimentadas y movilidad urbana diaria</span>
          </button>
          <button className="option-card" onClick={() => handleNextStep('ruta')}>
            <span className="option-title">Ruta / Autopista</span>
            <span className="option-desc">Viajes continuos a alta velocidad y asfalto</span>
          </button>
          <button className="option-card" onClick={() => handleNextStep('barro')}>
            <span className="option-title">Tierra / Barro / Ripio</span>
            <span className="option-desc">Caminos rurales off-road o superficies irregulares</span>
          </button>
          <button className="option-card" onClick={() => handleNextStep('trabajo')}>
            <span className="option-title">Trabajo comercial</span>
            <span className="option-desc">Furgones y utilitarios sometidos a carga</span>
          </button>
        </div>
      </div>
    )}

    {/* Step 4: Priority */}
    {step === 4 && (
      <div className="step-content animate-slideUp">
        <h2 className="step-question">¿Cuál es tu prioridad principal?</h2>
        <p className="step-subtitle">Buscamos el neumático que mejor se alinee con tu enfoque.</p>
        <div className="options-grid">
          <button className="option-card" onClick={() => handleNextStep('precio')}>
            <span className="option-title">Ahorro / Economía</span>
            <span className="option-desc">El mejor rendimiento para tu bolsillo</span>
          </button>
          <button className="option-card" onClick={() => handleNextStep('confort')}>
            <span className="option-title">Confort y Silencio</span>
            <span className="option-desc">Andar suave y reducción de ruidos molestos</span>
          </button>
          <button className="option-card" onClick={() => handleNextStep('rendimiento')}>
            <span className="option-title">Rendimiento / Agarre</span>
            <span className="option-desc">Tracción óptima y control en curvas</span>
          </button>
          <button className="option-card" onClick={() => handleNextStep('duracion')}>
            <span className="option-title">Durabilidad kilométrica</span>
            <span className="option-desc">Larga vida útil para recorrer más kilómetros</span>
          </button>
        </div>
      </div>
    )}

    {/* Step 5: Recommendation Results */}
    {step === 5 && (
          <div className="recommendation-step animate-slideUp">
            {recommendedTire ? (
              <>
                <div className="rec-award-badge">
                  <Award size={20} />
                  RECOMENDACIÓN APR
                </div>
                
                <h2 className="rec-title">Tu Neumático Ideal</h2>
                
                <div className="rec-product-block">
                  <div className="rec-product-image">
                    <img src={recommendedTire.image} alt={recommendedTire.model} />
                  </div>
                  
                  <div className="rec-product-info">
                    <span className="rec-product-brand">{recommendedTire.brand}</span>
                    <h3 className="rec-product-model">{recommendedTire.model}</h3>
                    
                    <div className="rec-product-specs">
                      <span className="spec-item">Medida: {recommendedTire.width}/{recommendedTire.profile} R{recommendedTire.rim}</span>
                      <span className="spec-item">Velocidad: {recommendedTire.speedRating}</span>
                      <span className="spec-item">Carga: {recommendedTire.loadIndex}</span>
                    </div>

                     <p className="rec-product-desc">
                       {(() => {
                         const desc = recommendedTire.description;
                         if (!desc) return null;
                         const parts = desc.split(/(APR Neumáticos)/gi);
                         return parts.map((part, i) => 
                           part.toLowerCase() === 'apr neumáticos' 
                             ? <strong key={i} style={{ color: 'var(--color-primary)', fontWeight: '700' }}>{part}</strong> 
                             : part
                         );
                       })()}
                     </p>
                    
                    <div className="rec-product-features">
                      <h4>Beneficios Clave:</h4>
                      <ul>
                        {recommendedTire.features.slice(0, 2).map((feat, i) => (
                          <li key={i}>
                            <Check size={14} className="check-icon" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rec-price-row">
                      <div className="rec-price-box">
                        <span className="rec-price-label">Precio Contado</span>
                        <span className="rec-price-val">{formatPrice(recommendedTire.price)}</span>
                      </div>
                      
                      <div className="rec-price-box installment">
                        <span className="rec-price-label">6 cuotas MP (33% recargo)</span>
                        <span className="rec-price-installment">{formatPrice(Math.round((recommendedTire.price * 1.33) / 6))}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rec-action-buttons">
                  <a 
                    href={getWhatsAppAdvisorLink(recommendedTire)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-whatsapp-advisor"
                  >
                    <MessageCircle size={18} />
                    <span>Hacer Pedido recomendado</span>
                  </a>
                  <button className="btn-advisor-restart" onClick={handleReset}>
                    <RefreshCw size={14} />
                    <span>Volver a empezar</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="rec-empty">
                <h3>No pudimos encontrar una recomendación exacta</h3>
                <p>
                  {width || profile || rim 
                    ? `No contamos con stock inmediato de cubiertas de medida ${width}${profile ? `/${profile}` : ''}${rim ? ` R${rim}` : ''} para la categoría seleccionada.` 
                    : "No tenemos stock inmediato en la categoría seleccionada."}
                  {" No te preocupes, podemos asesorarte de manera personalizada y cotizar la medida que necesites en segundos por WhatsApp."}
                </p>
                <div className="rec-action-buttons">
                  <a 
                    href={`https://wa.me/5492262225731?text=${encodeURIComponent(`Hola! Usé el asistente de neumáticos en su web para buscar la medida ${width}${profile ? `/${profile}` : ''}${rim ? ` R${rim}` : ''} (Vehículo: ${vehicle.toUpperCase()}) y no encontré stock. ¿Me podrían cotizar y confirmar disponibilidad por favor?`)}`}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-whatsapp-advisor"
                  >
                    <MessageCircle size={18} />
                    <span>Asesoría Personalizada por WhatsApp</span>
                  </a>
                  <button className="btn-advisor-restart" onClick={handleReset}>
                    <RefreshCw size={14} />
                    <span>Volver a empezar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
