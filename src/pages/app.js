import { initSiteShell } from "../components/site-shell.js";

const pageModules = {
    home: () => import("./home.js"),
    academy: () => import("./academy.js"),
    calendar: () => import("./calendar.js"),
    planets: () => import("./planets.js"),
    curiosities: () => import("./curiosities.js"),
    missions: () => import("./missions.js"),
    planet: () => import("./planet-detail.js")
};

document.addEventListener("DOMContentLoaded", async () => {
    const page = document.body.dataset.page;
    const loadPage = pageModules[page];

    if (!loadPage) {
        initSiteShell();
        return;
    }

    try {
        const module = await loadPage();
        module.initPage?.();
    } catch (error) {
        console.error("Não foi possível inicializar a página:", error);
    } finally {
        initSiteShell();
    }
});
