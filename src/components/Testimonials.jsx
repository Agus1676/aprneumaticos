import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, CheckCircle2, Quote } from 'lucide-react';
import './Testimonials.css';

const TESTIMONIALS_DATA = [
  {
    id: 1,
    name: "Juan Carlos P.",
    location: "Necochea",
    car: "Toyota Hilux 4x4",
    text: "Excelente la atención. Les consulté por WhatsApp por unas cubiertas para la Hilux, me respondieron al instante asesorándome con la medida justa y las recibí sin cargo en el taller al día siguiente. 10 puntos.",
    rating: 5,
    initials: "JC",
    gradient: "linear-gradient(135deg, #e31c25 0%, #ff6b6b 100%)"
  },
  {
    id: 2,
    name: "Martín S.",
    location: "Buenos Aires",
    car: "Chevrolet Cruze",
    text: "Excelente servicio a nivel nacional. Estaba con dudas de comprar online por la distancia, pero las gomas llegaron a Buenos Aires en tan solo 4 días hábiles y todo perfecto. Muy recomendable la atención y el asesoramiento.",
    rating: 5,
    initials: "MS",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)"
  },
  {
    id: 3,
    name: "Valeria K.",
    location: "Bariloche (Río Negro)",
    car: "Renault Duster 4x4",
    text: "Compré desde el sur las cubiertas para la camioneta y la verdad impecable. Me despacharon súper rápido, recibí las gomas en 4 días en Bariloche y todo perfecto. Un servicio de primer nivel.",
    rating: 5,
    initials: "VK",
    gradient: "linear-gradient(135deg, #10b981 0%, #34d399 100%)"
  },
  {
    id: 4,
    name: "Claudio M.",
    location: "Lobería",
    car: "Scania R450",
    text: "Trabajo con transporte y siempre les compro a los chicos de APR. Tienen stock de medidas pesadas que no se consiguen en la zona, y el precio de lista es el mejor. Muy profesionales en la atención.",
    rating: 5,
    initials: "CM",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)"
  },
  {
    id: 5,
    name: "Sofía V.",
    location: "Necochea",
    car: "Tractor John Deere",
    text: "Excelente servicio de post-venta. Tuvimos una consulta técnica con un neumático agrícola y nos dieron respuesta al toque con la garantía oficial de fábrica de APR. Muy buena predisposición.",
    rating: 5,
    initials: "SV",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)"
  }
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [activeIndex]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? TESTIMONIALS_DATA.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === TESTIMONIALS_DATA.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="testimonials-section" id="testimonios">
      <div className="section-header text-center">
        <span className="section-subtitle">Nuestros Clientes Opinan</span>
        <h2 className="section-title">Experiencias APR Neumáticos</h2>
        <p className="section-description">
          Conocé los testimonios reales de conductores, transportistas y productores de Necochea y la zona que confían en nuestro stock y servicio.
        </p>
      </div>

      <div className="testimonials-carousel-container">
        {/* Decorative Quote Icons */}
        <Quote className="decor-quote quote-left" size={120} />
        <Quote className="decor-quote quote-right" size={120} />

        <div className="testimonials-window">
          <div className="testimonials-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
            {TESTIMONIALS_DATA.map((item) => (
              <div className="testimonial-slide" key={item.id}>
                <div className="testimonial-card">
                  <div className="card-top-decor"></div>
                  
                  <div className="testimonial-stars">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={18} fill="#fbbf24" color="#fbbf24" className="star-icon" />
                    ))}
                  </div>

                  <p className="testimonial-text">
                    "{item.text}"
                  </p>

                  <div className="testimonial-author">
                    <div className="author-avatar" style={{ background: item.gradient }}>
                      {item.initials}
                    </div>
                    
                    <div className="author-details">
                      <div className="author-name-row">
                        <h4>{item.name}</h4>
                        <span className="verified-badge">
                          <CheckCircle2 size={12} className="check-icon" />
                          Cliente Verificado
                        </span>
                      </div>
                      <p className="author-meta">
                        {item.location} • <span className="author-vehicle">{item.car}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Controls */}
        <button 
          className="carousel-btn btn-prev" 
          onClick={handlePrev} 
          aria-label="Opinión anterior"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          className="carousel-btn btn-next" 
          onClick={handleNext} 
          aria-label="Siguiente opinión"
        >
          <ChevronRight size={24} />
        </button>

        {/* Indicator Dots */}
        <div className="carousel-dots">
          {TESTIMONIALS_DATA.map((_, idx) => (
            <button
              key={idx}
              className={`dot ${activeIndex === idx ? 'active' : ''}`}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Ir a opinión ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
