export function readStorage(key, fallback) {
    try {
        return window.localStorage.getItem(key) ?? fallback;
    } catch {
        return fallback;
    }
}

export function writeStorage(key, value) {
    try {
        window.localStorage.setItem(key, value);
        return true;
    } catch {
        return false;
    }
}

export function readJsonStorage(key, fallback) {
    try {
        const value = window.localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
}

export function writeJsonStorage(key, value) {
    return writeStorage(key, JSON.stringify(value));
}
