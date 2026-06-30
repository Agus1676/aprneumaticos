import React, { useState, useEffect, useMemo } from 'react';
import { Search, Sparkles, Filter, ShieldCheck } from 'lucide-react';
import { filterOptions } from '../data/productsData';
import './Hero.css';

export default function Hero({ onSearch, tires }) {
  const [searchTab, setSearchTab] = useState('medidas'); // 'medidas' or 'marca'
  
  // Medidas states
  const [width, setWidth] = useState('');
  const [profile, setProfile] = useState('');
  const [rim, setRim] = useState('');
  
  // Marca state
  const [brand, setBrand] = useState('');

  // Compute active unique brands dynamically
  const uniqueBrands = useMemo(() => {
    if (!tires || tires.length === 0) {
      return ["Pirelli", "Michelin", "Bridgestone", "Xbri", "Sunny", "Firemax", "Continental"];
    }
    // Only get brands from non-paused tires
    const brands = tires
      .filter(t => !t.paused)
      .map(t => t.brand);
    return [...new Set(brands)].sort();
  }, [tires]);

  // Fondo estático configurado debajo

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTab === 'medidas') {
      onSearch({ width, profile, rim, brand: '' });
    } else {
      onSearch({ width: '', profile: '', rim: '', brand });
    }
    
    // Smooth scroll to catalog
    const catalogSection = document.getElementById('catalogo');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClear = () => {
    setWidth('');
    setProfile('');
    setRim('');
    setBrand('');
    onSearch({ width: '', profile: '', rim: '', brand: '' });
  };

  return (
    <section id="inicio" className="hero-cinematic">
      {/* Background Static Image */}
      <div 
        className="hero-slide active"
        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&q=80&w=1600)` }}
      >
        <div className="slide-overlay"></div>
      </div>

      <div className="hero-content">
        <div className="hero-left">
          <div className="hero-promo-badge">
            <Sparkles size={14} className="badge-spark" />
            <span>NUEVO DISEÑO 2026</span>
          </div>

          <span className="hero-slide-tagline">SEGURIDAD Y STOCK COMPLETO</span>
          
          <h1 className="hero-main-title">
            APR <span className="highlight">NEUMÁTICOSS</span>
          </h1>
          
          <p className="hero-description">
            Distribuidores oficiales de neumáticos de alta performance para autos, camionetas, camiones y el agro en Necochea.
          </p>

          <div className="hero-mini-badges">
            <div className="mini-badge">
              <ShieldCheck size={14} />
              <span>Garantía de Fábrica</span>
            </div>
            <div className="mini-badge">
              <ShieldCheck size={14} />
              <span>Envíos Gratis y Asegurados</span>
            </div>
          </div>
        </div>

        {/* Floating Search Engine */}
        <div className="hero-right">
          <div className="search-card">
            <div className="search-card-tabs">
              <button 
                className={`card-tab-btn ${searchTab === 'medidas' ? 'active' : ''}`}
                onClick={() => setSearchTab('medidas')}
              >
                Por Medidas
              </button>
              <button 
                className={`card-tab-btn ${searchTab === 'marca' ? 'active' : ''}`}
                onClick={() => setSearchTab('marca')}
              >
                Por Marca
              </button>
            </div>

            <form onSubmit={handleSearch} className="search-card-form">
              {searchTab === 'medidas' ? (
                <div className="form-inputs-stack">
                  <div className="form-select-row">
                    <div className="card-input-group">
                      <label htmlFor="card-width">Ancho</label>
                      <select id="card-width" value={width} onChange={(e) => setWidth(e.target.value)}>
                        <option value="">Ancho</option>
                        {filterOptions.widths.map(w => (
                          <option key={w} value={w}>{w}</option>
                        ))}
                      </select>
                    </div>

                    <div className="card-input-group">
                      <label htmlFor="card-profile">Perfil</label>
                      <select id="card-profile" value={profile} onChange={(e) => setProfile(e.target.value)}>
                        <option value="">Perfil</option>
                        {filterOptions.profiles.map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    <div className="card-input-group">
                      <label htmlFor="card-rim">Rodado</label>
                      <select id="card-rim" value={rim} onChange={(e) => setRim(e.target.value)}>
                        <option value="">Rodado</option>
                        {filterOptions.rims.map(r => (
                          <option key={r} value={r}>R{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="form-inputs-stack">
                  <div className="card-input-group single">
                    <label htmlFor="card-brand">Seleccionar Marca</label>
                    <select id="card-brand" value={brand} onChange={(e) => setBrand(e.target.value)}>
                      <option value="">Seleccionar Marca</option>
                      {uniqueBrands.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="search-card-actions">
                <button type="submit" className="btn-card-submit">
                  <Search size={16} />
                  <span>Buscar Stock</span>
                </button>
                
                {(width || profile || rim || brand) && (
                  <button type="button" className="btn-card-clear" onClick={handleClear}>
                    Limpiar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
