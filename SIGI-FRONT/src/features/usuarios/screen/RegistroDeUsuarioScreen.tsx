import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import issrcLogo from '@/assets/logos/logo_color_ISSRC.svg';
import { usuarioService } from '../../usuarios/service/usuario.service';
import '../css/registro.css';
import { SuccessModal } from '../../usuarios/components/SuccessModal';
import { ErrorModal } from '../../usuarios/components/ErrorModal';
import { RegistroForm } from '../../usuarios/components/RegistroUsuarioForm';
import { useNavigate } from 'react-router-dom';
import { PASSWORD_REGEX, PASSWORD_MESSAGE } from '@/common/validation/person.schema';

interface RegisterFormState {
    nombre: string;
    apellido: string;
    email: string;
    contrasena: string;
}

export const RegistroDeUsuarioScreen = () => {
    const navigate = useNavigate();
    // --- STATE MANAGEMENT ---
    const [form, setForm] = useState<RegisterFormState>({
        nombre: '',
        apellido: '',
        email: '',
        contrasena: ''
    });

    const [errors, setErrors] = useState<Partial<RegisterFormState>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    // const [showGoogleLoading, setShowGoogleLoading] = useState(false);   // FUTURO: Google auth
    // const [showGoogleModal, setShowGoogleModal] = useState(false);       // FUTURO: Google auth

    // Custom Demo settings
    const [networkDelay, setNetworkDelay] = useState<number>(1000);
    const [copiedCodeCode, setCopiedCodeCode] = useState(false);
    const [isDevPanelOpen, setIsDevPanelOpen] = useState(false);

    const handleResetToFigma = () => {
        setForm({
            nombre: form.nombre,
            apellido: form.apellido,
            email: form.email,
            contrasena: form.contrasena
        });
        setErrors({});
    };

    const onCloseSuccessModal = () => {
        setShowSuccessModal(false);
        // Redirigir a la página de login después de cerrar el modal
        navigate('/usuario/login');
    };

    const handleClearAll = () => {
        setForm({
            nombre: form.nombre,
            apellido: form.apellido,
            email: form.email,
            contrasena: form.contrasena
        });
        setErrors({});
    };

    const handleInputChange = (field: keyof RegisterFormState, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const tempErrors: Partial<RegisterFormState> = {};
        if (!form.nombre.trim()) tempErrors.nombre = 'El nombre es obligatorio';
        if (!form.apellido.trim()) tempErrors.apellido = 'El apellido es obligatorio';
        if (!form.email.trim()) tempErrors.email = 'El correo electrónico es obligatorio';
        else if (!/\S+@\S+\.\S+/.test(form.email)) tempErrors.email = 'El formato del correo electrónico no es válido';
        if (!form.contrasena) {
            tempErrors.contrasena = 'La contraseña es obligatoria';
        } else if (!PASSWORD_REGEX.test(form.contrasena)) {
            tempErrors.contrasena = PASSWORD_MESSAGE;
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmitForm = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        // Mapear los campos del formulario al DTO esperado por el backend
        const payload = {
            nombre: form.nombre,
            apellido: form.apellido,
            email: form.email,
            contrasenia: form.contrasena,
            // activo: true,                // opcional, el backend puede asignar default
        };

        const result = await usuarioService.create(payload);

        if (result.error) {
            // Si hay errores de validación de Zod, mostrarlos campo por campo
            if (result.validationErrors) {
                const fieldMap: Record<string, keyof RegisterFormState> = {
                    nombre: 'nombre',
                    apellido: 'apellido',
                    email: 'email',
                    contrasenia: 'contrasena',
                };
                const mappedErrors: Partial<RegisterFormState> = {};
                for (const [key, value] of Object.entries(result.validationErrors)) {
                    const formKey = fieldMap[key];
                    if (formKey) mappedErrors[formKey] = value;
                }
                setErrors(mappedErrors);
                const firstError = Object.values(mappedErrors)[0];
                setErrorMessage(firstError ?? 'Por favor, corrige los errores en el formulario.');
                setShowErrorModal(true);
            } else {
                setErrorMessage(result.error || 'Error en el registro');
                setShowErrorModal(true);
            }
            setIsSubmitting(false);
            return;
        }

        // Éxito
        setShowSuccessModal(true);
        setIsSubmitting(false);
    };

    // FUTURO: Google auth
    // const handleGoogleSignup = () => {
    //     setShowGoogleLoading(true);
    //     setTimeout(() => {
    //         setShowGoogleLoading(false);
    //         setShowGoogleModal(true);
    //     }, 1200);
    // };

    // const confirmGoogleAuth = (googleEmail: string) => {
    //     setForm({
    //         nombre: form.nombre,
    //         apellido: form.apellido,
    //         email: googleEmail,
    //         contrasena: form.contrasena
    //     });
    //     setShowGoogleModal(false);
    //     setShowSuccessModal(true);
    // };

    const handleCopyReactCode = () => {
        const reactTemplateCode = `... (código de ejemplo que tenías) ...`;
        navigator.clipboard.writeText(reactTemplateCode);
        setCopiedCodeCode(true);
        setTimeout(() => setCopiedCodeCode(false), 2000);
    };

    return (
        <div id="registration-app-main" className="app-container">

            {/* Background Architectural Grid Pattern */}
            <div
                className="background-architectural-overlay"
                style={{
                    background: 'radial-gradient(70.71% 70.71% at 50% 50%, #BEC8C9 2.21%, rgba(190, 200, 201, 0) 2.21%)',
                    backgroundSize: '24px 24px'
                }}
            />

            {/* --- FORM STATE DIAGNOSTIC PANEL --- */}
            <AnimatePresence>
                {isDevPanelOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="diagnostic-panel"
                    >
                        <div className="diagnostic-grid">
                            <div className="diagnostic-column">
                                <h4 className="diagnostic-title">
                                    <span className="diagnostic-glow-dot"></span>
                                    Estado actual (FormState) en Tiempo Real
                                </h4>
                                <pre className="diagnostic-pre">{JSON.stringify(form, null, 2)}</pre>
                            </div>
                            <div className="diagnostic-column" style={{ justifyContent: 'space-between' }}>
                                <div>
                                    <h4 className="diagnostic-title diagnostic-title-amber">
                                        <span className="diagnostic-glow-dot diagnostic-glow-dot-amber"></span>
                                        Errores de Validación
                                    </h4>
                                    <pre className="diagnostic-pre diagnostic-pre-amber">
                                        {Object.keys(errors).length > 0 ? JSON.stringify(errors, null, 2) : '// Todo en orden. Sin errores.'}
                                    </pre>
                                </div>
                                <div className="diagnostic-notes">
                                    <p style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' }}>💡 Notas sobre el Diseño:</p>
                                    <p>Este prototipo implementa a la perfección cada especificación del Grid arquitectónico Figma.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- MAIN PAGE CONTENT --- */}
            <div className="workspace-content">
                <div className="login-container">

                    {/* Brand/Header Section */}
                    <div className="brand-section">
                        <div className="brand-badge-container">
                            <img src={issrcLogo} alt="ISSRC Logo" style={{ width: '72px', height: 'auto' }} />
                        </div>
                        <h1 className="brand-heading">Registro de usuario</h1>
                    </div>

                    {/* Aquí usamos el componente separado RegistroForm */}
                    <RegistroForm
                        formData={form}
                        errors={errors}
                        showPassword={showPassword}
                        isSubmitting={isSubmitting}
                        onChange={handleInputChange}
                        onTogglePassword={() => setShowPassword(!showPassword)}
                        onSubmit={handleSubmitForm}
                    // onGoogleClick={handleGoogleSignup}   // FUTURO: Google auth
                    // googleLoading={showGoogleLoading}     // FUTURO: Google auth
                    />

                </div>
            </div>

            {/* --- FOOTER GENERAL BRANDING --- */}
            <footer className="branding-footer">
                <p>© 2026 Instituto Superior Santa Rosa de Calamuchita (ISSRC)</p>
                <p className="branding-subfooter">Ruta Provincial 5 - Villa Santa Rosa, Calamuchita</p>
            </footer>

            {/* Modales */}
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={onCloseSuccessModal}
                userData={form}
            />

            <ErrorModal
                isOpen={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                errorMessage={errorMessage}
            />

            {/* FUTURO: Google Auth Modal - Comentado hasta nueva orden */}
            {/* <AnimatePresence>
                {showGoogleModal && (
                    <div className="modal-overlay" style={{ backgroundColor: 'rgba(2, 6, 23, 0.7)' }}>
                        ... contenido del modal de Google ...
                    </div>
                )}
            </AnimatePresence> */}

        </div >
    );
};