import { ASTRONOMY_EVENTS, ASTRONOMY_EVENT_TYPES } from "../data/astronomy-events.js";
import { fetchNearEarthEvents } from "./astronomy-api-service.js";
import { normalizeText } from "../utils/format.js";
import { readJsonStorage, writeJsonStorage } from "../utils/storage.js";

const DEFAULT_FILTERS = {
    type: "todos",
    search: "",
    from: "",
    to: ""
};

const REMOTE_CACHE_KEY = "bspaceAstronomyRemoteEvents";
const REMOTE_CACHE_TTL = 6 * 60 * 60 * 1000;
const REMOTE_RETRY_COOLDOWN = 2 * 60 * 1000;

const remoteSource = {
    status: "idle",
    updatedAt: 0,
    failedAt: 0,
    message: "",
    events: [],
    request: null
};

export async function loadAstronomyEvents({
    filters = DEFAULT_FILTERS,
    provider = "local",
    endpoint = "",
    includeRemote = true,
    forceRefresh = false,
    fetcher
} = {}) {
    const localEvents = (await loadEventsFromProvider({ provider, endpoint, fetcher })).map(normalizeAstronomyEvent);
    const remoteEvents = includeRemote ? await loadRemoteEvents({ forceRefresh, fetcher }) : [];

    return filterAstronomyEvents(mergeEvents(localEvents, remoteEvents), filters);
}

export function getRemoteSourceState() {
    return {
        status: remoteSource.status,
        updatedAt: remoteSource.updatedAt,
        message: remoteSource.message,
        total: remoteSource.events.length
    };
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
        .sort(compareByUpcomingFirst);
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

    const request = typeof fetcher === "function" ? fetcher : (url) => globalThis.fetch(url);
    const response = await request(endpoint);
    const payload = await response.json();
    const rawEvents = Array.isArray(payload) ? payload : payload.events || [];

    return rawEvents.map(normalizeExternalAstronomyEvent);
}

async function loadRemoteEvents({ forceRefresh = false, fetcher } = {}) {
    if (remoteSource.status === "idle") {
        hydrateRemoteCache();
    }

    if (!forceRefresh && (hasFreshRemoteEvents() || isInRetryCooldown())) {
        return remoteSource.events;
    }

    if (!remoteSource.request) {
        remoteSource.status = "loading";
        remoteSource.request = requestRemoteEvents(fetcher).finally(() => {
            remoteSource.request = null;
        });
    }

    return remoteSource.request;
}

async function requestRemoteEvents(fetcher) {
    try {
        const payloads = await fetchNearEarthEvents(fetcher ? { fetcher } : {});

        remoteSource.events = payloads.map(normalizeExternalAstronomyEvent);
        remoteSource.updatedAt = Date.now();
        remoteSource.status = "live";
        remoteSource.failedAt = 0;
        remoteSource.message = "";
        writeJsonStorage(REMOTE_CACHE_KEY, { updatedAt: remoteSource.updatedAt, payloads });

        return remoteSource.events;
    } catch (error) {
        return useRemoteFallback(error);
    }
}

function useRemoteFallback(error) {
    remoteSource.message = error?.message || "Não foi possível consultar a API de eventos astronômicos.";
    console.warn("Calendário astronômico: a API não respondeu, usando dados locais.", error);

    if (remoteSource.events.length === 0) {
        hydrateRemoteCache();
    }

    remoteSource.failedAt = Date.now();
    remoteSource.status = remoteSource.events.length > 0 ? "cache" : "offline";

    return remoteSource.events;
}

function hydrateRemoteCache() {
    try {
        const cached = readJsonStorage(REMOTE_CACHE_KEY, null);
        const payloads = Array.isArray(cached?.payloads) ? cached.payloads : [];

        if (payloads.length === 0) {
            return false;
        }

        remoteSource.events = payloads.map(normalizeExternalAstronomyEvent);
        remoteSource.updatedAt = Number(cached.updatedAt) || 0;
        remoteSource.status = "cache";

        return true;
    } catch {
        return false;
    }
}

function isInRetryCooldown() {
    return remoteSource.failedAt > 0 && Date.now() - remoteSource.failedAt < REMOTE_RETRY_COOLDOWN;
}

function hasFreshRemoteEvents() {
    return remoteSource.events.length > 0 && Date.now() - remoteSource.updatedAt < REMOTE_CACHE_TTL;
}

function mergeEvents(localEvents, remoteEvents) {
    const merged = new Map();

    [...localEvents, ...remoteEvents].forEach((event) => {
        merged.set(event.id, event);
    });

    return [...merged.values()];
}

function compareByUpcomingFirst(a, b) {
    if (a.isPast !== b.isPast) {
        return a.isPast ? 1 : -1;
    }

    if (a.isPast) {
        return b.dateObject - a.dateObject;
    }

    return a.dateObject - b.dateObject;
}

function startOfToday() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
