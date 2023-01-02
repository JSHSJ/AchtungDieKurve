export const generateUUID = (prefix: string = '') => {
    if (typeof crypto === 'undefined' || Object.keys(crypto).length === 0) {
        return `${prefix}-${Math.random().toString()}`;
    }
    return `${prefix}-${crypto.randomUUID()}`;
};
