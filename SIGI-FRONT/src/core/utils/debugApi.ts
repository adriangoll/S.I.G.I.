export const debugApi = (label: string, payload: unknown) => {
  if (import.meta.env.DEV) {
    console.log(`[SIGI/API] ${label}`, payload);
  }
};

export const debugApiError = (label: string, error: unknown) => {
  if (import.meta.env.DEV) {
    console.error(`[SIGI/API] ${label}`, error);
  }
};
