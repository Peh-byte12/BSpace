import { PLANET_ORDER } from "../data/planets.js";
import { getPlanetBySlug, getPlanets } from "./planet-service.js";
import { readJsonStorage, readStorage, writeJsonStorage, writeStorage } from "../utils/storage.js";

const STORAGE_KEYS = {
    lastPlanet: "bspaceLastPlanet",
    visitedPlanets: "bspaceVisitedPlanets",
    missionSimulations: "bspaceMissionSimulations"
};

export function markPlanetVisited(slug) {
    const planet = getPlanetBySlug(slug);

    if (!planet) {
        return;
    }

    const visited = new Set(readJsonStorage(STORAGE_KEYS.visitedPlanets, []));
    visited.add(slug);

    writeStorage(STORAGE_KEYS.lastPlanet, slug);
    writeJsonStorage(STORAGE_KEYS.visitedPlanets, [...visited]);
}

export function getLastVisitedPlanet() {
    return getPlanetBySlug(readStorage(STORAGE_KEYS.lastPlanet, "terra")) || getPlanetBySlug("terra");
}

export function getNextRecommendedPlanet() {
    const visited = new Set(readJsonStorage(STORAGE_KEYS.visitedPlanets, []));
    const nextSlug = PLANET_ORDER.find((slug) => !visited.has(slug)) || readStorage(STORAGE_KEYS.lastPlanet, "marte");
    return getPlanetBySlug(nextSlug) || getPlanetBySlug("marte");
}

export function incrementMissionSimulations() {
    incrementStoredCounter(STORAGE_KEYS.missionSimulations);
}

export function getExplorationStats() {
    const totalPlanets = getPlanets().length;
    const visitedPlanets = readJsonStorage(STORAGE_KEYS.visitedPlanets, []).filter((slug) => getPlanetBySlug(slug));
    const missionSimulations = readStoredCounter(STORAGE_KEYS.missionSimulations);

    return {
        totalPlanets,
        visitedPlanets: new Set(visitedPlanets).size,
        missionSimulations
    };
}

function incrementStoredCounter(key) {
    const currentValue = readStoredCounter(key);
    const nextValue = currentValue + 1;
    writeStorage(key, String(nextValue));
}

function readStoredCounter(key) {
    const value = Number(readStorage(key, "0"));
    return Number.isFinite(value) && value > 0 ? value : 0;
}
