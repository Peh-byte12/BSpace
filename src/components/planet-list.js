import { getPlanets } from "../services/planet-service.js";
import { createSearchRecorder } from "../services/exploration-progress-service.js";
import { byId } from "../utils/dom.js";
import { normalizeText } from "../utils/format.js";

const STATUS_DELAY = 400;

export function setupPlanetCatalog({ gridId, searchId, statusId }) {
    renderPlanetCards(gridId);
    setupPlanetSearch(searchId, statusId);
}

function renderPlanetCards(gridId) {
    const grid = byId(gridId);

    if (!grid) {
        return;
    }

    grid.innerHTML = "";

    getPlanets().forEach((planet) => {
        const card = document.createElement("article");
        const content = document.createElement("div");
        const title = document.createElement("h2");
        const icon = document.createElement("span");
        const titleText = document.createElement("span");
        const summary = document.createElement("p");
        const link = document.createElement("a");
        const linkContext = document.createElement("span");

        card.className = `planet-card card planet-${planet.slug}`;
        card.dataset.planetCard = "";
        card.dataset.search = planet.lista.busca;

        icon.className = "planet-icon";
        icon.setAttribute("aria-hidden", "true");
        titleText.textContent = planet.nome;

        title.append(icon, titleText);
        summary.textContent = planet.lista.resumo;
        content.append(title, summary);

        link.className = "grid-link";
        link.href = `planeta.html?nome=${planet.slug}`;
        linkContext.className = "visually-hidden";
        linkContext.textContent = ` de ${planet.nome}`;
        link.append(document.createTextNode("Abrir página"), linkContext);

        card.append(content, link);
        grid.appendChild(card);
    });
}

function setupPlanetSearch(searchId, statusId) {
    const searchField = byId(searchId);
    const status = byId(statusId);
    const cards = [...document.querySelectorAll("[data-planet-card]")];
    const recorder = createSearchRecorder("planetas");
    let statusTimer = null;

    if (!searchField || cards.length === 0) {
        return;
    }

    searchField.addEventListener("input", () => {
        const rawTerm = searchField.value.trim();
        const term = normalizeText(rawTerm);
        let visibleCards = 0;

        cards.forEach((card) => {
            const matches = term.length === 0 || normalizeText(card.dataset.search || card.textContent).includes(term);
            card.classList.toggle("is-hidden", !matches);
            visibleCards += matches ? 1 : 0;
        });

        window.clearTimeout(statusTimer);
        statusTimer = window.setTimeout(() => renderStatus(status, rawTerm, visibleCards), STATUS_DELAY);
        recorder.schedule(rawTerm);
    });

    searchField.addEventListener("change", () => recorder.flush(searchField.value));
}

function renderStatus(status, term, visibleCards) {
    if (!status) {
        return;
    }

    status.classList.toggle("is-empty", term.length > 0 && visibleCards === 0);

    if (term.length === 0) {
        status.textContent = "";
        return;
    }

    status.textContent = visibleCards === 0
        ? `Nenhum planeta encontrado para "${term}". Tente outro nome ou uma característica, como "gasoso" ou "rochoso".`
        : `${visibleCards} ${visibleCards === 1 ? "planeta encontrado" : "planetas encontrados"} para "${term}".`;
}
