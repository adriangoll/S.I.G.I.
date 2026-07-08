export const formatZodErrors = (error: any): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (error.errors) {
        error.errors.forEach((err: any) => {
            if (err.path) {
                errors[err.path[0]] = err.message;
            }
        });
    }
    return errors;
}