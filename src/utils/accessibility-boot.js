// Aplica as preferências antes da primeira pintura para evitar o "salto" de fonte e contraste.
(function () {
    try {
        var preferences = JSON.parse(window.localStorage.getItem("bspaceA11yPreferences") || "{}");
        var root = document.documentElement;
        var scales = [0.9, 1, 1.125, 1.25, 1.375, 1.5];

        if (scales.indexOf(preferences.fontScale) >= 0 && preferences.fontScale !== 1) {
            root.style.fontSize = preferences.fontScale * 100 + "%";
        }

        if (preferences.highContrast === true) {
            root.setAttribute("data-contrast", "high");
        }

        if (preferences.reduceMotion === true) {
            root.setAttribute("data-motion", "reduced");
        }

        if (preferences.underlineLinks === true) {
            root.setAttribute("data-links", "underline");
        }

        if (preferences.textSpacing === true) {
            root.setAttribute("data-spacing", "wide");
        }
    } catch (error) {
        // Sem armazenamento disponível: o site segue com as configurações padrão.
    }
})();
