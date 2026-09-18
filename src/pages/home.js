import { DASHBOARD_HIGHLIGHTS, MISSION_RECOMMENDATIONS, WEEKLY_EVENTS } from "../data/dashboard.js";
import {
    getLastVisitedPlanet,
    getNextRecommendedPlanet,
    getUserStats,
    hasAnyActivity,
    onUserStatsChange,
    resetUserStats
} from "../services/exploration-progress-service.js";
import { setupSolarSelector } from "../components/solar-selector.js";
import { announce } from "../utils/announce.js";
import { formatNumber } from "../utils/format.js";
import { byId, createTextElement, setText } from "../utils/dom.js";

const PROGRESS_METRICS = [
    { key: "planetsExplored", title: "Planetas explorados", totalKey: "planets", description: "Planetas diferentes abertos na página de detalhes." },
    { key: "eventsViewed", title: "Eventos visualizados", description: "Eventos diferentes abertos no calendário astronômico." },
    { key: "missionsViewed", title: "Missões históricas exploradas", totalKey: "missions", description: "Missões escolhidas na página de missões." },
    { key: "curiositiesDiscovered", title: "Curiosidades descobertas", totalKey: "curiosities", description: "Curiosidades diferentes reveladas na página de curiosidades." },
    { key: "missionSimulations", title: "Missões simuladas", totalKey: "missionSimulations", description: "Combinações diferentes de destino e tipo de missão testadas." },
    { key: "searches", title: "Pesquisas realizadas", description: "Buscas concluídas nas páginas de planetas e calendário." },
    { key: "favorites", title: "Favoritos", description: "Planetas e eventos marcados como favoritos." }
];

export function initPage() {
    setupSolarSelector({
        containerId: "solarPlanetButtons",
        outputId: "solarPlanetInfo",
        defaultSlug: "terra"
    });

    renderAstronomyEvent();
    renderHighlights();
    renderUserDashboard();
    setupResetButton();
    onUserStatsChange(renderUserDashboard);
}

function renderUserDashboard() {
    const stats = getUserStats();

    renderLastVisitedPlanet();
    renderMissionRecommendation();
    renderHeroStats(stats);
    renderProgress(stats);
}

function renderLastVisitedPlanet() {
    const planet = getLastVisitedPlanet();
    const continueLink = byId("continuePlanetLink");
    const details = byId("lastVisitedDetails");

    if (!planet) {
        setText("lastVisitedTitle", "Nenhum planeta visitado ainda");
        setText("lastVisitedSummary", "Abra a página de um planeta para guardar aqui o seu ponto de partida.");

        if (details) {
            details.textContent = "";
            details.hidden = true;
        }

        if (continueLink) {
            continueLink.href = "planetas.html";
            continueLink.textContent = "Explorar planetas";
        }

        return;
    }

    setText("lastVisitedTitle", planet.nome);
    setText("lastVisitedSummary", planet.resumo);

    if (details) {
        details.hidden = false;
        details.textContent = `${formatNumber(planet.diametro)} km de diâmetro · ${formatNumber(planet.luas)} ${planet.luas === 1 ? "lua" : "luas"}`;
    }

    if (continueLink) {
        continueLink.href = `planeta.html?nome=${planet.slug}`;
        continueLink.textContent = `Continuar em ${planet.nome}`;
    }
}

function renderMissionRecommendation() {
    const planet = getNextRecommendedPlanet();
    const recommendation = MISSION_RECOMMENDATIONS[planet.slug] || MISSION_RECOMMENDATIONS.marte;

    setText("missionTitle", recommendation.title);
    setText("missionDescription", recommendation.description);
    setText("missionType", recommendation.type);
    setText("missionLevel", recommendation.level);

    const link = byId("missionLink");

    if (link) {
        link.href = recommendation.href;
    }
}

