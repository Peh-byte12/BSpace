import { readJsonStorage, writeJsonStorage } from "../utils/storage.js";

const STORAGE_KEY = "bspaceA11yPreferences";
const CHANGE_EVENT = "bspace:a11y-change";

export const FONT_SCALES = [0.9, 1, 1.125, 1.25, 1.375, 1.5];

export const DEFAULT_PREFERENCES = {
    fontScale: 1,
    highContrast: false,
    reduceMotion: false,
    underlineLinks: false,
    textSpacing: false
};

export function getPreferences() {
    const stored = readJsonStorage(STORAGE_KEY, {});
    const preferences = { ...DEFAULT_PREFERENCES };

    Object.keys(DEFAULT_PREFERENCES).forEach((key) => {
        if (typeof stored?.[key] === typeof DEFAULT_PREFERENCES[key]) {
            preferences[key] = stored[key];
        }
    });

    if (!FONT_SCALES.includes(preferences.fontScale)) {
        preferences.fontScale = DEFAULT_PREFERENCES.fontScale;
    }

    return preferences;
}

export function updatePreferences(changes) {
    const preferences = { ...getPreferences(), ...changes };

    writeJsonStorage(STORAGE_KEY, preferences);
    applyPreferences(preferences);
    window.dispatchEvent(new window.CustomEvent(CHANGE_EVENT, { detail: preferences }));

    return preferences;
}

export function resetPreferences() {
    return updatePreferences({ ...DEFAULT_PREFERENCES });
}

export function stepFontScale(direction) {
    const { fontScale } = getPreferences();
    const index = FONT_SCALES.indexOf(fontScale);
    const nextIndex = Math.min(Math.max(index + direction, 0), FONT_SCALES.length - 1);

    return updatePreferences({ fontScale: FONT_SCALES[nextIndex] });
}

export function applyPreferences(preferences = getPreferences()) {
    const root = document.documentElement;

    root.style.fontSize = preferences.fontScale === 1 ? "" : `${preferences.fontScale * 100}%`;
    toggleRootFlag("contrast", "high", preferences.highContrast);
    toggleRootFlag("motion", "reduced", preferences.reduceMotion);
    toggleRootFlag("links", "underline", preferences.underlineLinks);
    toggleRootFlag("spacing", "wide", preferences.textSpacing);
}

export function prefersReducedMotion() {
    return getPreferences().reduceMotion || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
}

export function onPreferencesChange(callback) {
    const handler = (event) => callback(event.detail);
    window.addEventListener(CHANGE_EVENT, handler);
    return () => window.removeEventListener(CHANGE_EVENT, handler);
}

function toggleRootFlag(name, value, isActive) {
    if (isActive) {
        document.documentElement.dataset[name] = value;
    } else {
        delete document.documentElement.dataset[name];
    }
}
