export const generateUUID = (prefix: string = '') => {
    if (typeof crypto === 'undefined') {
        return `${prefix}-${Math.random().toString()}`;
    }
    return `${prefix}-${crypto.randomUUID()}`;
}
