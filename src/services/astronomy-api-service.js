import { formatNumber } from "../utils/format.js";

const NEOWS_ENDPOINT = "https://api.nasa.gov/neo/rest/v1/feed";
const DEFAULT_API_KEY = "DEMO_KEY";
const REQUEST_TIMEOUT = 9000;
const FORECAST_DAYS = 6;
const MAX_EVENTS = 6;

const defaultFetcher = (url, options) => globalThis.fetch(url, options);

export async function fetchNearEarthEvents({
    apiKey = DEFAULT_API_KEY,
    days = FORECAST_DAYS,
    limit = MAX_EVENTS,
    fetcher = defaultFetcher
} = {}) {
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);
    const url = `${NEOWS_ENDPOINT}?start_date=${toApiDate(startDate)}&end_date=${toApiDate(endDate)}&api_key=${apiKey}`;

    return toAstronomyEvents(await requestJson(url, fetcher), limit);
}

async function requestJson(url, fetcher) {
    if (typeof fetcher !== "function") {
        throw new Error("Este navegador não oferece suporte a requisições de rede.");
    }

    const controller = typeof AbortController === "function" ? new AbortController() : null;
    const timeoutId = controller ? window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT) : null;

    try {
        const response = await fetcher(url, { signal: controller?.signal });

        if (!response.ok) {
            throw new Error(`A API da NASA respondeu com o código ${response.status}.`);
        }

        return await response.json();
    } finally {
        if (timeoutId !== null) {
            window.clearTimeout(timeoutId);
        }
    }
}

function toAstronomyEvents(payload, limit) {
    const groups = payload?.near_earth_objects || {};
    const approaches = [];

    Object.entries(groups).forEach(([date, objects]) => {
        (objects || []).forEach((object) => {
            const approach = findApproach(object, date);

            if (approach) {
                approaches.push({ object, approach });
            }
        });
    });

    return approaches
        .sort((a, b) => missDistanceInKm(a.approach) - missDistanceInKm(b.approach))
        .slice(0, limit)
        .map(toAstronomyEvent);
}

function findApproach(object, date) {
    const approaches = Array.isArray(object?.close_approach_data) ? object.close_approach_data : [];
    return approaches.find((item) => item.close_approach_date === date) || approaches[0] || null;
}

function toAstronomyEvent({ object, approach }) {
    const name = cleanName(object.name);
    const lunarDistance = Number(approach.miss_distance?.lunar);
    const kilometers = missDistanceInKm(approach);
    const speed = Number(approach.relative_velocity?.kilometers_per_hour);
    const isHazardous = Boolean(object.is_potentially_hazardous_asteroid);

    return {
        id: `neo-${object.id}-${approach.close_approach_date}`,
        type: "asteroide",
        title: `Aproximação do asteroide ${name}`,
        date: approach.close_approach_date,
        time: formatApproachTime(approach),
        visibility: isHazardous
            ? "Classificado pela NASA como potencialmente perigoso, sem risco de impacto previsto"
            : "Sem risco de impacto; acompanhamento feito por telescópios",
        location: "Monitoramento global do programa de objetos próximos da Terra",
        summary: `O asteroide ${name} passa a cerca de ${formatDecimal(lunarDistance)} vezes a distância entre a Terra e a Lua.`,
        details: buildDetails({ name, lunarDistance, kilometers, speed, object, isHazardous }),
        tips: [
            "Compare a distância do asteroide com a da Lua para entender a escala do Sistema Solar interno.",
            "Use o campo de busca por 'asteroide' para reunir todas as aproximações do período.",
            "Os dados vêm da NASA e mudam a cada atualização automática da página."
        ],
        source: {
            name: "NASA · Near Earth Object Web Service",
            url: object.nasa_jpl_url || "https://cneos.jpl.nasa.gov/"
        },
        apiTags: ["asteroide", "near-earth-object", "nasa", name]
    };
}

function buildDetails({ name, lunarDistance, kilometers, speed, object, isHazardous }) {
    const diameter = object.estimated_diameter?.meters;
    const details = [];

    if (Number.isFinite(kilometers)) {
        details.push(`Distância mínima estimada de ${formatNumber(Math.round(kilometers))} km, o equivalente a ${formatDecimal(lunarDistance)} distâncias lunares.`);
    }

    if (Number.isFinite(speed)) {
        details.push(`Velocidade relativa de aproximadamente ${formatNumber(Math.round(speed))} km/h.`);
    }

    if (diameter) {
        const min = Math.round(Number(diameter.estimated_diameter_min));
        const max = Math.round(Number(diameter.estimated_diameter_max));

        if (Number.isFinite(min) && Number.isFinite(max)) {
            details.push(`Diâmetro estimado entre ${formatNumber(min)} e ${formatNumber(max)} metros.`);
        }
    }

    details.push(isHazardous
        ? `${name} entra na categoria de objeto potencialmente perigoso por causa do tamanho e da órbita, o que significa monitoramento contínuo e não impacto previsto.`
        : `${name} é acompanhado pela rede de observação da NASA e não representa risco para a Terra.`);

    return details;
}

function toApiDate(date) {
    return date.toISOString().slice(0, 10);
}

function missDistanceInKm(approach) {
    const kilometers = Number(approach?.miss_distance?.kilometers);
    return Number.isFinite(kilometers) ? kilometers : Number.MAX_SAFE_INTEGER;
}

function formatApproachTime(approach) {
    const match = /(\d{2}:\d{2})$/.exec(approach?.close_approach_date_full || "");
    return match ? `${match[1]} UTC` : "Horário a confirmar";
}

function formatDecimal(value) {
    return Number.isFinite(value) ? formatNumber(Math.round(value * 10) / 10) : "—";
}

function cleanName(name) {
    return String(name || "sem identificação").replace(/^\((.*)\)$/, "$1").trim();
}
