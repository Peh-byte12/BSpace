import { getPlanetBySlug, getPlanets } from "../services/planet-service.js";
import { formatNumber } from "../utils/format.js";
import { byId, setText } from "../utils/dom.js";
import { playTone } from "../services/audio-service.js";

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
        button.addEventListener("click", () => {
            selectPlanet(planet.slug, containerId, outputId, {
                includeDistance: true,
                shouldPlaySound: true
            });
        });
        container.appendChild(button);
    });

    selectPlanet(defaultSlug, containerId, outputId, {
        includeDistance: false,
        shouldPlaySound: false
    });
}

function selectPlanet(slug, containerId, outputId, options = {}) {
    const planet = getPlanetBySlug(slug);

    if (!planet) {
        return;
    }

    document.querySelectorAll(`#${containerId} button`).forEach((button) => {
        button.classList.toggle("is-active", button.dataset.planet === slug);
    });

    const distanceText = options.includeDistance ? ` Distância média do Sol: ${formatNumber(planet.distancia)} milhões de km.` : "";
    setText(outputId, `${planet.nome}: ${planet.resumo}${distanceText}`);

    if (options.shouldPlaySound) {
        playTone(440);
    }

    if (window?.localStorage) {
        window.localStorage.setItem("bspaceLastPlanet", slug);
    }
}
