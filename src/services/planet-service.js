import { PLANET_ORDER, PLANETS } from "../data/planets.js";

const planetsBySlug = new Map(PLANETS.map((planet) => [planet.slug, planet]));

export function getPlanets() {
    return PLANETS;
}

export function getPlanetBySlug(slug) {
    return planetsBySlug.get(slug);
}

export function getPlanetFromURL(search = window.location.search) {
    const params = new URLSearchParams(search);
    return getPlanetBySlug(params.get("nome"));
}

export function getPlanetNavigation(slug) {
    const index = PLANET_ORDER.indexOf(slug);

    if (index === -1) {
        return {
            anterior: "planetas.html",
            proximo: "planetas.html"
        };
    }

    const previousSlug = PLANET_ORDER[index - 1];
    const nextSlug = PLANET_ORDER[index + 1];

    return {
        anterior: previousSlug ? `planeta.html?nome=${previousSlug}` : "planetas.html",
        proximo: nextSlug ? `planeta.html?nome=${nextSlug}` : "planetas.html"
    };
}

export function getMaxPlanetDistance() {
    return Math.max(...PLANETS.map((planet) => planet.distancia));
}
