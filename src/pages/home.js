import { DASHBOARD_HIGHLIGHTS, MISSION_RECOMMENDATIONS, WEEKLY_EVENTS } from "../data/dashboard.js";
import { GUIDED_DEMO_STEPS, INVESTOR_POINTS, PRODUCT_DIFFERENTIALS, PRODUCT_METRICS } from "../data/product-demo.js";
import { getPlanets } from "../services/planet-service.js";
import { getExplorationStats, getLastVisitedPlanet, getNextRecommendedPlanet } from "../services/exploration-progress-service.js";
import { getQuizSummary } from "../services/quiz-engine.js";
import { setupSolarSelector } from "../components/solar-selector.js";
import { renderGuidedDemoSteps, setupProductTour } from "../components/product-tour.js";
import { formatNumber } from "../utils/format.js";
import { byId, createTextElement, setText } from "../utils/dom.js";

export function initPage() {
    setupSolarSelector({
        containerId: "solarPlanetButtons",
        outputId: "solarPlanetInfo",
        defaultSlug: "terra"
    });

    renderProductMetrics();
    renderProductDifferentials();
    renderGuidedDemoSteps("guidedDemoSteps", GUIDED_DEMO_STEPS);
    renderInvestorPoints();
    setupProductTour(GUIDED_DEMO_STEPS);
    renderLastVisitedPlanet();
    renderMissionRecommendation();
    renderAstronomyEvent();
    renderHighlights();
    renderProgress();
    renderHeroStats();
}

function renderProductMetrics() {
    const container = byId("productMetrics");

    if (!container) {
        return;
    }

    container.innerHTML = "";
    PRODUCT_METRICS.forEach((metric) => {
        const card = document.createElement("article");
        const value = createTextElement("strong", metric.value);
        const label = createTextElement("span", metric.label);
        const detail = createTextElement("p", metric.detail);

        card.className = "product-metric";
        card.append(value, label, detail);
        container.appendChild(card);
    });
}

function renderProductDifferentials() {
    const container = byId("productDifferentials");

    if (!container) {
        return;
    }

    container.innerHTML = "";
    PRODUCT_DIFFERENTIALS.forEach((item) => {
        const card = document.createElement("article");
        const signal = createTextElement("span", item.signal, "differential-signal");
        const title = createTextElement("h3", item.title);
        const description = createTextElement("p", item.description);

        card.className = "differential-card";
        card.append(signal, title, description);
        container.appendChild(card);
    });
}

function renderInvestorPoints() {
    const container = byId("investorPoints");

    if (!container) {
        return;
    }

    container.innerHTML = "";
    INVESTOR_POINTS.forEach((item) => {
        const card = document.createElement("article");
        const title = createTextElement("h3", item.title);
        const description = createTextElement("p", item.description);

        card.className = "investor-point";
        card.append(title, description);
        container.appendChild(card);
    });
}

function renderLastVisitedPlanet() {
    const planet = getLastVisitedPlanet();

    if (!planet) {
        return;
    }

    setText("lastVisitedTitle", planet.nome);
    setText("lastVisitedSummary", planet.resumo);
    setText(
        "lastVisitedDetails",
        `${formatNumber(planet.diametro)} km de diâmetro · ${formatNumber(planet.luas)} ${planet.luas === 1 ? "lua" : "luas"}`
    );

    const continueLink = byId("continuePlanetLink");

    if (continueLink) {
        continueLink.href = `planeta.html?nome=${planet.slug}`;
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

    const eventList = byId("astronomyEvent");

    if (!eventList) {
        return;
    }

    const listElement = eventList.querySelector(".event-list");

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

function renderProgress() {
    const container = byId("progressList");

    if (!container) {
        return;
    }

    const stats = getProgressItems();

    container.innerHTML = "";
    stats.forEach((item) => {
        const progressPercentage = Math.round(item.progress * 100);
        const wrapper = document.createElement("div");
        const heading = document.createElement("div");
        const bar = document.createElement("div");
        const fill = document.createElement("span");
        const description = createTextElement("p", item.description, "progress-description");

        wrapper.className = "progress-item";
        heading.className = "progress-heading";
        heading.append(
            createTextElement("span", item.title),
            createTextElement("strong", item.label)
        );

        bar.className = "progress-bar";
        bar.setAttribute("role", "progressbar");
        bar.setAttribute("aria-label", item.title);
        bar.setAttribute("aria-valuenow", String(progressPercentage));
        bar.setAttribute("aria-valuemin", "0");
        bar.setAttribute("aria-valuemax", "100");

        fill.className = "progress-fill";
        fill.style.width = `${progressPercentage}%`;
        bar.appendChild(fill);

        wrapper.append(heading, bar, description);
        container.appendChild(wrapper);
    });
}

function renderHeroStats() {
    const stats = getExplorationStats();

    setText("heroPlanetsStat", formatNumber(getPlanets().length));
    setText("heroVisitedStat", formatNumber(stats.visitedPlanets));
    setText("heroMissionStat", formatNumber(stats.missionSimulations));
}

function getProgressItems() {
    const stats = getExplorationStats();
    const totalPlanets = stats.totalPlanets || getPlanets().length;
    const quizSummary = getQuizSummary();
    const missionTarget = 5;

    return [
        {
            title: "Planetas visitados",
            label: `${stats.visitedPlanets} de ${totalPlanets}`,
            description: "Mundos já abertos na página de detalhes.",
            progress: clampProgress(stats.visitedPlanets / totalPlanets)
        },
        {
            title: "Missões simuladas",
            label: `${stats.missionSimulations} de ${missionTarget}`,
            description: "Simulações feitas no painel de missões.",
            progress: clampProgress(stats.missionSimulations / missionTarget)
        },
        {
            title: "Cosmic Quiz",
            label: `${quizSummary.masteredQuestions} de ${quizSummary.totalQuestions}`,
            description: `Nível ${quizSummary.level}: ${quizSummary.levelProgress.currentLevel.titulo}.`,
            progress: clampProgress(quizSummary.questionProgress)
        }
    ];
}

function getWeeklyEvent() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekIndex = Math.floor((now - startOfYear) / (7 * 24 * 60 * 60 * 1000));
    return WEEKLY_EVENTS[weekIndex % WEEKLY_EVENTS.length];
}

function clampProgress(value) {
    return Math.min(Math.max(value, 0), 1);
}
