import { getPlanets } from "../services/planet-service.js";
import { byId } from "../utils/dom.js";
import { normalizeText } from "../utils/format.js";

export function setupPlanetCatalog({ gridId, searchId }) {
    renderPlanetCards(gridId);
    setupPlanetSearch(searchId);
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
        link.textContent = "Abrir página";

        card.append(content, link);
        grid.appendChild(card);
    });
}

function setupPlanetSearch(searchId) {
    const searchField = byId(searchId);
    const cards = document.querySelectorAll("[data-planet-card]");

    if (!searchField || cards.length === 0) {
        return;
    }

    searchField.addEventListener("input", () => {
        const term = normalizeText(searchField.value);

        cards.forEach((card) => {
            const text = normalizeText(card.dataset.search || card.textContent);
            card.classList.toggle("is-hidden", term.length > 0 && !text.includes(term));
        });
    });
}
