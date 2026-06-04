import { formatNumber } from "../utils/format.js";

export function createPlanetViewerUI({
    container,
    planet,
    onZoomIn,
    onZoomOut,
    onZoomLevel,
    onResetView,
    onToggleRotation,
    onToggleFullscreen
}) {
    container.classList.add("planet-viewer");

    const loader = createLoader(planet);
    const toolbar = createToolbar({
        onZoomIn,
        onZoomOut,
        onZoomLevel,
        onResetView,
        onToggleRotation,
        onToggleFullscreen
    });
    const contextPanel = createContextPanel(planet);

    container.append(loader.element, toolbar.element, contextPanel.element);
    let lastZoomPercent = null;

    return {
        setLoadingProgress: loader.setProgress,
        setLoaded() {
            loader.element.classList.add("is-hidden");
            container.classList.add("is-loaded");
        },
        setError(message) {
            loader.setError(message);
            container.classList.add("has-error");
        },
        setRotationActive(isActive) {
            toolbar.rotationButton.setAttribute("aria-pressed", String(isActive));
            toolbar.rotationButton.classList.toggle("is-active", isActive);
        },
        setFullscreenActive(isActive) {
            toolbar.fullscreenButton.setAttribute("aria-pressed", String(isActive));
            toolbar.fullscreenButton.classList.toggle("is-active", isActive);
        },
        setZoomPercent(percent) {
            const safePercent = Math.round(Math.min(Math.max(percent, 0), 100));

            if (safePercent === lastZoomPercent) {
                return;
            }

            lastZoomPercent = safePercent;

            if (document.activeElement !== toolbar.zoomRange) {
                toolbar.zoomRange.value = String(safePercent);
            }

            toolbar.zoomValue.textContent = `${safePercent}%`;
        },
        setHotspotInfo(annotation, index) {
            contextPanel.setHotspot(annotation, index);
        }
    };
}

function createLoader(planet) {
    const element = document.createElement("div");
    const orbit = document.createElement("div");
    const content = document.createElement("div");
    const title = document.createElement("strong");
    const status = document.createElement("span");
    const track = document.createElement("div");
    const fill = document.createElement("span");

    element.className = "planet-loader";
    element.setAttribute("role", "status");
    element.setAttribute("aria-live", "polite");

    orbit.className = "planet-loader-orbit";
    content.className = "planet-loader-content";
    title.textContent = `Carregando ${planet.nome}`;
    status.textContent = "Preparando modelo 3D";
    track.className = "planet-loader-track";
    fill.className = "planet-loader-fill";

    track.appendChild(fill);
    content.append(title, status, track);
    element.append(orbit, content);

    return {
        element,
        setProgress(percent, message = "Carregando modelo GLB") {
            status.textContent = percent === null ? message : `${message}: ${Math.round(percent)}%`;
            fill.style.width = `${percent ?? 22}%`;
        },
        setError(message) {
            title.textContent = "Não foi possível carregar o planeta";
            status.textContent = message;
            fill.style.width = "100%";
        }
    };
}

function createToolbar({
    onZoomIn,
    onZoomOut,
    onZoomLevel,
    onResetView,
    onToggleRotation,
    onToggleFullscreen
}) {
    const element = document.createElement("div");
    const zoomGroup = document.createElement("div");
    const zoomOutButton = createControlButton("-", "Diminuir zoom", onZoomOut);
    const zoomRange = document.createElement("input");
    const zoomInButton = createControlButton("+", "Aumentar zoom", onZoomIn);
    const zoomValue = document.createElement("span");
    const rotationButton = createControlButton("Rot", "Ativar ou pausar rotação automática", onToggleRotation);
    const resetButton = createControlButton("Reset", "Restaurar enquadramento", onResetView);
    const fullscreenButton = createControlButton("[ ]", "Alternar tela cheia", onToggleFullscreen);

    element.className = "planet-viewer-toolbar";
    element.setAttribute("aria-label", "Controles do modelo 3D");

    zoomGroup.className = "planet-zoom-control";
    zoomRange.type = "range";
    zoomRange.min = "0";
    zoomRange.max = "100";
    zoomRange.value = "50";
    zoomRange.setAttribute("aria-label", "Nível de zoom");
    zoomRange.addEventListener("input", () => onZoomLevel?.(Number(zoomRange.value)));

    zoomValue.className = "planet-zoom-value";
    zoomValue.textContent = "50%";

    rotationButton.classList.add("is-active");
    rotationButton.setAttribute("aria-pressed", "true");
    fullscreenButton.setAttribute("aria-pressed", "false");

    zoomGroup.append(zoomOutButton, zoomRange, zoomInButton, zoomValue);
    element.append(zoomGroup, rotationButton, resetButton, fullscreenButton);

    return {
        element,
        zoomRange,
        zoomValue,
        rotationButton,
        fullscreenButton
    };
}

function createControlButton(text, label, onClick) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    button.setAttribute("aria-label", label);
    button.title = label;
    button.addEventListener("click", () => onClick?.());
    return button;
}

function createContextPanel(planet) {
    const element = document.createElement("aside");
    const kicker = document.createElement("span");
    const title = document.createElement("h2");
    const summary = document.createElement("p");
    const stats = document.createElement("dl");
    const hotspot = document.createElement("div");

    element.className = "planet-context-panel";
    element.setAttribute("aria-live", "polite");

    kicker.className = "section-kicker";
    kicker.textContent = "Contexto";
    title.textContent = planet.nome;
    summary.textContent = planet.resumo;
    stats.className = "planet-context-stats";
    hotspot.className = "planet-hotspot-detail";

    [
        ["Tipo", planet.tipo],
        ["Distância", `${formatNumber(planet.distancia)} mi km`],
        ["Gravidade", `${planet.gravidade} m/s²`],
        ["Luas", formatNumber(planet.luas)]
    ].forEach(([label, value]) => {
        const group = document.createElement("div");
        const term = document.createElement("dt");
        const description = document.createElement("dd");

        term.textContent = label;
        description.textContent = value;
        group.append(term, description);
        stats.appendChild(group);
    });

    function setHotspot(annotation, index) {
        hotspot.innerHTML = "";

        const label = document.createElement("span");
        const name = document.createElement("strong");
        const description = document.createElement("p");

        label.textContent = `Hotspot ${annotation.numero || index + 1}`;
        name.textContent = annotation.texto;
        description.textContent = annotation.detalhe || "Gire o planeta para observar essa região com mais contexto.";

        hotspot.append(label, name, description);
    }

    element.append(kicker, title, summary, stats, hotspot);

    return {
        element,
        setHotspot
    };
}
