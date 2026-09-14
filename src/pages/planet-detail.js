import { getPlanetFromURL, getPlanetNavigation } from "../services/planet-service.js";
import { markPlanetVisited } from "../services/exploration-progress-service.js";
import { createFavoriteToggle } from "../components/favorite-toggle.js";
import { byId, createTextElement, setText } from "../utils/dom.js";

export function initPage() {
    const planet = getPlanetFromURL();
    const layout = byId("planetLayout");
    const error = byId("planetError");

    if (!layout || !error) {
        return;
    }

    if (!planet) {
        renderNotFound(layout, error);
        return;
    }

    renderPlanetDetail(planet);
    markPlanetVisited(planet.slug);
}

function renderNotFound(layout, error) {
    const requestedName = new URLSearchParams(window.location.search).get("nome")?.trim();

    layout.hidden = true;
    error.hidden = false;
    document.title = "Planeta não encontrado | BSpace";
    setText("planetName", "Planeta não encontrado");
    setText("planetDescription", "Não foi possível abrir a página pedida.");
    setText(
        "planetErrorMessage",
        requestedName
            ? `Não existe um planeta chamado "${requestedName}" no BSpace. Confira o endereço ou escolha um dos oito planetas na lista.`
            : "Nenhum planeta foi informado no endereço. Escolha um dos oito planetas na lista."
    );
}

function renderPlanetDetail(planet) {
    document.title = `${planet.nome} | BSpace`;
    byId("planetName").textContent = planet.nome;
    byId("planetDescription").textContent = planet.descricao;
    byId("planetSummary").textContent = planet.descricao;

    const image = byId("planetImage");
    image.src = planet.imagem;
    image.alt = `Planeta ${planet.nome} visto do espaço`;
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

    const actions = byId("planetActions");

    if (actions) {
        actions.innerHTML = "";
        actions.appendChild(createFavoriteToggle({ type: "planeta", id: planet.slug, name: planet.nome }));
    }

    const navigation = getPlanetNavigation(planet.slug);
    byId("linkAnterior").href = navigation.anterior;
    byId("linkProximo").href = navigation.proximo;
}
