import { useState, useCallback } from 'react';
import { authService } from '../service/auth.service';
import type { RestablecerContraseniaFormData } from '../dto/restablecer-contrasenia.schema';

export function useRestablecerContrasenia(token: string | undefined) {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const submit = useCallback(async (data: RestablecerContraseniaFormData) => {
        if (!token) {
            setError('El enlace de recuperación es inválido o está incompleto.');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const message = await authService.restablecerContrasenia({
                token,
                nuevaContrasenia: data.nuevaContrasenia,
            });
            setSuccessMessage(message);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'No se pudo restablecer la contraseña');
        } finally {
            setLoading(false);
        }
    }, [token]);

    return { loading, successMessage, error, submit, isTokenMissing: !token };
}
