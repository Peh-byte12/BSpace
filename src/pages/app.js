import { enhancePageContent, initSiteShell } from "../components/site-shell.js";

const pageModules = {
    home: () => import("./home.js"),
    calendar: () => import("./calendar.js"),
    planets: () => import("./planets.js"),
    curiosities: () => import("./curiosities.js"),
    missions: () => import("./missions.js"),
    planet: () => import("./planet-detail.js")
};

async function startApp() {
    initSiteShell();

    const loadPage = pageModules[document.body.dataset.page];

    if (loadPage) {
        try {
            const module = await loadPage();
            module.initPage?.();
        } catch (error) {
            console.error("Não foi possível inicializar a página:", error);
        }
    }

    enhancePageContent();
}

// Não espera o DOMContentLoaded: em planeta.html ele só dispara depois que o Three.js chega do CDN.
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startApp, { once: true });
} else {
    startApp();
}
