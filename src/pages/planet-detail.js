import { getPlanetFromURL, getPlanetNavigation } from "../services/planet-service.js";
import { markPlanetVisited } from "../services/exploration-progress-service.js";
import { byId, createTextElement } from "../utils/dom.js";

export function initPage() {
    const planet = getPlanetFromURL();
    const layout = byId("planetLayout");
    const error = byId("planetError");

    if (!layout || !error) {
        return;
    }

    if (!planet) {
        layout.hidden = true;
        error.hidden = false;
        document.title = "Planeta não encontrado";
        return;
    }

    renderPlanetDetail(planet);
    markPlanetVisited(planet.slug);
}

function renderPlanetDetail(planet) {
    document.title = planet.nome;
    byId("planetName").textContent = planet.nome;
    byId("planetDescription").textContent = planet.descricao;
    byId("planetSummary").textContent = planet.descricao;

    const image = byId("planetImage");
    image.src = planet.imagem;
    image.alt = `Imagem de ${planet.nome}`;
    image.loading = "lazy";
    image.decoding = "async";

    const factsContainer = byId("planetFacts");
    factsContainer.innerHTML = "";

    planet.fatos.forEach((fact) => {
        const card = document.createElement("div");
        card.className = "fact";
        card.append(
            createTextElement("strong", fact.titulo),
            createTextElement("span", fact.valor)
        );
        factsContainer.appendChild(card);
    });

    const navigation = getPlanetNavigation(planet.slug);
    byId("linkAnterior").href = navigation.anterior;
    byId("linkProximo").href = navigation.proximo;
}
