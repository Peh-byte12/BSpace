import { getAstronomyEventStats, getAstronomyEventTypes, loadAstronomyEvents } from "../services/astronomy-event-service.js";
import { createTextElement } from "../utils/dom.js";
import { formatNumber } from "../utils/format.js";

const EVENT_TYPE_CLASS = {
    eclipse: "is-eclipse",
    lua: "is-moon",
    meteoros: "is-meteor",
    conjuncao: "is-conjunction"
};

export function setupAstronomyCalendar({
    searchInput,
    typeFilters,
    statsPanel,
    eventsGrid,
    detailsPanel,
    emptyState
}) {
    if (!searchInput || !typeFilters || !statsPanel || !eventsGrid || !detailsPanel) {
        return;
    }

    const state = {
        type: "todos",
        search: "",
        selectedEventId: ""
    };

    let debounceTimer = null;

    renderTypeFilters();
    bindSearch();
    render();

    function renderTypeFilters() {
        typeFilters.innerHTML = "";

        getAstronomyEventTypes().forEach((type) => {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = type.label;
            button.className = "calendar-filter";
            button.classList.toggle("is-active", state.type === type.id);
            button.setAttribute("aria-pressed", String(state.type === type.id));
            button.title = type.description;
            button.addEventListener("click", () => {
                state.type = type.id;
                state.selectedEventId = "";
                renderTypeFilters();
                render();
            });
            typeFilters.appendChild(button);
        });
    }

    function bindSearch() {
        searchInput.addEventListener("input", () => {
            window.clearTimeout(debounceTimer);
            debounceTimer = window.setTimeout(() => {
                state.search = searchInput.value;
                state.selectedEventId = "";
                render();
            }, 140);
        });
    }

    async function render() {
        const events = await loadAstronomyEvents({
            filters: {
                type: state.type,
                search: state.search
            }
        });
        const selectedEvent = events.find((event) => event.id === state.selectedEventId) || events[0] || null;

        state.selectedEventId = selectedEvent?.id || "";
        renderStats(events);
        renderCards(events);
        renderDetails(selectedEvent);

        if (emptyState) {
            emptyState.hidden = events.length > 0;
        }
    }

    function renderStats(events) {
        const stats = getAstronomyEventStats(events);
        const nextEventText = stats.nextEvent
            ? `${stats.nextEvent.title} · ${formatEventDate(stats.nextEvent.dateObject)}`
            : "Nenhum evento encontrado";

        statsPanel.innerHTML = "";
        statsPanel.append(
            createStat("Eventos", formatNumber(stats.total)),
            createStat("Próximo destaque", nextEventText),
            createStat("Tipos ativos", `${stats.countsByType.filter((item) => item.total > 0).length}/4`)
        );
    }

    function createStat(label, value) {
        const stat = document.createElement("div");
        stat.className = "calendar-stat";
        stat.append(createTextElement("span", label), createTextElement("strong", value));
        return stat;
    }

    function renderCards(events) {
        eventsGrid.innerHTML = "";

        events.forEach((event) => {
            const card = document.createElement("button");
            const date = document.createElement("time");
            const meta = createTextElement("span", `${event.typeLabel} · ${event.time}`, "calendar-card-meta");
            const title = createTextElement("strong", event.title);
            const summary = createTextElement("span", event.summary);

            card.type = "button";
            card.className = `calendar-card ${EVENT_TYPE_CLASS[event.type] || ""}`;
            card.classList.toggle("is-active", event.id === state.selectedEventId);
            card.setAttribute("aria-pressed", String(event.id === state.selectedEventId));
            card.addEventListener("click", () => {
                state.selectedEventId = event.id;
                renderCards(events);
                renderDetails(event);
            });

            date.dateTime = event.date;
            date.textContent = formatEventDate(event.dateObject);
            card.append(date, meta, title, summary);
            eventsGrid.appendChild(card);
        });
    }

    function renderDetails(event) {
        detailsPanel.innerHTML = "";

        if (!event) {
            detailsPanel.append(
                createTextElement("span", "Detalhes", "section-kicker"),
                createTextElement("h2", "Nenhum evento selecionado"),
                createTextElement("p", "Ajuste a busca ou remova filtros para ver eventos astronômicos.")
            );
            return;
        }

        const header = document.createElement("div");
        const facts = document.createElement("dl");
        const detailList = createList(event.details);
        const tipList = createList(event.tips);

        header.className = "calendar-detail-header";
        header.append(
            createTextElement("span", event.typeLabel, "section-kicker"),
            createTextElement("h2", event.title),
            createTextElement("p", event.summary)
        );

        facts.className = "calendar-detail-facts";
        [
            ["Data", formatEventDate(event.dateObject)],
            ["Horário", event.time],
            ["Visibilidade", event.visibility],
            ["Região", event.location]
        ].forEach(([label, value]) => {
            const item = document.createElement("div");
            item.append(createTextElement("dt", label), createTextElement("dd", value));
            facts.appendChild(item);
        });

        detailsPanel.append(header, facts);

        if (detailList) {
            detailsPanel.append(createSection("O que acontece", detailList));
        }

        if (tipList) {
            detailsPanel.append(createSection("Como observar", tipList));
        }

        if (event.source?.url) {
            const source = document.createElement("a");
            source.href = event.source.url;
            source.target = "_blank";
            source.rel = "noreferrer";
            source.className = "calendar-source";
            source.textContent = `Fonte: ${event.source.name}`;
            detailsPanel.appendChild(source);
        }
    }

    function createSection(title, content) {
        const section = document.createElement("section");
        section.className = "calendar-detail-section";
        section.append(createTextElement("h3", title), content);
        return section;
    }

    function createList(items) {
        if (!items.length) {
            return null;
        }

        const list = document.createElement("ul");
        items.forEach((item) => {
            list.appendChild(createTextElement("li", item));
        });
        return list;
    }
}

function formatEventDate(date) {
    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(date);
}
