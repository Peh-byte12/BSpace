import { getPlanetBySlug, getPlanets } from "../services/planet-service.js";
import { formatNumber } from "../utils/format.js";
import { byId, setText } from "../utils/dom.js";
import { playTone } from "../services/audio-service.js";
import { setLastVisitedPlanet } from "../services/exploration-progress-service.js";

export function setupSolarSelector({ containerId, outputId, defaultSlug = "terra" }) {
    const container = byId(containerId);
    const output = byId(outputId);

    if (!container || !output) {
        return;
    }

    container.innerHTML = "";

    getPlanets().forEach((planet) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = planet.nome;
        button.dataset.planet = planet.slug;
        button.setAttribute("aria-pressed", "false");
        button.addEventListener("click", () => {
            selectPlanet(planet.slug, containerId, outputId, {
                includeDistance: true,
                fromUser: true
            });
        });
        container.appendChild(button);
    });

    selectPlanet(defaultSlug, containerId, outputId, {
        includeDistance: false,
        fromUser: false
    });
}

function selectPlanet(slug, containerId, outputId, options = {}) {
    const planet = getPlanetBySlug(slug);

    if (!planet) {
        return;
    }

    document.querySelectorAll(`#${containerId} button`).forEach((button) => {
        const isActive = button.dataset.planet === slug;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });

    document.querySelectorAll("[data-orbit]").forEach((orbit) => {
        orbit.classList.toggle("is-active", orbit.dataset.orbit === slug);
    });

    const distanceText = options.includeDistance ? ` Distância média do Sol: ${formatNumber(planet.distancia)} milhões de km.` : "";
    setText(outputId, `${planet.nome}: ${planet.resumo}${distanceText}`);

    if (options.fromUser) {
        playTone(440);
        setLastVisitedPlanet(slug);
    }
}
