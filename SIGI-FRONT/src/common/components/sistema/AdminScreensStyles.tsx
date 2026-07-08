import React from 'react';

const adminScreensCss = `
/* [CICLOS-MIGRABLE-START] Ajustes visuales para acercar la pantalla al mock conservando componentes comunes. */

.ciclos-admin-screen {
  min-height: 100%;
}

.ciclos-admin-primary-btn {
  border-radius: 8px !important;
  min-width: 238px;
}

.ciclos-admin-filters {
  border-radius: 12px !important;
}

.ciclos-admin-filters .MuiInputLabel-root {
  font-size: 12px;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  font-weight: 700;
}

.ciclos-admin-filters .MuiOutlinedInput-root {
  border-radius: 8px;
  background: #ffffff;
}


.ciclos-admin-cards {
  margin-top: 8px;
}

.ciclos-admin-card-planning,
.ciclos-admin-card-status {
  min-height: 198px;
}

.ciclos-admin-card-planning {
  position: relative;
  overflow: hidden;
}

.ciclos-admin-card-planning::after {
  content: '';
  position: absolute;
  width: 180px;
  height: 180px;
  right: -40px;
  bottom: -44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  pointer-events: none;
}

/* [CICLOS-MIGRABLE-END] Ajustes visuales para acercar la pantalla al mock conservando componentes comunes. */

/* [DOCENTES-MIGRABLE-START] Ajustes visuales para acercar la pantalla Docentes al mock con componentes comunes. */

.docentes-admin-primary-btn {
  border-radius: 8px !important;
  min-width: 238px;
}

.docentes-admin-screen .MuiOutlinedInput-root {
  border-radius: 8px;
  background: #ffffff;
}


.docentes-admin-email {
  color: #3e484b;
  font-size: 11px;
}

.docentes-admin-speciality {
  color: #000000;
  font-size: 14px;
  font-weight: 500;
}

.docentes-admin-title {
  color: #6f797b;
  font-size: 10px;
}

.docentes-admin-form-section-title {
  color: #1d2a2f;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.docentes-admin-form-divider {
  border-top: 1px solid #d5dde0;
  margin: 2px 0;
}

/* [DOCENTES-MIGRABLE-END] Ajustes visuales para acercar la pantalla Docentes al mock con componentes comunes. */

/* [MABS-MIGRABLE-START] New screen styles for Admin MABs module */

.mabs-screen {
  display: flex;
  flex-direction: column;
  gap: 24px;
  color: #181c1d;
}

.mabs-breadcrumb {
  font-family: Manrope, Poppins, Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: #64748b;
}

.mabs-breadcrumb strong {
  color: #005b7f;
}

.mabs-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.mabs-title {
  margin: 0;
  font-family: 'Plus Jakarta Sans', Manrope, sans-serif;
  font-size: clamp(24px, 2.4vw, 34px);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: #005b7f;
}

.mabs-subtitle {
  margin: 8px 0 0;
  font-size: 16px;
  line-height: 24px;
  color: #64748b;
}

.mabs-action-btn {
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  background: linear-gradient(90deg, #005560 0%, #006f7d 100%);
  box-shadow: 0 12px 20px -8px rgba(0, 85, 96, 0.5);
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
}

.mabs-action-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.mabs-alert {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 16px;
  border-left: 8px solid #735c00;
  border-radius: 14px;
  background: #ffe084;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.mabs-alert-title {
  margin: 0 0 6px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #231b00;
}

.mabs-alert-list {
  margin: 0;
  padding-left: 16px;
  display: grid;
  gap: 4px;
}

.mabs-alert-list li {
  font-size: 14px;
  line-height: 20px;
  color: #231b00;
}

.mabs-alert-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  padding: 0 8px;
  border-radius: 4px;
  background: #f2b705;
  color: #161d1f;
  font-size: 12px;
  font-weight: 700;
}

.mabs-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 250px;
  gap: 24px;
}

.mabs-left {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mabs-search-wrap {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  max-width: 420px;
}

.mabs-search-input {
  flex: 1;
}

.mabs-search-clear {
  border: 1px solid #cdd5da;
  border-radius: 8px;
  background: #ffffff;
  color: #005b7f;
  padding: 9px 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.mabs-search-clear:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.mabs-tabs {
  display: inline-flex;
  gap: 8px;
  padding: 6px;
  border-radius: 16px;
  background: #f1f4f4;
  width: fit-content;
}

.mabs-tab {
  border: none;
  border-radius: 12px;
  background: transparent;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 700;
  color: #64748b;
  cursor: pointer;
}

.mabs-tab.is-active {
  background: #ffffff;
  color: #005b7f;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}



.mabs-docente {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mabs-avatar {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
  background: linear-gradient(135deg, #005b7f 0%, #007b83 100%);
}

.mabs-docente-nombre {
  font-size: 14px;
  font-weight: 700;
  line-height: 18px;
}

.mabs-docente-legajo {
  font-size: 10px;
  color: #64748b;
}

.mabs-materia-nombre {
  font-size: 14px;
  font-weight: 700;
}

.mabs-materia-nombre.is-warning {
  color: #944a00;
}

.mabs-materia-nombre.is-info {
  color: #005b7f;
}

.mabs-materia-plan {
  font-size: 10px;
  color: #94a3b8;
  margin-top: 2px;
}

.mabs-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
}

.mabs-pill.tipo {
  border-radius: 8px;
  background: #e5e9e9;
  color: #475569;
  font-size: 12px;
}

.mabs-pill.estado-vencer {
  background: #ffe084;
  color: #574500;
}

.mabs-pill.estado-activo {
  background: #96f1fa;
  color: #005b7f;
}

.mabs-pill.estado-vencido {
  background: #e5e9e9;
  color: #475569;
}

.mabs-dias {
  font-size: 14px;
  font-weight: 900;
}

.mabs-dias.is-warning {
  color: #735c00;
}

.mabs-dias.is-info {
  color: #005b7f;
}

.mabs-dias.is-muted {
  color: #94a3b8;
}



.mabs-right {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.mabs-noti-card {
  border-top: 4px solid #005b7f;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 12px 32px rgba(24, 28, 29, 0.06);
  padding: 24px;
}

.mabs-noti-title {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: #005b7f;
}

.mabs-noti-list {
  margin-top: 20px;
  display: grid;
  gap: 12px;
}

.mabs-noti-item {
  border-left: 4px solid #005b7f;
  border-radius: 14px;
  background: rgba(241, 244, 244, 0.5);
  padding: 14px;
}

.mabs-noti-item.is-warning {
  border-left-color: #735c00;
}

.mabs-noti-item.is-danger {
  border-left-color: #ba1a1a;
}

.mabs-noti-kicker {
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #005b7f;
}

.mabs-noti-item.is-warning .mabs-noti-kicker {
  color: #735c00;
}

.mabs-noti-item.is-danger .mabs-noti-kicker {
  color: #ba1a1a;
}

.mabs-noti-name {
  margin-top: 4px;
  font-size: 14px;
  font-weight: 700;
  color: #181c1d;
}

.mabs-noti-description {
  margin-top: 4px;
  font-size: 12px;
  line-height: 18px;
  color: #475569;
}

.mabs-noti-cta {
  margin-top: 16px;
  width: 100%;
  border: none;
  background: transparent;
  color: #005b7f;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;
}

.mabs-stats-card {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  background: linear-gradient(135deg, #005b7f 0%, #007b83 100%);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  padding: 24px;
  color: #ffffff;
}

.mabs-stats-kicker {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.7;
}

.mabs-stats-title {
  margin: 6px 0 0;
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
  font-size: 24px;
  font-weight: 800;
}

.mabs-progress-head {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 700;
}

.mabs-progress-track {
  width: 100%;
  height: 6px;
  margin-top: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
}

.mabs-progress-fill {
  width: 88%;
  height: 100%;
  border-radius: 999px;
  background: #fc8f34;
  box-shadow: 0 0 8px rgba(252, 143, 52, 0.6);
}

.mabs-stats-copy {
  margin-top: 14px;
  font-size: 12px;
  line-height: 20px;
  opacity: 0.8;
}

/* [MABS-MIGRABLE-START] Modal Nuevo MAB styles */
.mabs-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1400;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 120px 16px;
  background: rgba(0, 91, 127, 0.4);
  backdrop-filter: blur(6px);
}

.mabs-modal-card {
  position: relative;
  width: min(672px, 100%);
  background: #ffffff;
  border: 1px solid rgba(189, 201, 202, 0.2);
  box-shadow: 0 12px 32px rgba(24, 28, 29, 0.06);
  border-radius: 12px;
}

.mabs-modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #bec8cb;
  cursor: pointer;
}

.mabs-modal-header {
  padding: 32px 32px 16px;
}

.mabs-modal-title {
  margin: 0;
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
  font-size: 32px;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: #005b7f;
}

.mabs-modal-subtitle {
  margin: 8px 0 0;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: #3e494a;
}

.mabs-modal-content {
  padding: 16px 32px;
  display: grid;
  gap: 16px;
}

.mabs-modal-feedback {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
}

.mabs-modal-feedback--error {
  color: #ba1a1a;
}

.mabs-modal-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px 24px;
}

.mabs-field {
  display: grid;
  gap: 6px;
}

.mabs-field--half {
  grid-column: 1 / 2;
}

.mabs-field-label {
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: #3e494a;
}

.mabs-select-wrap {
  position: relative;
}

.mabs-input {
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 8px;
  background: rgba(0, 91, 127, 0.2);
  color: #181c1d;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  padding: 12px 16px;
  box-sizing: border-box;
}

.mabs-input::placeholder {
  color: rgba(110, 121, 122, 0.55);
}

.mabs-input:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

select.mabs-input {
  appearance: none;
  padding-right: 36px;
}

.mabs-input-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #6e797a;
  pointer-events: none;
}

.mabs-segment-wrap {
  display: grid;
  gap: 8px;
  width: fit-content;
}

.mabs-segmented {
  width: 392px;
  max-width: 100%;
  border-radius: 100px;
  padding: 2px;
  background: rgba(0, 91, 127, 0.4);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}

.mabs-segment-button {
  border: none;
  border-radius: 20px;
  padding: 6px 10px;
  font-size: 13px;
  font-weight: 600;
  line-height: 18px;
  color: #121212;
  background: transparent;
  cursor: pointer;
}

.mabs-segment-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.mabs-segment-button.is-active {
  background: #ffffff;
}

.mabs-vencimiento-wrap {
  width: 384px;
  max-width: 100%;
  display: grid;
  gap: 4px;
}

.mabs-field--vencimiento {
  width: 100%;
}

.mabs-warning-copy {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding-left: 4px;
  color: #ba1a1a;
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
}

.mabs-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 32px 32px;
}

.mabs-modal-btn {
  height: 42px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.mabs-modal-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.mabs-global-feedback {
  margin: 0;
  border: 1px solid #a7f3d0;
  background: #ecfdf5;
  color: #065f46;
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
}

.mabs-modal-btn--cancel {
  border: 1px solid #6f797b;
  background: #ffffff;
  color: #3e484b;
  padding: 10px 24px;
}

.mabs-modal-btn--save {
  border: none;
  background: #005b7f;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
}
/* [MABS-MIGRABLE-END] Modal Nuevo MAB styles */

@media (max-width: 1200px) {
  .mabs-grid {
    grid-template-columns: 1fr;
  }

  .mabs-right {
    order: -1;
  }
}

@media (max-width: 768px) {
  .mabs-header {
    flex-direction: column;
    align-items: stretch;
  }

  .mabs-action-btn {
    width: 100%;
  }

  .mabs-alert {
    padding: 14px;
  }

  .mabs-tabs {
    width: 100%;
    overflow-x: auto;
  }

  .mabs-tab {
    white-space: nowrap;
  }

  .mabs-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .mabs-modal-overlay {
    padding: 40px 12px;
    align-items: center;
  }

  .mabs-modal-header,
  .mabs-modal-content,
  .mabs-modal-footer {
    padding-left: 16px;
    padding-right: 16px;
  }

  .mabs-modal-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .mabs-field--half,
  .mabs-vencimiento-wrap {
    grid-column: auto;
    width: 100%;
  }

  .mabs-modal-title {
    font-size: 28px;
  }

  .mabs-modal-footer {
    flex-direction: column;
  }

  .mabs-modal-btn {
    width: 100%;
  }
}

/* [MABS-MIGRABLE-END] New screen styles for Admin MABs module */
`;

export const AdminScreensStyles: React.FC = () => <style>{adminScreensCss}</style>;
