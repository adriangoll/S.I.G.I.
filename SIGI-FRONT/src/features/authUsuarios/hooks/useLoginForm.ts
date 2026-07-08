import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authUsuarioService } from '../service/authUsuario.service';
import { LoginAttemptError } from '../../../core/api/loginError.util';
import { usuarioRecuperarPath } from '@/Routes/usuariosRoutes';
import type { AuthUser } from '../dto/authUsuario.dto';

export interface LoginMeta {
    intentosFallidos?: number;
    intentosRestantes?: number;
    mostrarAdvertencia?: boolean;
}

export const useLoginForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loginMeta, setLoginMeta] = useState<LoginMeta | null>(null);
    const [locked, setLocked] = useState(false);

    const validateEmail = (val: string) => {
        if (!val) {
            setEmailError('El email es obligatorio');
            return false;
        }
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(val)) {
            setEmailError('Formato de email inválido (ej: usuario@issrc.edu)');
            return false;
        }
        setEmailError('');
        return true;
    };

    // Para login, solo verificamos que la contraseña no esté vacía.
    // (La fortaleza de la contraseña se valida en el registro, no en el inicio de sesión)
    const validatePassword = (val: string) => {
        if (!val) {
            setPasswordError('La contraseña es obligatoria');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const handleSubmit = async (
        e: React.FormEvent,
        onSuccess: (user: AuthUser) => void
    ) => {
        e.preventDefault();
        const isEmailValid = validateEmail(email);
        const isPassValid = validatePassword(password);
        if (!isEmailValid || !isPassValid) return;

        setLoading(true);
        setError(null);
        setLoginMeta(null);
        try {
            const user = await authUsuarioService.login({
                email,
                contrasenia: password,
                rol: 'USUARIO',
            });
            setLocked(false);
            onSuccess(user);
        } catch (err) {
            if (err instanceof LoginAttemptError) {
                if (err.details.code === 'LOGIN_LOCKED') {
                    setLocked(true);
                    setLoginMeta(null);
                    setError(null);
                    navigate(usuarioRecuperarPath, { state: { email, bloqueado: true } });
                    return;
                }

                setLoginMeta({
                    intentosFallidos: err.details.intentosFallidos,
                    intentosRestantes: err.details.intentosRestantes,
                    mostrarAdvertencia: err.details.mostrarAdvertencia,
                });
                setError(err.message);
            } else {
                const message = err instanceof Error
                    ? err.message
                    : 'Credenciales incorrectas. Por favor, verifique sus datos.';
                setError(message);
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        setShowPassword,
        loading,
        error,
        setError,
        emailError,
        passwordError,
        validateEmail,
        validatePassword,
        handleSubmit,
        loginMeta,
        locked,
    };
};
