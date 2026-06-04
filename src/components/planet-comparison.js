import { getPlanetBySlug, getPlanets } from "../services/planet-service.js";
import { createOption, createTextElement, byId, setText } from "../utils/dom.js";
import { formatNumber } from "../utils/format.js";

export function setupPlanetComparison({ selectAId, selectBId, tableId, insightId }) {
    const selectA = byId(selectAId);
    const selectB = byId(selectBId);

    if (!selectA || !selectB) {
        return;
    }

    selectA.innerHTML = "";
    selectB.innerHTML = "";

    getPlanets().forEach((planet) => {
        selectA.appendChild(createOption(planet.slug, planet.nome));
        selectB.appendChild(createOption(planet.slug, planet.nome));
    });

    selectA.value = "terra";
    selectB.value = "jupiter";
    selectA.addEventListener("change", () => renderComparison(selectAId, selectBId, tableId, insightId));
    selectB.addEventListener("change", () => renderComparison(selectAId, selectBId, tableId, insightId));
    renderComparison(selectAId, selectBId, tableId, insightId);
}

function renderComparison(selectAId, selectBId, tableId, insightId) {
    const table = byId(tableId);
    const selectA = byId(selectAId);
    const selectB = byId(selectBId);

    if (!table || !selectA || !selectB) {
        return;
    }

    const planetA = getPlanetBySlug(selectA.value);
    const planetB = getPlanetBySlug(selectB.value);

    if (!planetA || !planetB) {
        return;
    }

    const rows = [
        ["Tipo", planetA.tipo, planetB.tipo],
        ["Diâmetro", `${formatNumber(planetA.diametro)} km`, `${formatNumber(planetB.diametro)} km`],
        ["Distância", `${formatNumber(planetA.distancia)} mi km`, `${formatNumber(planetB.distancia)} mi km`],
        ["Gravidade", `${planetA.gravidade} m/s²`, `${planetB.gravidade} m/s²`],
        ["Luas", formatNumber(planetA.luas), formatNumber(planetB.luas)]
    ];

    table.innerHTML = "";
    rows.forEach(([metric, valueA, valueB]) => {
        const row = document.createElement("div");
        row.className = "comparison-row";
        row.append(
            createTextElement("span", metric),
            createTextElement("strong", valueA),
            createTextElement("strong", valueB)
        );
        table.appendChild(row);
    });

    const bigger = planetA.diametro > planetB.diametro ? planetA : planetB;
    const smaller = bigger === planetA ? planetB : planetA;
    const ratio = Math.max(1, Math.round(bigger.diametro / smaller.diametro));
    setText(insightId, `${bigger.nome} tem cerca de ${ratio} vez(es) o diâmetro de ${smaller.nome}.`);
}
