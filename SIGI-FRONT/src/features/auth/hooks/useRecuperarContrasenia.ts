import { useState, useCallback } from 'react';
import { authService } from '../service/auth.service';
import type { RolRecuperacion } from '../dto/recuperar-contrasenia.dto';

export function useRecuperarContrasenia(rol: RolRecuperacion) {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const submit = useCallback(async (email: string) => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const message = await authService.recuperarContrasenia({ email, rol });
            setSuccessMessage(message);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'No se pudo enviar la solicitud');
        } finally {
            setLoading(false);
        }
    }, [rol]);

    const reset = useCallback(() => {
        setSuccessMessage(null);
        setError(null);
    }, []);

    return { loading, successMessage, error, submit, reset };
}
