import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, X } from 'lucide-react';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    userData: {
        nombre: string;
        apellido: string;
        email: string;
        contrasena: string;
    };
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, userData }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="modal-overlay">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                        className="modal-card"
                    >
                        <div className="modal-top-accent" />
                        <button onClick={onClose} className="modal-close-btn"><X size={18} /></button>
                        <div className="modal-center-container">
                            <div className="success-icon-badge"><CheckCircle2 size={40} /></div>
                            <h3 className="modal-heading">¡Registro Exitoso!</h3>
                            <p className="modal-paragraph">
                                Los datos del Usuario han sido procesados correctamente.
                            </p>
                            <div className="data-summary-box">
                                <p className="data-headline">Datos ingresados:</p>
                                <p className="data-row"><strong>Nombre Completo:</strong> {userData.nombre} {userData.apellido}</p>
                                <p className="data-row"><strong>Email Registrado:</strong> {userData.email}</p>
                                <p className="data-row"><strong>Contraseña:</strong> {userData.contrasena.replace(/./g, '•')}</p>
                            </div>
                            <button onClick={onClose} className="btn-modal-conclude">Concluir Registro</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};