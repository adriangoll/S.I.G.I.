import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authEstudianteService } from '../service/authEstudiante.service';
import type { AuthUser } from '../dto/authEstudiante.dto';

interface AuthContextValue {
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
    login: (data: { email: string; contrasenia: string; rol: 'ESTUDIANTE' }) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthEstudianteContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuthEstudiante = (): AuthContextValue => {
    const ctx = useContext(AuthEstudianteContext);
    if (!ctx) throw new Error('useAuthEstudiante debe usarse dentro de AuthEstudianteProvider');
    return ctx;
};

export const AuthEstudianteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Al montar el provider, intentamos recuperar el usuario del token
    useEffect(() => {
        const storedUser = authEstudianteService.getStoredUser();
        if (storedUser) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = useCallback(async (data: { email: string; contrasenia: string; rol: 'ESTUDIANTE' }) => {
        setLoading(true);
        setError(null);
        try {
            const loggedUser = await authEstudianteService.login(data);
            setUser(loggedUser); // usuario completo (con nombre y apellido)
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setLoading(true);
        try {
            await authEstudianteService.logout();
        } catch (err) {
            console.error('Error en logout:', err);
        } finally {
            setUser(null);
            setError(null);
            setLoading(false);
        }
    }, []);

    return (
        <AuthEstudianteContext.Provider value={{ user, loading, error, login, logout }}>
            {children}
        </AuthEstudianteContext.Provider>
    );
};