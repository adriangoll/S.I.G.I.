import { decodeJwtPayload } from "@/features/authEstudiantes/utils/jwt";

export const getRolToken = (token: string): string | null => {
    const payload = decodeJwtPayload<{ rol?: string }>(token);
    return payload?.rol || null;
}