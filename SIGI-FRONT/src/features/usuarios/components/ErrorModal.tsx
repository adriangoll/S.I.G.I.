import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { XCircle, X } from 'lucide-react';

interface ErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    errorMessage?: string;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, onClose, errorMessage = 'Ocurrió un error inesperado. Intenta nuevamente.' }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="modal-overlay">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="modal-card"
                        style={{ borderTop: '4px solid #ef4444' }}
                    >
                        <button onClick={onClose} className="modal-close-btn"><X size={18} /></button>
                        <div className="modal-center-container">
                            <div className="success-icon-badge" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
                                <XCircle size={40} />
                            </div>
                            <h3 className="modal-heading" style={{ color: '#b91c1c' }}>Error en el registro</h3>
                            <p className="modal-paragraph">{errorMessage}</p>
                            <button onClick={onClose} className="btn-modal-conclude" style={{ background: '#dc2626' }}>
                                Cerrar
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};