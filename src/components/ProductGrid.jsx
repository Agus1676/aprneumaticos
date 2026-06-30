import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from './ProductCard';
import { HelpCircle, MessageCircle, Search, SlidersHorizontal, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import './ProductGrid.css';

function WhatsAppPromoCard() {
  return (
    <div className="whatsapp-promo-card">
      <div className="promo-card-glow"></div>
      <div className="promo-icon-wrapper">💬</div>
      <h3 className="promo-title">¿Buscás el mejor precio?</h3>
      <p className="promo-text">
        Unite gratis a nuestro canal de WhatsApp. Publicamos <strong>ofertas relámpago a diario</strong> con stock limitado antes que en ningún otro lado.
      </p>
      <a 
        href="https://whatsapp.com/channel/0029Vb7Q3G97YSd6WmljOJ1Q"
        target="_blank" 
        rel="noopener noreferrer" 
        className="btn-promo-join"
      >
        Unirme al Canal Gratis
      </a>
    </div>
  );
}

export default function ProductGrid({ 
  products, 
  selectedCategory, 
  onCategoryChange,
  searchTerm,
  onSearchChange,
  selectedBrand,
  onBrandChange,
  sortOption,
  onSortChange,
  onViewDetails,
  onOpenAdvisor,
  onAddToCompare,
  comparisonTires,
  tires
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // Reset page to 1 when filters or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, selectedBrand, sortOption]);

  const categories = [
    { id: 'todos', name: 'Todos' },
    { id: 'autos', name: 'Autos' },
    { id: 'camionetas', name: 'Camionetas' },
    { id: 'camiones', name: 'Camiones' },
    { id: 'agricolas', name: 'Agrícolas' }
  ];

  // Dynamic unique brands list from complete tires catalog
  const brands = useMemo(() => {
    if (!tires || tires.length === 0) {
      return ["Todas", "Pirelli", "Michelin", "Bridgestone", "Xbri", "Sunny", "Firemax", "Continental"];
    }
    // Get brands from non-paused tires
    const unique = tires
      .filter(t => !t.paused)
      .map(t => t.brand);
    
    return ["Todas", ...new Set(unique)].sort((a, b) => {
      if (a === "Todas") return -1;
      if (b === "Todas") return 1;
      return a.localeCompare(b);
    });
  }, [tires]);

  const getWhatsAppHelpLink = () => {
    const number = "5492262225731";
    const text = "Hola! Estaba buscando neumáticos en su sitio web pero no encontré mi medida. ¿Me podrían asesorar por favor?";
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  };

  // Pagination calculations
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    // Smooth scroll to catalog top
    const catalogSection = document.getElementById('catalogo');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Generate page numbers to render with dots ...
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (i === 2 || i === totalPages - 1) {
        pages.push('...');
      }
    }
    // Deduplicate dots
    return pages.filter((item, idx) => pages.indexOf(item) === idx);
  };

  return (
    <section id="catalogo" className="catalog-section carbon-textured">
      <div className="section-header">
        <span className="section-tag">Catálogo</span>
        <h2 className="section-title">NEUMÁTICOS DISPONIBLES</h2>
      </div>

      {/* Interactive Advisor Banner */}
      <div className="advisor-banner-box">
        <div className="advisor-banner-content">
          <div className="advisor-text-side">
            <div className="banner-icon-badge">
              <Sparkles size={16} />
              <span>NUEVO</span>
            </div>
            <h3>¿No sabés qué neumático elegir?</h3>
            <p>Usá nuestro asesor inteligente. Respondé 3 preguntas y descubrí el neumático ideal para tu vehículo y presupuesto.</p>
          </div>
          <button onClick={onOpenAdvisor} className="btn-advisor-banner">
            <Sparkles size={16} />
            <span>Iniciar Asistente</span>
          </button>
        </div>
      </div>

      {/* WhatsApp Channel Promo Banner */}
      <div className="whatsapp-ribbon-box">
        <div className="whatsapp-ribbon-content">
          <div className="whatsapp-ribbon-text-side">
            <span className="ribbon-emoji">📢</span>
            <p>
              <strong>¡Ofertas Relámpago Diarias!</strong><br />
              Unite a nuestro canal de WhatsApp y accedé a súper precios exclusivos con stock limitado antes que nadie.
            </p>
          </div>
          <a 
            href="https://whatsapp.com/channel/0029Vb7Q3G97YSd6WmljOJ1Q"
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-ribbon-join"
          >
            Unirme Gratis
          </a>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Search and Filters Controls */}
      <div className="filter-controls-bar">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por marca o modelo..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => onSearchChange('')}>
              &times;
            </button>
          )}
        </div>

        <div className="select-filters-row">
          <div className="filter-select-group">
            <SlidersHorizontal size={14} className="select-icon" />
            <select value={selectedBrand} onChange={(e) => onBrandChange(e.target.value)}>
              {brands.map(b => (
                <option key={b} value={b}>{b === "Todas" ? "Marca: Todas" : b}</option>
              ))}
            </select>
          </div>

          <div className="filter-select-group">
            <select value={sortOption} onChange={(e) => onSortChange(e.target.value)}>
              <option value="destacados">Ordenar: Destacados</option>
              <option value="precio-bajo">Precio: Menor a Mayor</option>
              <option value="precio-alto">Precio: Mayor a Menor</option>
              <option value="stock-alto">Disponibilidad: Mayor Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {paginatedProducts.length > 0 ? (
        <>
          <div className="products-grid">
            {paginatedProducts.map((product, index) => (
              <React.Fragment key={product.id}>
                <ProductCard 
                  product={product} 
                  onViewDetails={onViewDetails}
                  onAddToCompare={onAddToCompare}
                  isCompared={comparisonTires.some(t => t.id === product.id)}
                />
                {/* Insert WhatsApp Promo Card at index 3 (position 4) on the first page */}
                {currentPage === 1 && index === 3 && (
                  <WhatsAppPromoCard />
                )}
              </React.Fragment>
            ))}
            {/* If there are fewer than 4 products on the first page, append the card at the end */}
            {currentPage === 1 && paginatedProducts.length > 0 && paginatedProducts.length < 4 && (
              <WhatsAppPromoCard />
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <button 
                className="btn-pagination-nav" 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
                <span>Anterior</span>
              </button>

              <div className="pagination-numbers">
                {getPageNumbers().map((pageNum, idx) => (
                  pageNum === '...' ? (
                    <span key={`dots-${idx}`} className="pagination-dots">...</span>
                  ) : (
                    <button
                      key={`page-${pageNum}`}
                      onClick={() => handlePageChange(pageNum)}
                      className={`btn-pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                    >
                      {pageNum}
                    </button>
                  )
                ))}
              </div>

              <button 
                className="btn-pagination-nav" 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <span>Siguiente</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="no-products">
          <HelpCircle size={48} className="no-products-icon" />
          <h3>No encontramos resultados</h3>
          <p>No contamos con stock inmediato para esa medida o filtros seleccionados, pero podemos conseguírtela a pedido en menos de 48hs.</p>
          <a 
            href={getWhatsAppHelpLink()} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-whatsapp-large"
          >
            <MessageCircle size={20} />
            <span>Consultar por WhatsApp</span>
          </a>
        </div>
      )}
    </section>
  );
}
