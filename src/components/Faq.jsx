import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import './Faq.css';

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqItems = [
    {
      question: "¿Hacen envíos gratis a todo el país y cuánto tardan?",
      answer: "Sí, realizamos envíos 100% gratis a todo el país. El costo de envío corre por nuestra cuenta sin ningún cargo extra para vos. Despachamos tu pedido a través de transportes y expresos de confianza dentro de las 24 a 48 horas hábiles posteriores a la compra. El tiempo de viaje depende de la localidad de destino, pero suele demorar entre 2 y 5 días. Todos los envíos viajan totalmente asegurados."
    },
    {
      question: "¿Cuáles son los medios de pago y financiación?",
      answer: "Aceptamos efectivo, transferencias bancarias nacionales, tarjetas de débito y tarjetas de crédito. Ofrecemos planes de pago con tarjetas de crédito seleccionadas."
    },
    {
      question: "¿Los neumáticos tienen garantía oficial?",
      answer: "Sí. Todos los neumáticos comercializados por APR Neumáticos son nuevos de stock fresco y cuentan con 2 años de garantía oficial contra cualquier defecto de fabricación, avalada directamente por las marcas oficiales (Xbri, Sunset, Firemax, Linglong, etc.)."
    },
    {
      question: "¿Ofrecen servicios de colocación, alineación o balanceo?",
      answer: "Operamos principalmente como centro de distribución y venta. Para colocación, alineación y balanceo en la zona de Necochea y alrededores, coordinamos con talleres y gomerías aliadas de confianza para ofrecerte tarifas preferenciales."
    },
    {
      question: "No sé cuál es la medida de mi neumático, ¿cómo la encuentro?",
      answer: "La medida está grabada en el lateral de tu cubierta actual. Se compone de tres números (por ejemplo: 205/55 R16), donde 205 es el ancho en milímetros, 55 es el perfil porcentual y 16 es el rodado en pulgadas. Si no lográs identificarlo, podés tomarle una foto al lateral de tu rueda y enviárnosla por WhatsApp para que te asesoremos."
    }
  ];

  const toggleFaq = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <section id="faq" className="faq-section carbon-textured">
      <div className="section-header">
        <span className="section-tag">Ayuda</span>
        <h2 className="section-title">PREGUNTAS FRECUENTES</h2>
      </div>

      <div className="faq-container">
        {faqItems.map((item, idx) => (
          <div 
            key={idx} 
            className={`faq-item ${activeIndex === idx ? 'active' : ''}`}
            onClick={() => toggleFaq(idx)}
          >
            <button className="faq-question-btn">
              <div className="faq-q-text-box">
                <HelpCircle size={18} className="faq-q-icon" />
                <span>{item.question}</span>
              </div>
              <ChevronDown size={16} className={`faq-arrow-icon ${activeIndex === idx ? 'rotate' : ''}`} />
            </button>
            
            <div className="faq-answer-container">
              <div className="faq-answer-content">
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
