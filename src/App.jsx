import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Accessories from './components/Accessories';
import Services from './components/Services';
import Brands from './components/Brands';
import Contact from './components/Contact';
import Footer from './components/Footer';
import TireAdvisor from './components/TireAdvisor';
import ProductDetailModal from './components/ProductDetailModal';
import TireComparer from './components/TireComparer';
import Faq from './components/Faq';
import Testimonials from './components/Testimonials';
import AdminPanel from './components/AdminPanel';
import AdminLoginModal from './components/AdminLoginModal';
import { tiresData } from './data/productsData';

export default function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [sectionsConfig, setSectionsConfig] = useState(() => {
    const saved = localStorage.getItem('apr_sections_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error reading sections config", e);
      }
    }
    return {
      hero: true,
      catalog: true,
      accessories: false, // default hidden
      services: true,
      brands: true,
      testimonials: true,
      faq: true,
      contact: true
    };
  });
  const [tires, setTires] = useState(() => {
    const saved = localStorage.getItem('apr_catalog');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error reading catalog from localStorage", e);
      }
    }
    return tiresData;
  });

  // Filters and search states
  const [searchFilters, setSearchFilters] = useState({
    width: '',
    profile: '',
    rim: '',
    brand: ''
  });
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('Todas');
  const [sortOption, setSortOption] = useState('destacados');

  // Modals state
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Comparer state
  const [comparisonTires, setComparisonTires] = useState([]);
  const [isComparerOpen, setIsComparerOpen] = useState(false);

  // Handle Search Filters from Hero Searchbox
  const handleSearch = (filters) => {
    setSearchFilters(filters);
    // If brand was searched in Hero tab
    if (filters.brand) {
      setSelectedBrand(filters.brand);
    }
  };

  // Handle Category tab changes
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    // Reset measurement search filters when category is clicked to show complete list
    setSearchFilters({ width: '', profile: '', rim: '', brand: '' });
  };

  // Manage comparison list
  const handleAddToCompare = (tire) => {
    const isAlreadyAdded = comparisonTires.some((t) => t.id === tire.id);
    if (isAlreadyAdded) {
      handleRemoveFromCompare(tire.id);
    } else {
      if (comparisonTires.length < 2) {
        setComparisonTires([...comparisonTires, tire]);
      } else {
        alert("Podés comparar hasta 2 neumáticos al mismo tiempo. Quitá uno para agregar otro.");
      }
    }
  };

  const handleRemoveFromCompare = (tireId) => {
    setComparisonTires(comparisonTires.filter((t) => t.id !== tireId));
  };

  // Filter & Sort logic
  const getFilteredTires = () => {
    // 1. Filter
    let result = tires.filter((tire) => {
      // Ocultar neumáticos pausados de la vista cliente
      if (tire.paused) {
        return false;
      }
      // Category Filter (Tabs)
      if (selectedCategory !== 'todos' && tire.category !== selectedCategory) {
        return false;
      }
      
      // Hero Measurement Filters
      if (searchFilters.width && tire.width !== searchFilters.width) {
        return false;
      }
      if (searchFilters.profile && tire.profile !== searchFilters.profile) {
        return false;
      }
      if (searchFilters.rim && tire.rim !== searchFilters.rim) {
        return false;
      }

      // Brand Filter (Sidebar/Dropdown)
      if (selectedBrand !== 'Todas' && tire.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }

      // Text Keyword Search Filter
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesBrand = tire.brand.toLowerCase().includes(query);
        const matchesModel = tire.model.toLowerCase().includes(query);
        const matchesDesc = tire.description.toLowerCase().includes(query);
        if (!matchesBrand && !matchesModel && !matchesDesc) {
          return false;
        }
      }

      return true;
    });

    // 2. Sort
    if (sortOption === 'precio-bajo') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'precio-alto') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'stock-alto') {
      result.sort((a, b) => b.stock - a.stock);
    } else if (sortOption === 'destacados') {
      // Prioritize tires with 'Destacado' or 'Premium' tag
      result.sort((a, b) => {
        const aVal = (a.tag === 'Destacado' || a.tag === 'Premium') ? 1 : 0;
        const bVal = (b.tag === 'Destacado' || b.tag === 'Premium') ? 1 : 0;
        return bVal - aVal;
      });
    }

    return result;
  };

  const filteredTires = getFilteredTires();

  if (isAdminMode) {
    return (
      <AdminPanel 
        tires={tires}
        onUpdateTires={(updated) => {
          setTires(updated);
          localStorage.setItem('apr_catalog', JSON.stringify(updated));
        }}
        onResetCatalog={() => {
          if (window.confirm("¿Estás seguro de que querés restablecer todo el catálogo al estado de fábrica? Se perderán todas tus ediciones.")) {
            setTires(tiresData);
            localStorage.removeItem('apr_catalog');
          }
        }}
        onClose={() => setIsAdminMode(false)}
        sectionsConfig={sectionsConfig}
        onToggleSection={(section, val) => {
          const updated = { ...sectionsConfig, [section]: val };
          setSectionsConfig(updated);
          localStorage.setItem('apr_sections_config', JSON.stringify(updated));
        }}
      />
    );
  }

  return (
    <>
      <Header onCategorySelect={handleCategoryChange} sectionsConfig={sectionsConfig} />
      <main>
        {sectionsConfig.hero && <Hero onSearch={handleSearch} tires={tires} />}
        {sectionsConfig.catalog && (
          <ProductGrid 
            products={filteredTires} 
            tires={tires} 
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedBrand={selectedBrand}
            onBrandChange={setSelectedBrand}
            sortOption={sortOption}
            onSortChange={setSortOption}
            onViewDetails={setSelectedProduct}
            onOpenAdvisor={() => setIsAdvisorOpen(true)}
            onAddToCompare={handleAddToCompare}
            comparisonTires={comparisonTires}
          />
        )}
        {sectionsConfig.accessories && <Accessories />}
        {sectionsConfig.services && <Services />}
        {sectionsConfig.brands && <Brands />}
        {sectionsConfig.testimonials && <Testimonials />}
        {sectionsConfig.faq && <Faq />}
        {sectionsConfig.contact && <Contact />}
      </main>
      <Footer onAdminAccess={setIsLoginModalOpen} sectionsConfig={sectionsConfig} />

      {/* Interactive Advisor Modals */}
      <TireAdvisor 
        isOpen={isAdvisorOpen} 
        onClose={() => setIsAdvisorOpen(false)} 
      />

      {/* Product Specification Sheet Modal */}
      <ProductDetailModal 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />

      {/* Side-by-Side Comparer Modal */}
      <TireComparer
        selectedTires={comparisonTires}
        isOpen={isComparerOpen}
        onClose={() => setIsComparerOpen(false)}
        onRemove={handleRemoveFromCompare}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => setIsAdminMode(true)}
      />

      {/* Floating Comparison bar at the bottom */}
      {comparisonTires.length > 0 && (
        <div className="comparer-floating-bar">
          <span className="comparer-bar-info">
            Comparar cubiertas ({comparisonTires.length}/2 seleccionadas)
          </span>
          <div className="comparer-bar-actions">
            <button type="button" onClick={() => setIsComparerOpen(true)}>
              Comparar ahora
            </button>
            <button 
              type="button" 
              className="btn-close-bar" 
              onClick={() => setComparisonTires([])}
              title="Cerrar barra"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
}
