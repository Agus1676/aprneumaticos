import React, { useState, useMemo } from 'react';
import { 
  Search, Save, Power, ArrowLeft, RefreshCw, Download, 
  FileSpreadsheet, Layers, AlertCircle, Eye, EyeOff, 
  Plus, Edit3, Trash2, Sliders, CheckCircle, X, Info
} from 'lucide-react';
import './AdminPanel.css';

export default function AdminPanel({ tires, onUpdateTires, onResetCatalog, onClose, sectionsConfig, onToggleSection }) {
  // Local state for tires database
  const [localTires, setLocalTires] = useState(tires);
  const [hasChanges, setHasChanges] = useState(false);

  // Tabs state: 'inventario' | 'bulk' | 'nuevo'
  const [activeTab, setActiveTab] = useState('inventario');

  // Search & Filter state for Inventory Tab
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; // smaller page size for cleaner layout

  // Modal states
  const [editingTire, setEditingTire] = useState(null); // for editing all details
  const [isNewModalOpen, setIsNewModalOpen] = useState(false); // form to add a new tire

  // Bulk adjustments state
  const [bulkCategory, setBulkCategory] = useState('todos');
  const [bulkPercent, setBulkPercent] = useState(10);
  const [bulkAction, setBulkAction] = useState('increase'); // 'increase' | 'decrease'

  // New Tire Form State
  const [newTire, setNewTire] = useState({
    brand: '',
    model: '',
    width: '',
    profile: '',
    rim: '',
    category: 'autos',
    price: '',
    stock: '',
    speedRating: 'H',
    loadIndex: '91',
    tag: '',
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&q=80&w=500',
    description: ''
  });

  // Calculate Metrics
  const metrics = useMemo(() => {
    return {
      total: localTires.length,
      active: localTires.filter(t => !t.paused).length,
      paused: localTires.filter(t => t.paused).length,
      lowStock: localTires.filter(t => t.stock > 0 && t.stock < 4).length,
      noStock: localTires.filter(t => t.stock === 0).length
    };
  }, [localTires]);

  // Filtered tires list
  const filteredTires = useMemo(() => {
    setCurrentPage(1); // Reset page on filter change
    return localTires.filter(tire => {
      // Text match
      const textMatch = 
        tire.brand.toLowerCase().includes(search.toLowerCase()) ||
        tire.model.toLowerCase().includes(search.toLowerCase()) ||
        `${tire.width}/${tire.profile}R${tire.rim}`.includes(search.replace(/\s+/g, ''));

      // Category match
      const catMatch = categoryFilter === 'todos' || tire.category === categoryFilter;

      // Status match
      let statusMatch = true;
      if (statusFilter === 'activos') statusMatch = !tire.paused;
      if (statusFilter === 'pausados') statusMatch = !!tire.paused;
      if (statusFilter === 'bajo-stock') statusMatch = tire.stock > 0 && tire.stock < 4;
      if (statusFilter === 'sin-stock') statusMatch = tire.stock === 0;

      return textMatch && catMatch && statusMatch;
    });
  }, [localTires, search, categoryFilter, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredTires.length / itemsPerPage);
  const paginatedTires = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTires.slice(start, start + itemsPerPage);
  }, [filteredTires, currentPage]);

  // Update inline table inputs (price/stock)
  const handleInputChange = (id, field, value) => {
    const updated = localTires.map(t => {
      if (t.id === id) {
        let cleanValue = value;
        if (field === 'price' || field === 'stock') {
          cleanValue = parseInt(value) || 0;
        }
        return { ...t, [field]: cleanValue };
      }
      return t;
    });
    setLocalTires(updated);
    setHasChanges(true);
  };

  // Toggle pause status
  const handleTogglePause = (id) => {
    const updated = localTires.map(t => {
      if (t.id === id) {
        return { ...t, paused: !t.paused };
      }
      return t;
    });
    setLocalTires(updated);
    setHasChanges(true);
  };

  // Delete tire product
  const handleDeleteTire = (id, brand, model) => {
    if (window.confirm(`¿Estás seguro de que querés eliminar permanentemente el neumático ${brand} ${model}?`)) {
      const updated = localTires.filter(t => t.id !== id);
      setLocalTires(updated);
      setHasChanges(true);
    }
  };

  // Save changes to App state (localStorage)
  const handleSaveChanges = () => {
    onUpdateTires(localTires);
    setHasChanges(false);
    alert("¡Felicidades! Todos los cambios han sido guardados con éxito.");
  };

  // Reset to static data
  const handleReset = () => {
    onResetCatalog();
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  // Apply Bulk Adjustment (Aumento/Descuento masivo)
  const handleApplyBulk = (e) => {
    e.preventDefault();
    const actionWord = bulkAction === 'increase' ? 'aumentar' : 'disminuir';
    const percent = parseFloat(bulkPercent);
    
    if (isNaN(percent) || percent <= 0) {
      alert("Por favor ingrese un porcentaje válido mayor a 0.");
      return;
    }

    const message = `¿Estás seguro de que querés ${actionWord} un ${percent}% los precios de la categoría "${bulkCategory.toUpperCase()}"?`;
    if (!window.confirm(message)) return;

    const multiplier = bulkAction === 'increase' ? (1 + percent / 100) : (1 - percent / 100);

    const updated = localTires.map(t => {
      if (bulkCategory === 'todos' || t.category === bulkCategory) {
        return { ...t, price: Math.round(t.price * multiplier) };
      }
      return t;
    });

    setLocalTires(updated);
    setHasChanges(true);
    alert(`Se aplicó el ajuste de precio del ${percent}% a los productos seleccionados.`);
  };

  // Create New Product
  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newTire.brand || !newTire.model || !newTire.width || !newTire.rim || !newTire.price) {
      alert("Por favor complete los campos obligatorios: Marca, Modelo, Ancho, Rodado y Precio.");
      return;
    }

    const nextId = Math.max(...localTires.map(t => t.id), 0) + 1;
    const priceNum = parseInt(newTire.price) || 0;
    const stockNum = parseInt(newTire.stock) || 0;

    const created = {
      id: nextId,
      brand: newTire.brand.trim(),
      model: newTire.model.trim().toUpperCase(),
      width: newTire.width.trim(),
      profile: newTire.profile.trim() || "--",
      rim: newTire.rim.trim(),
      category: newTire.category,
      price: priceNum,
      stock: stockNum,
      tag: newTire.tag,
      image: newTire.image.trim(),
      description: newTire.description.trim() || `Neumático ${newTire.brand} ${newTire.model} de gran desempeño comercial, importado por APR Neumáticos.`,
      speedRating: newTire.speedRating.trim() || "--",
      loadIndex: newTire.loadIndex.trim() || "--",
      features: [
        "Gran adherencia y estabilidad en curvas exigentes",
        "Banda de rodadura diseñada contra aquaplaning",
        "Rodar suave y silencioso de alta duración kilométrica"
      ],
      bestFor: {
        usage: newTire.category === 'autos' ? 'ciudad' : (newTire.category === 'camionetas' ? 'barro' : 'trabajo'),
        priority: 'duracion'
      },
      paused: false
    };

    const updated = [created, ...localTires];
    setLocalTires(updated);
    setHasChanges(true);
    
    // Reset Form
    setNewTire({
      brand: '',
      model: '',
      width: '',
      profile: '',
      rim: '',
      category: 'autos',
      price: '',
      stock: '',
      speedRating: 'H',
      loadIndex: '91',
      tag: '',
      image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&q=80&w=500',
      description: ''
    });

    setActiveTab('inventario');
    alert("¡Neumático añadido con éxito al catálogo!");
  };

  // Edit complete tire details (Modal save)
  const handleSaveTireDetails = (updatedTire) => {
    const updated = localTires.map(t => t.id === updatedTire.id ? updatedTire : t);
    setLocalTires(updated);
    setHasChanges(true);
    setEditingTire(null);
  };

  // Export JS file
  const handleExportJS = () => {
    const serialized = JSON.stringify(localTires, null, 2);
    const content = `// Catálogo Oficial APR Neumáticos - Generado desde Panel Admin
export const tiresData = ${serialized};
`;
    const blob = new Blob([content], { type: 'application/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'productsData.js';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export CSV spreadsheet
  const handleExportCSV = () => {
    const headers = ["ID", "Brand", "Model", "Width", "Profile", "Rim", "Category", "Price", "Stock", "Tag", "Image", "Description", "SpeedRating", "LoadIndex", "Paused"];
    const rows = localTires.map(t => [
      t.id,
      t.brand,
      t.model,
      t.width,
      t.profile,
      t.rim,
      t.category,
      t.price,
      t.stock,
      t.tag || "",
      t.image,
      t.description.replace(/"/g, '""'),
      t.speedRating,
      t.loadIndex,
      t.paused ? "TRUE" : "FALSE"
    ]);
    
    const csvContent = "\uFEFF" + [
      headers.join(","),
      ...rows.map(r => r.map(val => `"${val}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tires_catalog.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-frame">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo-circle">APR</div>
          <div className="brand-title-wrap">
            <h1>APR CONTROL</h1>
            <span>PANEL DE GESTIÓN</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'inventario' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventario')}
          >
            <Layers size={18} />
            <span>Inventario Completo</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'bulk' ? 'active' : ''}`}
            onClick={() => setActiveTab('bulk')}
          >
            <Sliders size={18} />
            <span>Ajustes Masivos</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'nuevo' ? 'active' : ''}`}
            onClick={() => setActiveTab('nuevo')}
          >
            <Plus size={18} />
            <span>Nuevo Neumático</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar-indicator"></div>
            <div className="user-details">
              <h4>Administrador</h4>
              <p>Sesión Segura</p>
            </div>
          </div>
          <button className="btn-sidebar-back" onClick={onClose}>
            <ArrowLeft size={16} />
            <span>Salir de Panel</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="admin-main-container">
        
        {/* Top Navbar */}
        <header className="admin-navbar">
          <div className="navbar-title">
            <h2>
              {activeTab === 'inventario' && "Inventario de Neumáticos"}
              {activeTab === 'bulk' && "Ajustador de Precios Masivo"}
              {activeTab === 'nuevo' && "Registrar Nuevo Neumático"}
            </h2>
            <p>Gestioná stock, precios y estados en tiempo real.</p>
          </div>
          <div className="navbar-actions">
            <button className="btn-nav-reset" onClick={handleReset} title="Restablecer base de datos limpia de fábrica">
              <RefreshCw size={15} />
              <span>Restaurar Fábrica</span>
            </button>
            <button className="btn-nav-export secondary" onClick={handleExportCSV}>
              <FileSpreadsheet size={15} />
              <span>Descargar CSV</span>
            </button>
            <button className="btn-nav-export primary" onClick={handleExportJS} title="Descargar archivo productsData.js para producción">
              <Download size={15} />
              <span>Descargar JS</span>
            </button>
          </div>
        </header>

        {/* Tab content rendering */}
        <div className="admin-tab-body">
          
          {/* TAB 1: INVENTORY TABLE */}
          {activeTab === 'inventario' && (
            <div className="tab-pane fade-in">
              {/* Metrics bar */}
              <div className="metrics-summary-bar">
                <div className="metric-card cyan">
                  <div className="card-top">
                    <span className="card-label">Total Catálogo</span>
                    <Layers size={18} />
                  </div>
                  <h3>{metrics.total}</h3>
                </div>
                <div className="metric-card green">
                  <div className="card-top">
                    <span className="card-label">Visibles en Web</span>
                    <Eye size={18} />
                  </div>
                  <h3>{metrics.active}</h3>
                </div>
                <div className="metric-card yellow">
                  <div className="card-top">
                    <span className="card-label">Pausados/Ocultos</span>
                    <EyeOff size={18} />
                  </div>
                  <h3>{metrics.paused}</h3>
                </div>
                <div className="metric-card orange">
                  <div className="card-top">
                    <span className="card-label">Stock Crítico</span>
                    <AlertCircle size={18} />
                  </div>
                  <h3>{metrics.lowStock}</h3>
                </div>
              </div>

              {/* Filter controls */}
              <div className="inventory-filters-card">
                <div className="search-box-wrap">
                  <Search size={18} className="search-icon-inside" />
                  <input 
                    type="text" 
                    placeholder="Filtrar por marca, modelo o rodado (ej: 205/55R16)..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button className="btn-clear-search" onClick={() => setSearch('')}>
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="filter-selects-wrap">
                  <div className="select-field">
                    <label>Categoría</label>
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                      <option value="todos">Todas las categorías</option>
                      <option value="autos">Autos</option>
                      <option value="camionetas">Camionetas</option>
                      <option value="camiones">Camiones</option>
                      <option value="agricolas">Agrícolas e Industriales</option>
                    </select>
                  </div>
                  <div className="select-field">
                    <label>Estado</label>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                      <option value="todos">Todos los estados</option>
                      <option value="activos">Activos (En catálogo)</option>
                      <option value="pausados">Pausados (Ocultos)</option>
                      <option value="bajo-stock">Bajo Stock (&lt; 4 u.)</option>
                      <option value="sin-stock">Sin Stock (0 u.)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Table card */}
              <div className="table-card">
                <div className="table-header-info">
                  Mostrando <span>{filteredTires.length}</span> neumáticos de <span>{localTires.length}</span> totales
                </div>

                <div className="table-wrapper">
                  <table className="inventory-table">
                    <thead>
                      <tr>
                        <th width="70">Imagen</th>
                        <th>Marca / Modelo</th>
                        <th width="120">Rodado</th>
                        <th width="140">Precio Contado ($)</th>
                        <th width="110">Stock (u.)</th>
                        <th width="110" className="text-center">Estado</th>
                        <th width="100" className="text-center">Visibilidad</th>
                        <th width="90" className="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTires.length > 0 ? (
                        paginatedTires.map((tire) => (
                          <tr key={tire.id} className={tire.paused ? 'tr-paused' : ''}>
                            <td>
                              <div className="tire-thumbnail-box">
                                <img src={tire.image} alt={tire.model} />
                              </div>
                            </td>
                            <td>
                              <div className="tire-info-brand">{tire.brand}</div>
                              <div className="tire-info-model">{tire.model}</div>
                            </td>
                            <td className="tire-info-measure">
                              {tire.profile === '--' ? `${tire.width}-${tire.rim}` : `${tire.width}/${tire.profile} R${tire.rim}`}
                            </td>
                            <td>
                              <div className="table-price-input-wrapper">
                                <span>$</span>
                                <input 
                                  type="number" 
                                  value={tire.price}
                                  onChange={(e) => handleInputChange(tire.id, 'price', e.target.value)}
                                  min="0"
                                />
                              </div>
                            </td>
                            <td>
                              <input 
                                type="number" 
                                className={`table-stock-input ${tire.stock === 0 ? 'empty' : tire.stock < 4 ? 'alert' : ''}`}
                                value={tire.stock}
                                onChange={(e) => handleInputChange(tire.id, 'stock', e.target.value)}
                                min="0"
                              />
                            </td>
                            <td className="text-center">
                              {tire.paused ? (
                                <span className="status-indicator paused">Pausado</span>
                              ) : tire.stock === 0 ? (
                                <span className="status-indicator out">Agotado</span>
                              ) : (
                                <span className="status-indicator active">Activo</span>
                              )}
                            </td>
                            <td className="text-center">
                              {/* iOS-style toggle switch */}
                              <label className="ios-toggle-switch">
                                <input 
                                  type="checkbox" 
                                  checked={!tire.paused}
                                  onChange={() => handleTogglePause(tire.id)}
                                />
                                <span className="toggle-slider"></span>
                              </label>
                            </td>
                            <td className="text-center">
                              <div className="row-action-buttons">
                                <button 
                                  className="btn-action-edit"
                                  onClick={() => setEditingTire(tire)}
                                  title="Editar detalles completos"
                                >
                                  <Edit3 size={15} />
                                </button>
                                <button 
                                  className="btn-action-delete"
                                  onClick={() => handleDeleteTire(tire.id, tire.brand, tire.model)}
                                  title="Eliminar de catálogo"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="empty-table-msg">
                            No se encontraron neumáticos que coincidan con la búsqueda.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="table-pagination-nav">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="btn-page-nav"
                    >
                      Anterior
                    </button>
                    <span className="pagination-text">
                      Página <strong>{currentPage}</strong> de {totalPages}
                    </span>
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="btn-page-nav"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: BULK PRICE ADJUSTMENTS */}
          {activeTab === 'bulk' && (
            <div className="tab-pane fade-in">
              <div className="bulk-card">
                <div className="bulk-header">
                  <Sliders size={22} className="bulk-header-icon" />
                  <div>
                    <h3>Ajustar Precios por Porcentaje</h3>
                    <p>Subir o bajar precios en masa para combatir la inflación o lanzar ofertas por temporada.</p>
                  </div>
                </div>

                <form onSubmit={handleApplyBulk} className="bulk-form-grid">
                  <div className="form-item">
                    <label>Categoría a la que aplica</label>
                    <select value={bulkCategory} onChange={(e) => setBulkCategory(e.target.value)}>
                      <option value="todos">Todos los productos (Catálogo completo)</option>
                      <option value="autos">Solo Autos</option>
                      <option value="camionetas">Solo Camionetas</option>
                      <option value="camiones">Solo Camiones</option>
                      <option value="agricolas">Solo Agrícolas e Industriales</option>
                    </select>
                  </div>

                  <div className="form-item">
                    <label>Tipo de Ajuste</label>
                    <div className="radio-button-group">
                      <button 
                        type="button"
                        className={`radio-btn ${bulkAction === 'increase' ? 'active' : ''}`}
                        onClick={() => setBulkAction('increase')}
                      >
                        Aumentar Precios (+)
                      </button>
                      <button 
                        type="button"
                        className={`radio-btn ${bulkAction === 'decrease' ? 'active' : ''}`}
                        onClick={() => setBulkAction('decrease')}
                      >
                        Aplicar Descuento (-)
                      </button>
                    </div>
                  </div>

                  <div className="form-item">
                    <label>Porcentaje (%)</label>
                    <div className="percent-input-wrapper">
                      <input 
                        type="number" 
                        value={bulkPercent}
                        onChange={(e) => setBulkPercent(e.target.value)}
                        min="0.1"
                        max="100"
                        step="0.1"
                        required
                      />
                      <span>%</span>
                    </div>
                  </div>

                  <div className="form-actions-full">
                    <button type="submit" className="btn-apply-bulk-action">
                      Aplicar Ajuste Masivo a Catálogo
                    </button>
                  </div>
                </form>

                <div className="bulk-info-box">
                  <Info size={16} />
                  <p>
                    <strong>Nota:</strong> Los cambios se calcularán en base a los precios actuales en pantalla. Una vez aplicados, podés revisarlos en la pestaña de <em>Inventario</em> y hacer clic en <strong>Guardar Cambios</strong> abajo para registrarlos de forma definitiva.
                  </p>
                </div>
              </div>

              {/* Configuración de la Web Card */}
              <div className="bulk-card" style={{ marginTop: '30px' }}>
                <div className="bulk-header">
                  <Sliders size={22} className="bulk-header-icon" style={{ color: '#06b6d4' }} />
                  <div>
                    <h3>Configuración de Secciones de la Web</h3>
                    <p>Habilitá o deshabilitá secciones de la landing page según tu conveniencia comercial.</p>
                  </div>
                </div>

                <div className="config-options-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* HERO */}
                  <div className="config-option-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#07070a', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ paddingRight: '20px' }}>
                      <h4 style={{ color: '#fff', fontSize: '0.92rem', fontWeight: 700 }}>Buscador y Banner de Portada (Hero)</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '4px', lineHeight: 1.4 }}>
                        Muestra la sección principal superior con buscador de stock por marcas y medidas.
                      </p>
                    </div>
                    <label className="ios-toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={sectionsConfig.hero}
                        onChange={(e) => onToggleSection('hero', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  {/* CATALOG */}
                  <div className="config-option-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#07070a', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ paddingRight: '20px' }}>
                      <h4 style={{ color: '#fff', fontSize: '0.92rem', fontWeight: 700 }}>Catálogo de Neumáticos</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '4px', lineHeight: 1.4 }}>
                        Muestra la grilla interactiva de neumáticos con buscador textual, filtros y comparador de productos.
                      </p>
                    </div>
                    <label className="ios-toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={sectionsConfig.catalog}
                        onChange={(e) => onToggleSection('catalog', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  {/* ACCESSORIES */}
                  <div className="config-option-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#07070a', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ paddingRight: '20px' }}>
                      <h4 style={{ color: '#fff', fontSize: '0.92rem', fontWeight: 700 }}>Sección de Accesorios</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '4px', lineHeight: 1.4 }}>
                        Muestra la sección de herramientas, barras antivuelco, estribos y equipamiento para camionetas.
                      </p>
                    </div>
                    <label className="ios-toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={sectionsConfig.accessories}
                        onChange={(e) => onToggleSection('accessories', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  {/* SERVICES */}
                  <div className="config-option-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#07070a', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ paddingRight: '20px' }}>
                      <h4 style={{ color: '#fff', fontSize: '0.92rem', fontWeight: 700 }}>Servicios del Taller</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '4px', lineHeight: 1.4 }}>
                        Muestra los servicios de gomería (alineación, balanceo, mecánica ligera, etc.).
                      </p>
                    </div>
                    <label className="ios-toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={sectionsConfig.services}
                        onChange={(e) => onToggleSection('services', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  {/* BRANDS */}
                  <div className="config-option-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#07070a', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ paddingRight: '20px' }}>
                      <h4 style={{ color: '#fff', fontSize: '0.92rem', fontWeight: 700 }}>Marcas Aliadas</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '4px', lineHeight: 1.4 }}>
                        Muestra el carrusel horizontal con los logotipos de marcas internacionales asociadas.
                      </p>
                    </div>
                    <label className="ios-toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={sectionsConfig.brands}
                        onChange={(e) => onToggleSection('brands', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  {/* TESTIMONIALS */}
                  <div className="config-option-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#07070a', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ paddingRight: '20px' }}>
                      <h4 style={{ color: '#fff', fontSize: '0.92rem', fontWeight: 700 }}>Testimonios y Reseñas</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '4px', lineHeight: 1.4 }}>
                        Muestra las opiniones destacadas de clientes a nivel nacional.
                      </p>
                    </div>
                    <label className="ios-toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={sectionsConfig.testimonials}
                        onChange={(e) => onToggleSection('testimonials', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  {/* FAQ */}
                  <div className="config-option-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#07070a', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ paddingRight: '20px' }}>
                      <h4 style={{ color: '#fff', fontSize: '0.92rem', fontWeight: 700 }}>Preguntas Frecuentes (FAQ)</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '4px', lineHeight: 1.4 }}>
                        Muestra el panel de preguntas y respuestas sobre envíos, stock y formas de pago.
                      </p>
                    </div>
                    <label className="ios-toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={sectionsConfig.faq}
                        onChange={(e) => onToggleSection('faq', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  {/* CONTACT */}
                  <div className="config-option-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#07070a', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ paddingRight: '20px' }}>
                      <h4 style={{ color: '#fff', fontSize: '0.92rem', fontWeight: 700 }}>Contacto y Sucursal</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '4px', lineHeight: 1.4 }}>
                        Muestra la sección final con el formulario, teléfonos, horarios y mapa interactivo.
                      </p>
                    </div>
                    <label className="ios-toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={sectionsConfig.contact}
                        onChange={(e) => onToggleSection('contact', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REGISTER NEW TIRE */}
          {activeTab === 'nuevo' && (
            <div className="tab-pane fade-in">
              <div className="form-card">
                <form onSubmit={handleCreateProduct} className="new-product-form">
                  <h3 className="form-section-title">Información Básica</h3>
                  <div className="form-row-three">
                    <div className="form-item">
                      <label>Marca <span className="required">*</span></label>
                      <input 
                        type="text" 
                        placeholder="Ej: Pirelli, Xbri, Triangle" 
                        value={newTire.brand}
                        onChange={(e) => setNewTire({...newTire, brand: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-item">
                      <label>Modelo (Texto) <span className="required">*</span></label>
                      <input 
                        type="text" 
                        placeholder="Ej: FASTWAY P7, CATCHFORS" 
                        value={newTire.model}
                        onChange={(e) => setNewTire({...newTire, model: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-item">
                      <label>Categoría</label>
                      <select value={newTire.category} onChange={(e) => setNewTire({...newTire, category: e.target.value})}>
                        <option value="autos">Autos</option>
                        <option value="camionetas">Camionetas</option>
                        <option value="camiones">Camiones</option>
                        <option value="agricolas">Agrícolas e Industriales</option>
                      </select>
                    </div>
                  </div>

                  <h3 className="form-section-title">Medidas y Ficha Técnica</h3>
                  <div className="form-row-four">
                    <div className="form-item">
                      <label>Ancho (mm o pulgadas) <span className="required">*</span></label>
                      <input 
                        type="text" 
                        placeholder="Ej: 175, 205 o 31" 
                        value={newTire.width}
                        onChange={(e) => setNewTire({...newTire, width: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-item">
                      <label>Perfil (%)</label>
                      <input 
                        type="text" 
                        placeholder="Ej: 65, 70 o -- (agrario)" 
                        value={newTire.profile}
                        onChange={(e) => setNewTire({...newTire, profile: e.target.value})}
                      />
                    </div>
                    <div className="form-item">
                      <label>Rodado (pulgadas) <span className="required">*</span></label>
                      <input 
                        type="text" 
                        placeholder="Ej: 13, 15, 16" 
                        value={newTire.rim}
                        onChange={(e) => setNewTire({...newTire, rim: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-item">
                      <label>Índice Carga / Velocidad</label>
                      <div className="form-sub-row">
                        <input 
                          type="text" 
                          placeholder="Carga (91)" 
                          value={newTire.loadIndex}
                          onChange={(e) => setNewTire({...newTire, loadIndex: e.target.value})}
                          style={{ width: '50%' }}
                        />
                        <input 
                          type="text" 
                          placeholder="Vel (H)" 
                          value={newTire.speedRating}
                          onChange={(e) => setNewTire({...newTire, speedRating: e.target.value})}
                          style={{ width: '50%' }}
                        />
                      </div>
                    </div>
                  </div>

                  <h3 className="form-section-title">Comercial</h3>
                  <div className="form-row-three">
                    <div className="form-item">
                      <label>Precio Contado ($ ARS) <span className="required">*</span></label>
                      <input 
                        type="number" 
                        placeholder="Precio de lista" 
                        value={newTire.price}
                        onChange={(e) => setNewTire({...newTire, price: e.target.value})}
                        required
                        min="0"
                      />
                    </div>
                    <div className="form-item">
                      <label>Stock Inicial (u.)</label>
                      <input 
                        type="number" 
                        placeholder="Unidades en taller" 
                        value={newTire.stock}
                        onChange={(e) => setNewTire({...newTire, stock: e.target.value})}
                        min="0"
                      />
                    </div>
                    <div className="form-item">
                      <label>Etiqueta / Destacado</label>
                      <select value={newTire.tag} onChange={(e) => setNewTire({...newTire, tag: e.target.value})}>
                        <option value="">Ninguno</option>
                        <option value="Destacado">Destacado</option>
                        <option value="Oferta">Oferta</option>
                        <option value="Premium">Premium</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-item" style={{ marginTop: '15px' }}>
                    <label>URL de la Imagen del Neumático</label>
                    <input 
                      type="text" 
                      value={newTire.image}
                      onChange={(e) => setNewTire({...newTire, image: e.target.value})}
                    />
                  </div>

                  <div className="form-item" style={{ marginTop: '15px' }}>
                    <label>Descripción del Producto</label>
                    <textarea 
                      rows="3"
                      placeholder="Breve descripción para la ficha técnica del producto..."
                      value={newTire.description}
                      onChange={(e) => setNewTire({...newTire, description: e.target.value})}
                    />
                  </div>

                  <div className="form-submit-row-button">
                    <button type="submit" className="btn-add-product-submit">
                      Agregar Neumático al Inventario
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>

        {/* Global Save Changes Floating Indicator */}
        {hasChanges && (
          <div className="floating-save-bar-glow">
            <div className="save-bar-left">
              <CheckCircle size={20} className="check-glow-icon" />
              <div>
                <h4>Cambios pendientes detectados</h4>
                <p>Recordá guardar antes de salir para no perder las ediciones.</p>
              </div>
            </div>
            <button className="btn-save-database-action" onClick={handleSaveChanges}>
              <Save size={18} />
              <span>Guardar Cambios</span>
            </button>
          </div>
        )}

      </main>

      {/* MODAL: EDIT PRODUCT DETAILS */}
      {editingTire && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card fade-in">
            <div className="modal-header">
              <h3>Editar Ficha del Neumático</h3>
              <button className="btn-close-modal" onClick={() => setEditingTire(null)}>
                <X size={20} />
              </button>
            </div>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveTireDetails(editingTire);
              }}
              className="modal-form-body"
            >
              <div className="form-row-two">
                <div className="form-item">
                  <label>Marca</label>
                  <input 
                    type="text" 
                    value={editingTire.brand}
                    onChange={(e) => setEditingTire({...editingTire, brand: e.target.value})}
                    required
                  />
                </div>
                <div className="form-item">
                  <label>Modelo</label>
                  <input 
                    type="text" 
                    value={editingTire.model}
                    onChange={(e) => setEditingTire({...editingTire, model: e.target.value.toUpperCase()})}
                    required
                  />
                </div>
              </div>

              <div className="form-row-three">
                <div className="form-item">
                  <label>Ancho</label>
                  <input 
                    type="text" 
                    value={editingTire.width}
                    onChange={(e) => setEditingTire({...editingTire, width: e.target.value})}
                    required
                  />
                </div>
                <div className="form-item">
                  <label>Perfil</label>
                  <input 
                    type="text" 
                    value={editingTire.profile}
                    onChange={(e) => setEditingTire({...editingTire, profile: e.target.value})}
                    required
                  />
                </div>
                <div className="form-item">
                  <label>Rodado</label>
                  <input 
                    type="text" 
                    value={editingTire.rim}
                    onChange={(e) => setEditingTire({...editingTire, rim: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row-two">
                <div className="form-item">
                  <label>Precio Contado ($ ARS)</label>
                  <input 
                    type="number" 
                    value={editingTire.price}
                    onChange={(e) => setEditingTire({...editingTire, price: parseInt(e.target.value) || 0})}
                    required
                  />
                </div>
                <div className="form-item">
                  <label>Stock</label>
                  <input 
                    type="number" 
                    value={editingTire.stock}
                    onChange={(e) => setEditingTire({...editingTire, stock: parseInt(e.target.value) || 0})}
                    required
                  />
                </div>
              </div>

              <div className="form-row-three">
                <div className="form-item">
                  <label>Velocidad</label>
                  <input 
                    type="text" 
                    value={editingTire.speedRating}
                    onChange={(e) => setEditingTire({...editingTire, speedRating: e.target.value})}
                  />
                </div>
                <div className="form-item">
                  <label>Índice Carga</label>
                  <input 
                    type="text" 
                    value={editingTire.loadIndex}
                    onChange={(e) => setEditingTire({...editingTire, loadIndex: e.target.value})}
                  />
                </div>
                <div className="form-item">
                  <label>Etiqueta</label>
                  <select 
                    value={editingTire.tag || ""} 
                    onChange={(e) => setEditingTire({...editingTire, tag: e.target.value})}
                  >
                    <option value="">Ninguna</option>
                    <option value="Destacado">Destacado</option>
                    <option value="Oferta">Oferta</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
              </div>

              <div className="form-item">
                <label>URL Imagen del Producto</label>
                <input 
                  type="text" 
                  value={editingTire.image}
                  onChange={(e) => setEditingTire({...editingTire, image: e.target.value})}
                />
              </div>

              <div className="form-item">
                <label>Descripción del Producto</label>
                <textarea 
                  rows="3"
                  value={editingTire.description}
                  onChange={(e) => setEditingTire({...editingTire, description: e.target.value})}
                />
              </div>

              <div className="modal-actions-footer">
                <button type="button" className="btn-modal-cancel" onClick={() => setEditingTire(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-modal-save">
                  Guardar Detalles
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
