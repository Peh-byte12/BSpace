import { getMaxPlanetDistance, getPlanetBySlug, getPlanets } from "../services/planet-service.js";
import { playTone } from "../services/audio-service.js";
import { byId, createOption, setText } from "../utils/dom.js";
import { formatTime } from "../utils/format.js";

export function setupLightSimulator({ selectId, meterId, outputId }) {
    const select = byId(selectId);

    if (!select) {
        return;
    }

    select.innerHTML = "";
    getPlanets().forEach((planet) => {
        select.appendChild(createOption(planet.slug, planet.nome));
    });

    select.value = "terra";
    select.addEventListener("change", () => renderLightSimulation(selectId, meterId, outputId, { shouldPlaySound: true }));
    renderLightSimulation(selectId, meterId, outputId);
}

function renderLightSimulation(selectId, meterId, outputId, options = {}) {
    const select = byId(selectId);
    const meter = byId(meterId);

    if (!select || !meter) {
        return;
    }

    const planet = getPlanetBySlug(select.value);

    if (!planet) {
        return;
    }

    const minutes = planet.distancia / 17.987;
    const ratio = Math.max(0.04, planet.distancia / getMaxPlanetDistance());

    meter.style.transform = `scaleX(${ratio})`;
    setText(outputId, `A luz do Sol leva aproximadamente ${formatTime(minutes)} para chegar até ${planet.nome}.`);

    if (options.shouldPlaySound) {
        playTone(520);
    }
}
