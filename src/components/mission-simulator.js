import { MISSION_TYPES } from "../data/mission-types.js";
import { getPlanetBySlug, getPlanets } from "../services/planet-service.js";
import { byId, createOption, setText } from "../utils/dom.js";

export function setupMissionSimulator({ targetId, typeId, buttonId, outputId, onSimulate }) {
    const target = byId(targetId);
    const type = byId(typeId);
    const button = byId(buttonId);

    if (!target || !type || !button) {
        return;
    }

    target.innerHTML = "";
    type.innerHTML = "";

    getPlanets().forEach((planet) => {
        target.appendChild(createOption(planet.slug, planet.nome));
    });

    Object.entries(MISSION_TYPES).forEach(([slug, missionType]) => {
        type.appendChild(createOption(slug, missionType.rotulo));
    });

    target.value = "marte";

    button.addEventListener("click", () => {
        const planet = getPlanetBySlug(target.value);
        const missionType = MISSION_TYPES[type.value];

        if (!planet || !missionType) {
            return;
        }

        const duration = Math.max(2, Math.round((planet.distancia / 120) * missionType.complexidade));
        setText(outputId, `Missão para ${planet.nome}: duração estimada de ${duration} meses e risco ${missionType.risco}.`);
        onSimulate?.({ planet, missionType, duration });
    });
}
