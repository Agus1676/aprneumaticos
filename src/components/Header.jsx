import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Phone, MapPin, ChevronDown, Compass, ShieldAlert, Award, Grid3X3 } from 'lucide-react';
import './Header.css';

export default function Header({ onCategorySelect, sectionsConfig }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowMegaMenu(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowMegaMenu(false);
    }, 250); // 250ms delay to make hover transition forgiving
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMegaMenuClick = (categoryId) => {
    onCategorySelect(categoryId);
    setShowMegaMenu(false);
    setIsOpen(false);
    // Smooth scroll to catalog
    const catalog = document.getElementById('catalogo');
    if (catalog) {
      catalog.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      {/* Top bar details */}
      <div className="top-bar">
        <div className="top-bar-container">
          <div className="top-info">
            <span className="info-item">
              <Phone size={12} className="info-icon" />
              <a href="tel:+5492262225731">(2262) 225731</a>
            </span>
            <span className="info-item desktop-only">
              <MapPin size={12} className="info-icon" />
              <span>Necochea, Buenos Aires, Argentina</span>
            </span>
          </div>
          <div className="top-promo">
            <span>ENVÍOS 100% GRATIS A TODO EL PAÍS</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="nav-container">
        <a href="#inicio" className="logo-link">
          <img src="/logo.png" alt="APR Neumáticos" className="logo-img" />
        </a>

        <nav className={`nav-menu ${isOpen ? 'open' : ''}`}>
          <a href="#inicio" className="nav-link" onClick={() => setIsOpen(false)}>Inicio</a>
          
          {/* Mega Menu Dropdown Trigger */}
          {sectionsConfig.catalog && (
            <div 
              className="nav-item-dropdown"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className="nav-link dropdown-trigger">
                <span>Neumáticos</span>
                <ChevronDown size={14} className={`arrow-icon ${showMegaMenu ? 'rotate' : ''}`} />
              </button>

              {/* Mega Menu Content */}
              <div className={`mega-menu ${showMegaMenu ? 'active' : ''}`}>
                <div className="mega-menu-grid">
                  <div 
                    className="mega-menu-banner" 
                    onClick={() => handleMegaMenuClick('todos')}
                    style={{ cursor: 'pointer' }}
                  >
                    <Award size={28} className="banner-icon" />
                    <h4>Catálogo Oficial</h4>
                    <p>Encontrá cubiertas de alta performance con garantía de fábrica directa en Necochea.</p>
                    <span className="mega-banner-btn">Ver todo el Stock</span>
                  </div>

                  <div className="mega-menu-categories">
                    <button onClick={() => handleMegaMenuClick('autos')} className="mega-cat-card">
                      <div className="cat-icon-wrapper red">🚗</div>
                      <div>
                        <h5>Línea Autos</h5>
                        <p>Neumáticos urbanos, familiares y de alta deportividad.</p>
                      </div>
                    </button>

                    <button onClick={() => handleMegaMenuClick('camionetas')} className="mega-cat-card">
                      <div className="cat-icon-wrapper red">🛻</div>
                      <div>
                        <h5>Línea Camionetas / SUV</h5>
                        <p>Modelos mixtos y All-Terrain para tracción extrema.</p>
                      </div>
                    </button>

                    <button onClick={() => handleMegaMenuClick('camiones')} className="mega-cat-card">
                      <div className="cat-icon-wrapper red">🚚</div>
                      <div>
                        <h5>Línea Camiones</h5>
                        <p>Estructuras reforzadas de carga para el trabajo comercial.</p>
                      </div>
                    </button>

                    <button onClick={() => handleMegaMenuClick('agricolas')} className="mega-cat-card">
                      <div className="cat-icon-wrapper red">🚜</div>
                      <div>
                        <h5>Línea Agrícola</h5>
                        <p>Cubiertas especiales para tractores y cosechadoras rurales.</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {sectionsConfig.accessories && <a href="#accesorios" className="nav-link" onClick={() => setIsOpen(false)}>Accesorios</a>}
          {sectionsConfig.services && <a href="#servicios" className="nav-link" onClick={() => setIsOpen(false)}>Servicios</a>}
          {sectionsConfig.contact && <a href="#contacto" className="nav-link" onClick={() => setIsOpen(false)}>Contacto</a>}
          {sectionsConfig.contact && <a href="#contacto" className="btn-contact-nav" onClick={() => setIsOpen(false)}>Consulta Rápida</a>}
        </nav>

        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}
