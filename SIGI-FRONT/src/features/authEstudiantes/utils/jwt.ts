import { jwtDecode } from 'jwt-decode';

export function decodeJwtPayload<T = unknown>(token: string): T | null {
	try {
		return jwtDecode<T>(token);
	} catch {
		return null;
	}
}
