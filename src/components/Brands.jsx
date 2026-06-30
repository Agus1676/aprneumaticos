import React from 'react';
import { tiresData } from '../data/productsData.js';
import './Brands.css';

export default function Brands() {
  const preferredOrder = ["xbri", "sunset", "firemax", "linglong", "doublestar"];

  const brands = [...new Set(tiresData.map(tire => tire.brand))]
    .filter(brand => brand && brand.trim() !== '')
    .sort((a, b) => {
      const idxA = preferredOrder.indexOf(a.toLowerCase());
      const idxB = preferredOrder.indexOf(b.toLowerCase());

      if (idxA !== -1 && idxB !== -1) {
        return idxA - idxB;
      }
      if (idxA !== -1) {
        return -1;
      }
      if (idxB !== -1) {
        return 1;
      }
      return a.localeCompare(b);
    });

  return (
    <section id="marcas" className="brands-section">
      <div className="section-header">
        <span className="section-tag">Marcas</span>
        <h2 className="section-title">TRABAJAMOS CON LAS MEJORES</h2>
      </div>

      <div className="brands-grid">
        {brands.map((brandName, idx) => (
          <div key={idx} className="brand-logo-card">
            <span className="brand-logo-text">{brandName}</span>
            <div className="brand-card-glow"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
