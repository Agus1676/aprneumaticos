import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, X, Eye, EyeOff, Lock } from 'lucide-react';
import './AdminLoginModal.css';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  // Auto focus input on open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
    // Clean state on open/close
    setPassword('');
    setError('');
    setShowPassword(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) {
      setError('Por favor ingrese la clave.');
      return;
    }

    // "apr2026" in base64 is "YXByMjAyNg=="
    if (btoa(password) === "YXByMjAyNg==") {
      onLoginSuccess();
      onClose();
    } else {
      setError('Clave incorrecta. Por favor intente de nuevo.');
      setPassword('');
      if (inputRef.current) inputRef.current.focus();
    }
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-card fade-in">
        {/* Header Decor Line */}
        <div className="login-modal-decor"></div>

        {/* Close Button */}
        <button className="btn-close-login" onClick={onClose} aria-label="Cerrar modal">
          <X size={20} />
        </button>

        {/* Content */}
        <div className="login-modal-content">
          <div className="lock-icon-box">
            <Lock size={32} className="lock-icon" />
          </div>

          <h3>Acceso de Administración</h3>
          <p>Ingrese la clave de seguridad para administrar stock, precios y catálogos.</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group-password">
              <input 
                ref={inputRef}
                type={showPassword ? 'text' : 'password'} 
                placeholder="Clave de seguridad"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className={error ? 'input-error' : ''}
              />
              <button 
                type="button" 
                className="btn-toggle-visibility"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Ocultar clave' : 'Mostrar clave'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <div className="login-error-msg">
                <ShieldAlert size={14} />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="btn-login-submit">
              Ingresar a Panel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
