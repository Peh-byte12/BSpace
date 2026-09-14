import { PLANET_ORDER } from "../data/planets.js";
import { MISSIONS } from "../data/missions.js";
import { MISSION_TYPES } from "../data/mission-types.js";
import { CURIOSITIES } from "../data/curiosities.js";
import { getPlanetBySlug, getPlanets } from "./planet-service.js";
import { normalizeText } from "../utils/format.js";
import { readJsonStorage, removeStorage, writeJsonStorage } from "../utils/storage.js";

const STORAGE_KEY = "bspaceUserStats";
const STATS_VERSION = 1;
const CHANGE_EVENT = "bspace:stats-change";
const LEGACY_KEYS = ["bspaceLastPlanet", "bspaceVisitedPlanets", "bspaceMissionSimulations"];
const MIN_SEARCH_LENGTH = 2;
const SET_FIELDS = ["planetsExplored", "eventsViewed", "missionsViewed", "curiositiesDiscovered", "missionSimulations", "favorites"];

const lastSearchByContext = new Map();
let memoryRecord = null;
let storageAvailable = true;

LEGACY_KEYS.forEach(removeStorage);

export function getUserStats() {
    const record = loadRecord();

    return {
        profileId: record.profileId,
        createdAt: record.createdAt,
        persistent: storageAvailable,
        planetsExplored: record.planetsExplored.length,
        eventsViewed: record.eventsViewed.length,
        missionsViewed: record.missionsViewed.length,
        curiositiesDiscovered: record.curiositiesDiscovered.length,
        missionSimulations: record.missionSimulations.length,
        searches: record.searches,
        favorites: record.favorites.length,
        totals: {
            planets: getPlanets().length,
            missions: MISSIONS.length,
            curiosities: CURIOSITIES.length,
            missionSimulations: getPlanets().length * Object.keys(MISSION_TYPES).length
        }
    };
}

export function hasAnyActivity(stats = getUserStats()) {
    return ["planetsExplored", "eventsViewed", "missionsViewed", "curiositiesDiscovered", "missionSimulations", "searches", "favorites"]
        .some((key) => stats[key] > 0);
}

export function getLastVisitedPlanet() {
    return getPlanetBySlug(loadRecord().lastPlanet) || null;
}

export function getNextRecommendedPlanet() {
    const record = loadRecord();
    const visited = new Set(record.planetsExplored);
    const nextSlug = PLANET_ORDER.find((slug) => !visited.has(slug)) || record.lastPlanet;
    return getPlanetBySlug(nextSlug) || getPlanetBySlug("marte");
}

export function setLastVisitedPlanet(slug) {
    if (!getPlanetBySlug(slug)) {
        return;
    }

    updateRecord((record) => {
        if (record.lastPlanet === slug) {
            return false;
        }

        record.lastPlanet = slug;
        return true;
    });
}

export function markPlanetVisited(slug) {
    if (!getPlanetBySlug(slug)) {
        return;
    }

    updateRecord((record) => {
        const added = addUnique(record.planetsExplored, slug);
        const moved = record.lastPlanet !== slug;
        record.lastPlanet = slug;
        return added || moved;
    });
}

export function recordEventView(eventId) {
    recordUnique("eventsViewed", eventId);
}

export function recordMissionView(missionSlug) {
    if (MISSIONS.some((mission) => mission.slug === missionSlug)) {
        recordUnique("missionsViewed", missionSlug);
    }
}

export function recordCuriosity(index) {
    if (Number.isInteger(index) && index >= 0 && index < CURIOSITIES.length) {
        recordUnique("curiositiesDiscovered", String(index));
    }
}

export function recordMissionSimulation(planetSlug, missionTypeSlug) {
    if (getPlanetBySlug(planetSlug) && MISSION_TYPES[missionTypeSlug]) {
        recordUnique("missionSimulations", `${planetSlug}:${missionTypeSlug}`);
    }
}

export function recordSearch(context, term) {
    const normalizedTerm = normalizeText(String(term || "").trim());

    if (normalizedTerm.length < MIN_SEARCH_LENGTH || lastSearchByContext.get(context) === normalizedTerm) {
        return false;
    }

    lastSearchByContext.set(context, normalizedTerm);
    updateRecord((record) => {
        record.searches += 1;
        return true;
    });
    return true;
}