function renderAstronomyEvent() {
    const event = getWeeklyEvent();

    setText("eventTitle", event.title);
    setText("eventDescription", event.description);

    const listElement = byId("astronomyEvent")?.querySelector(".event-list");

    if (!listElement) {
        return;
    }

    listElement.innerHTML = "";
    event.items.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.append(
            createTextElement("strong", item.label),
            document.createTextNode(` ${item.value}`)
        );
        listElement.appendChild(listItem);
    });
}

function renderHighlights() {
    const container = byId("highlightGrid");

    if (!container) {
        return;
    }

    container.innerHTML = "";
    DASHBOARD_HIGHLIGHTS.forEach((highlight) => {
        const card = document.createElement("article");
        const link = document.createElement("a");
        const title = createTextElement("strong", highlight.title);
        const description = createTextElement("p", highlight.description);

        card.className = "highlight-card";
        link.href = highlight.href;
        link.append(title, description);
        card.appendChild(link);
        container.appendChild(card);
    });
}

function renderHeroStats(stats) {
    setText("statPlanetsExplored", formatNumber(stats.planetsExplored));
    setText("statEventsViewed", formatNumber(stats.eventsViewed));
    setText("statFavorites", formatNumber(stats.favorites));
}

function renderProgress(stats) {
    const container = byId("progressList");

    if (!container) {
        return;
    }

    container.innerHTML = "";
    PROGRESS_METRICS.forEach((metric) => {
        const value = stats[metric.key];
        const total = metric.totalKey ? stats.totals[metric.totalKey] : null;
        const item = document.createElement("li");
        const heading = document.createElement("div");
        const valueText = total ? `${formatNumber(value)} de ${formatNumber(total)}` : formatNumber(value);

        item.className = "progress-item";
        heading.className = "progress-heading";
        heading.append(createTextElement("span", metric.title), createTextElement("strong", valueText));
        item.appendChild(heading);

        if (total) {
            item.appendChild(createProgressBar(metric.title, value, total));
        }

        item.appendChild(createTextElement("p", metric.description, "progress-description"));
        container.appendChild(item);
    });

    renderProgressNote(stats);
}

function createProgressBar(title, value, total) {
    const bar = document.createElement("div");
    const fill = document.createElement("span");
    const percentage = Math.round(Math.min(Math.max(value / total, 0), 1) * 100);

    bar.className = "progress-bar";
    bar.setAttribute("role", "progressbar");
    bar.setAttribute("aria-label", title);
    bar.setAttribute("aria-valuemin", "0");
    bar.setAttribute("aria-valuemax", String(total));
    bar.setAttribute("aria-valuenow", String(value));
    bar.setAttribute("aria-valuetext", `${value} de ${total}`);

    fill.className = "progress-fill";
    bar.appendChild(fill);

    // A barra só recebe o valor depois da primeira pintura para que a transição de preenchimento aconteça.
    window.requestAnimationFrame(() => {
        fill.style.transform = `scaleX(${percentage / 100})`;
    });

    return bar;
}

function renderProgressNote(stats) {
    const note = byId("progressNote");

    if (!note) {
        return;
    }

    if (!stats.persistent) {
        note.textContent = "O navegador bloqueou o armazenamento local: os números valem apenas enquanto esta página estiver aberta.";
        return;
    }

    note.textContent = hasAnyActivity(stats)
        ? "Os dados ficam salvos apenas neste navegador, sem necessidade de login."
        : "Nenhuma atividade registrada ainda. Todas as estatísticas começam em zero e crescem conforme você explora o site.";
}

function setupResetButton() {
    const button = byId("resetStatsButton");

    if (!button) {
        return;
    }

    button.addEventListener("click", () => {
        if (!window.confirm("Zerar todas as suas estatísticas e favoritos deste navegador? Essa ação não pode ser desfeita.")) {
            return;
        }

        resetUserStats();
        announce("Estatísticas zeradas.");
    });
}

function getWeeklyEvent() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekIndex = Math.floor((now - startOfYear) / (7 * 24 * 60 * 60 * 1000));
    return WEEKLY_EVENTS[weekIndex % WEEKLY_EVENTS.length];
}
