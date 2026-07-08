import React from 'react';
import { User, Mail, Key, Eye, EyeOff, LogIn } from 'lucide-react';
import { PASSWORD_HINT } from '@/common/validation/person.schema';

interface RegistroFormProps {
  formData: {
    nombre: string;
    apellido: string;
    email: string;
    contrasena: string;
  };
  errors: Partial<RegistroFormProps['formData']>;
  showPassword: boolean;
  isSubmitting: boolean;
  onChange: (field: keyof RegistroFormProps['formData'], value: string) => void;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
  // onGoogleClick: () => void; 
  // googleLoading: boolean;
}

export const RegistroForm: React.FC<RegistroFormProps> = ({
  formData,
  errors,
  showPassword,
  isSubmitting,
  onChange,
  onTogglePassword,
  onSubmit,
  // onGoogleClick,
  // googleLoading,
}) => {
  return (
    <div className="register-card">
      <div className="card-top-indicator"></div>
      <div className="card-message-header">
        <h2 className="card-message-text">Ingresá tus datos personales</h2>
      </div>

      <form onSubmit={onSubmit} className="register-form">
        {/* Nombre */}
        <div className="form-group">
          <label className="form-label">Nombre</label>
          <div className="input-container">
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => onChange('nombre', e.target.value)}
              className={`input-field ${errors.nombre ? 'input-field-error' : ''}`}
              placeholder="nombre"
            />
            <span className="input-icon-left"><User size={18} /></span>
          </div>
          {errors.nombre && <span className="input-error-message">{errors.nombre}</span>}
        </div>

        {/* Apellido */}
        <div className="form-group">
          <label className="form-label">Apellido</label>
          <div className="input-container">
            <input
              type="text"
              value={formData.apellido}
              onChange={(e) => onChange('apellido', e.target.value)}
              className={`input-field ${errors.apellido ? 'input-field-error' : ''}`}
              placeholder="apellido"
            />
            <span className="input-icon-left"><User size={18} /></span>
          </div>
          {errors.apellido && <span className="input-error-message">{errors.apellido}</span>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label className="form-label">Email</label>
          <div className="input-container">
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onChange('email', e.target.value)}
              className={`input-field ${errors.email ? 'input-field-error' : ''}`}
              placeholder="ejemplo@gmail.com"
            />
            <span className="input-icon-left"><Mail size={18} /></span>
          </div>
          {errors.email && <span className="input-error-message">{errors.email}</span>}
        </div>

        {/* Contraseña */}
        <div className="form-group">
          <label className="form-label">Contraseña</label>
          <div className="input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.contrasena}
              onChange={(e) => onChange('contrasena', e.target.value)}
              className={`input-field ${errors.contrasena ? 'input-field-error' : ''}`}
              placeholder="••••••••••••"
            />
            <span className="input-icon-left"><Key size={18} /></span>
            <button type="button" onClick={onTogglePassword} className="password-toggle-btn">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.contrasena && <span className="input-error-message">{errors.contrasena}</span>}
          <span className="input-help-message" style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', display: 'block' }}>
            {PASSWORD_HINT}
          </span>
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-submit-action">
          {isSubmitting ? (
            <div className="spinner"></div>
          ) : (
            <>
              <LogIn size={18} strokeWidth={2.5} style={{ marginRight: '2px' }} />
              <span>Registrate</span>
            </>
          )}
        </button>
      </form>
      {/* TODO: Descomentar cuando se implemente Google Sign In */}
      {/* <div className="social-separator-container">
        <span className="separator-text">o usá tus credenciales de Google</span>
        <button type="button" onClick={onGoogleClick} disabled={googleLoading} className="btn-google-signup">
          {googleLoading ? (
            <div className="spinner spinner-blue"></div>
          ) : (
            <>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="google-vector-icon">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.08H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.92l2.85-2.22c-.62-.17-1.12-.47-1.53-.87z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.08l3.66 2.84c.87-2.6 3.3-4.54 6.16-4.54z" fill="#EA4335" />
              </svg>
              <span>Registrate con Google</span>
            </>
          )}
        </button>
      </div> */}

      <div className="warning-footer-banner">
        <span className="warning-banner-icon" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </span>
        <p className="warning-banner-paragraph">
          Este es un sistema del Instituto Superior Santa Rosa de Calamuchita. Todo acceso y actividad es monitoreada y registrada según los protocolos de ciberseguridad institucional.
        </p>
      </div>
    </div>
  );
};