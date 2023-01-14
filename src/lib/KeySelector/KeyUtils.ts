export const disallowedKeys = new Set([' ', 'Enter']);

export const mapDisplayKey = (key: string) => {
    switch (key) {
        case ' ':
            return 'Space';
        case 'ArrowLeft':
            return '←';
        case 'ArrowRight':
            return '→';
        case 'ArrowUp':
            return '↑';
        case 'ArrowDown':
            return '↓';
        default:
            return key;
    }
};
