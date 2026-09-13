import { getAstronomyEventStats, getAstronomyEventTypes, getRemoteSourceState, loadAstronomyEvents } from "../services/astronomy-event-service.js";
import { createTextElement } from "../utils/dom.js";
import { formatNumber } from "../utils/format.js";

const EVENT_TYPE_CLASS = {
    eclipse: "is-eclipse",
    lua: "is-moon",
    meteoros: "is-meteor",
    conjuncao: "is-conjunction",
    asteroide: "is-asteroid"
};

const SOURCE_MESSAGES = {
    loading: "Consultando eventos atualizados na API da NASA",
    live: "Asteroides atualizados pela API da NASA",
    cache: "Dados da NASA guardados neste navegador",
    offline: "API da NASA indisponível: exibindo apenas o calendário local"
};

const REFRESH_INTERVAL = 30 * 60 * 1000;

export function setupAstronomyCalendar({
    searchInput,
    typeFilters,
    statsPanel,
    eventsGrid,
    detailsPanel,
    emptyState,
    sourceState
}) {
    if (!searchInput || !typeFilters || !statsPanel || !eventsGrid || !detailsPanel) {
        return;
    }

    const state = {
        type: "todos",
        search: "",
        selectedEventId: "",
        userSelected: false
    };

    let debounceTimer = null;
    let renderToken = 0;

    renderTypeFilters();
    bindSearch();
    scheduleAutoRefresh();
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
                state.userSelected = false;
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
                state.userSelected = false;
                render();
            }, 140);
        });
    }

    function scheduleAutoRefresh() {
        window.setInterval(() => {
            render({ forceRefresh: true });
        }, REFRESH_INTERVAL);
    }

    async function render({ forceRefresh = false } = {}) {
        const token = ++renderToken;
        const filters = {
            type: state.type,
            search: state.search
        };

        paint(await loadAstronomyEvents({ filters, includeRemote: false }), token);

        if (token === renderToken) {
            showSourceMessage("loading");
        }

        paint(await loadAstronomyEvents({ filters, forceRefresh }), token);
    }

    function paint(events, token) {
        if (token !== renderToken) {
            return;
        }

        const chosenEvent = state.userSelected ? events.find((event) => event.id === state.selectedEventId) : null;
        const selectedEvent = chosenEvent || events[0] || null;

        state.selectedEventId = selectedEvent?.id || "";
        renderStats(events);
        renderCards(events);
        renderDetails(selectedEvent);
        renderSourceState();

        if (emptyState) {
            emptyState.hidden = events.length > 0;
        }
    }

    function renderSourceState() {
        const { status, updatedAt } = getRemoteSourceState();

        showSourceMessage(status, updatedAt);
    }

    function showSourceMessage(status, updatedAt = 0) {
        if (!sourceState) {
            return;
        }

        const message = SOURCE_MESSAGES[status];

        if (!message) {
            sourceState.textContent = "";
            sourceState.removeAttribute("data-state");
            return;
        }

        sourceState.dataset.state = status;
        sourceState.textContent = updatedAt > 0 ? `${message} · ${formatUpdatedAt(updatedAt)}` : message;
    }

    function renderStats(events) {
        const stats = getAstronomyEventStats(events);
        const activeTypes = stats.countsByType.filter((item) => item.total > 0).length;
        const nextEventText = stats.nextEvent
            ? `${stats.nextEvent.title} · ${formatEventDate(stats.nextEvent.dateObject)}`
            : "Nenhum evento encontrado";

        statsPanel.innerHTML = "";
        statsPanel.append(
            createStat("Eventos", formatNumber(stats.total)),
            createStat("Próximo destaque", nextEventText),
            createStat("Tipos ativos", `${activeTypes}/${stats.countsByType.length}`)
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
            card.classList.toggle("is-past", event.isPast);
            card.setAttribute("aria-pressed", String(event.id === state.selectedEventId));
            card.addEventListener("click", () => {
                state.selectedEventId = event.id;
                state.userSelected = true;
                renderCards(events);
                renderDetails(event);
            });

            date.dateTime = event.date;
            date.textContent = formatEventDate(event.dateObject);
            card.appendChild(date);

            if (event.isPast) {
                card.appendChild(createTextElement("span", "Já ocorreu", "calendar-card-status"));
            }

            card.append(meta, title, summary);
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

function formatUpdatedAt(timestamp) {
    const time = new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(timestamp));

    return `atualizado às ${time}`;
}
