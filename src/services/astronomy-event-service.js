import { ASTRONOMY_EVENTS, ASTRONOMY_EVENT_TYPES } from "../data/astronomy-events.js";
import { normalizeText } from "../utils/format.js";

const DEFAULT_FILTERS = {
    type: "todos",
    search: "",
    from: "",
    to: ""
};

export async function loadAstronomyEvents({
    filters = DEFAULT_FILTERS,
    provider = "local",
    endpoint = "",
    fetcher = globalThis.fetch
} = {}) {
    const events = await loadEventsFromProvider({ provider, endpoint, fetcher });
    return filterAstronomyEvents(events.map(normalizeAstronomyEvent), filters);
}

export function getAstronomyEventTypes() {
    return ASTRONOMY_EVENT_TYPES;
}

export function getAstronomyEventStats(events) {
    const total = events.length;
    const nextEvent = events.find((event) => !event.isPast) || events[0] || null;
    const countsByType = ASTRONOMY_EVENT_TYPES
        .filter((type) => type.id !== "todos")
        .map((type) => ({
            ...type,
            total: events.filter((event) => event.type === type.id).length
        }));

    return {
        total,
        nextEvent,
        countsByType
    };
}

export function filterAstronomyEvents(events, filters = DEFAULT_FILTERS) {
    const normalizedFilters = {
        ...DEFAULT_FILTERS,
        ...filters
    };
    const search = normalizeText(normalizedFilters.search.trim());
    const fromDate = normalizedFilters.from ? new Date(`${normalizedFilters.from}T00:00:00`) : null;
    const toDate = normalizedFilters.to ? new Date(`${normalizedFilters.to}T23:59:59`) : null;

    return events
        .filter((event) => normalizedFilters.type === "todos" || event.type === normalizedFilters.type)
        .filter((event) => {
            if (!search) {
                return true;
            }

            return normalizeText([
                event.title,
                event.summary,
                event.location,
                event.visibility,
                event.typeLabel,
                ...event.apiTags
            ].join(" ")).includes(search);
        })
        .filter((event) => !fromDate || event.dateObject >= fromDate)
        .filter((event) => !toDate || event.dateObject <= toDate)
        .sort((a, b) => a.dateObject - b.dateObject);
}

export function normalizeAstronomyEvent(event) {
    const dateObject = new Date(`${event.date}T00:00:00`);
    const type = ASTRONOMY_EVENT_TYPES.find((item) => item.id === event.type);

    return {
        id: event.id,
        type: event.type,
        typeLabel: type?.label || "Evento",
        title: event.title,
        date: event.date,
        dateObject,
        time: event.time || "Horário a confirmar",
        visibility: event.visibility || "Visibilidade a confirmar",
        location: event.location || "Localidade a confirmar",
        summary: event.summary || "",
        details: Array.isArray(event.details) ? event.details : [],
        tips: Array.isArray(event.tips) ? event.tips : [],
        source: event.source || null,
        apiTags: Array.isArray(event.apiTags) ? event.apiTags : [],
        isPast: dateObject < startOfToday()
    };
}

export function normalizeExternalAstronomyEvent(payload) {
    return normalizeAstronomyEvent({
        id: payload.id || `${payload.type}-${payload.date}-${normalizeText(payload.title || "evento")}`,
        type: payload.type,
        title: payload.title || payload.name,
        date: payload.date || payload.peakDate,
        time: payload.time || payload.localTime,
        visibility: payload.visibility || payload.visibilitySummary,
        location: payload.location || payload.region || "Global",
        summary: payload.summary || payload.description,
        details: payload.details || payload.notes || [],
        tips: payload.tips || [],
        source: payload.source || {
            name: payload.provider || "API externa",
            url: payload.url || ""
        },
        apiTags: payload.apiTags || payload.tags || []
    });
}

async function loadEventsFromProvider({ provider, endpoint, fetcher }) {
    if (provider === "local" || !endpoint) {
        return ASTRONOMY_EVENTS;
    }

    const response = await fetcher(endpoint);
    const payload = await response.json();
    const rawEvents = Array.isArray(payload) ? payload : payload.events || [];
    return rawEvents.map(normalizeExternalAstronomyEvent);
}

function startOfToday() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