export function createSearchRecorder(context, delay = 900) {
    let timer = null;

    return {
        schedule(term) {
            window.clearTimeout(timer);
            timer = window.setTimeout(() => recordSearch(context, term), delay);
        },
        flush(term) {
            window.clearTimeout(timer);
            recordSearch(context, term);
        }
    };
}

export function isFavorite(type, id) {
    return loadRecord().favorites.includes(favoriteKey(type, id));
}

export function toggleFavorite(type, id) {
    const key = favoriteKey(type, id);
    let isNowFavorite = false;

    updateRecord((record) => {
        const index = record.favorites.indexOf(key);

        if (index >= 0) {
            record.favorites.splice(index, 1);
        } else {
            record.favorites.push(key);
            isNowFavorite = true;
        }

        return true;
    });

    return isNowFavorite;
}

export function resetUserStats() {
    lastSearchByContext.clear();
    saveRecord(createEmptyRecord());
}

export function onUserStatsChange(callback) {
    const handleLocalChange = () => callback(getUserStats());
    const handleStorage = (event) => {
        if (event.key === STORAGE_KEY || event.key === null) {
            callback(getUserStats());
        }
    };

    window.addEventListener(CHANGE_EVENT, handleLocalChange);
    window.addEventListener("storage", handleStorage);

    return () => {
        window.removeEventListener(CHANGE_EVENT, handleLocalChange);
        window.removeEventListener("storage", handleStorage);
    };
}

function recordUnique(field, value) {
    if (!value) {
        return;
    }

    updateRecord((record) => addUnique(record[field], String(value)));
}

function updateRecord(mutator) {
    const record = loadRecord();

    if (mutator(record) === false) {
        return;
    }

    saveRecord(record);
}

function loadRecord() {
    if (!storageAvailable && memoryRecord) {
        return cloneRecord(memoryRecord);
    }

    const stored = readJsonStorage(STORAGE_KEY, null);

    if (stored) {
        return normalizeRecord(stored);
    }

    const record = memoryRecord ? cloneRecord(memoryRecord) : createEmptyRecord();
    saveRecord(record, { silent: true });
    return record;
}

function saveRecord(record, { silent = false } = {}) {
    record.updatedAt = new Date().toISOString();
    memoryRecord = cloneRecord(record);
    storageAvailable = writeJsonStorage(STORAGE_KEY, record);

    if (!silent) {
        window.dispatchEvent(new window.CustomEvent(CHANGE_EVENT));
    }
}

function createEmptyRecord() {
    const now = new Date().toISOString();

    return {
        version: STATS_VERSION,
        profileId: createProfileId(),
        createdAt: now,
        updatedAt: now,
        lastPlanet: "",
        planetsExplored: [],
        eventsViewed: [],
        missionsViewed: [],
        curiositiesDiscovered: [],
        missionSimulations: [],
        searches: 0,
        favorites: []
    };
}

function normalizeRecord(raw) {
    const record = { ...createEmptyRecord(), ...raw, version: STATS_VERSION };

    SET_FIELDS.forEach((field) => {
        record[field] = Array.isArray(raw?.[field]) ? [...new Set(raw[field].map(String))] : [];
    });

    record.planetsExplored = record.planetsExplored.filter((slug) => getPlanetBySlug(slug));
    record.lastPlanet = getPlanetBySlug(record.lastPlanet) ? record.lastPlanet : "";
    record.searches = Number.isInteger(raw?.searches) && raw.searches > 0 ? raw.searches : 0;
    record.profileId = typeof raw?.profileId === "string" && raw.profileId ? raw.profileId : createProfileId();

    return record;
}

function cloneRecord(record) {
    return JSON.parse(JSON.stringify(record));
}

function addUnique(list, value) {
    if (list.includes(value)) {
        return false;
    }

    list.push(value);
    return true;
}

function favoriteKey(type, id) {
    return `${type}:${id}`;
}

function createProfileId() {
    if (globalThis.crypto?.randomUUID) {
        return globalThis.crypto.randomUUID();
    }

    return `perfil-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
