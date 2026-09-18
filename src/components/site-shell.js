import { prefersReducedMotion } from "../services/accessibility-service.js";
import { isSoundEnabled, playTone, setSoundEnabled } from "../services/audio-service.js";
import { setupAccessibilityPanel } from "./accessibility-panel.js";

const SOUND_PAGES = ["home", "curiosities"];

export function initSiteShell() {
    const dock = setupAccessibilityDock();

    setupSkipLink();
    setupStarrySky();
    highlightActiveLink();
    setupBackToTop(dock);
    setupSoundToggle(dock);
    setupAccessibilityPanel(dock);
    setupCurrentYear();
}

export function enhancePageContent() {
    setupResponsiveImages();
    setupRevealAnimation();
    setupOffscreenAnimationPause();
}

function setupSkipLink() {
    const main = document.querySelector("main");

    if (!main || document.querySelector(".skip-link")) {
        return;
    }

    main.id = main.id || "conteudo";
    main.setAttribute("tabindex", "-1");

    const link = document.createElement("a");
    link.className = "skip-link";
    link.href = `#${main.id}`;
    link.textContent = "Pular para o conteúdo principal";
    document.body.prepend(link);
}

function setupStarrySky() {
    const skies = document.querySelectorAll(".ceu[data-stars]");

    if (skies.length === 0) {
        return;
    }

    const stars = [
        [5, 10, 0.2], [12, 25, 1], [8, 42, 0.5], [18, 60, 1.7], [10, 80, 0.8],
        [22, 15, 1.3], [28, 35, 0.6], [30, 52, 1.8], [24, 72, 0.9], [36, 88, 1.2],
        [42, 8, 0.3], [48, 20, 1.4], [40, 38, 0.7], [55, 50, 1.6], [44, 68, 0.4],
        [52, 82, 1.1], [60, 12, 0.9], [65, 28, 1.5], [58, 44, 0.2], [70, 62, 1.9],
        [74, 78, 0.8], [82, 18, 1.2], [86, 36, 0.5], [80, 54, 1.7], [90, 72, 1],
        [14, 92, 0.6], [32, 95, 1.4], [67, 92, 0.7], [88, 92, 1.6], [50, 96, 0.3]
    ];

    skies.forEach((sky) => {
        if (sky.querySelector(".estrela")) {
            return;
        }

        stars.forEach(([top, left, delay]) => {
            const star = document.createElement("div");
            star.className = "estrela";
            star.style.top = `${top}%`;
            star.style.left = `${left}%`;
            star.style.animationDelay = `${delay}s`;
            sky.appendChild(star);
        });
    });
}

function highlightActiveLink() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-links a").forEach((link) => {
        const target = link.getAttribute("href");
        const targetPage = target.split("?")[0];

        if (targetPage === currentPage || (currentPage === "planeta.html" && targetPage === "planetas.html")) {
            link.classList.add("ativo");
            link.setAttribute("aria-current", "page");
        }
    });
}

// Agrupa os controles flutuantes do canto inferior direito para que eles não se sobreponham.
function setupAccessibilityDock() {
    const existing = document.getElementById("a11yDock");

    if (existing) {
        return existing;
    }

    const dock = document.createElement("div");
    const secondary = document.createElement("div");

    dock.className = "a11y-dock";
    dock.id = "a11yDock";
    secondary.className = "a11y-dock-secondary";

    dock.appendChild(secondary);
    document.body.appendChild(dock);

    return dock;
}

function setupBackToTop(dock) {
    if (!dock || document.getElementById("backToTop")) {
        return;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "dock-button back-to-top";
    button.id = "backToTop";
    button.setAttribute("aria-label", "Voltar ao topo da página");
    button.title = "Voltar ao topo";
    button.textContent = "↑";

    dock.querySelector(".a11y-dock-secondary").appendChild(button);

    let waitingFrame = false;
    let isShown = null;

    function updateButtonState() {
        const shouldShow = window.scrollY > 250;

        if (shouldShow === isShown) {
            return;
        }

        isShown = shouldShow;
        button.classList.toggle("show", shouldShow);
    }

    window.addEventListener("scroll", () => {
        if (waitingFrame) {
            return;
        }

        waitingFrame = true;
        window.requestAnimationFrame(() => {
            updateButtonState();
            waitingFrame = false;
        });
    }, { passive: true });

    updateButtonState();

    button.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion() ? "auto" : "smooth"
        });
    });
}

function setupSoundToggle(dock) {
    if (!dock || !SOUND_PAGES.includes(document.body.dataset.page) || document.getElementById("soundToggle")) {
        return;
    }

    const button = document.createElement("button");

    button.type = "button";
    button.className = "dock-button sound-toggle";
    button.id = "soundToggle";
    button.textContent = "♪";

    function updateButtonState() {
        const isEnabled = isSoundEnabled();
        const label = isEnabled ? "Desativar sons da interface" : "Ativar sons da interface";

        button.classList.toggle("is-active", isEnabled);
        button.setAttribute("aria-pressed", String(isEnabled));
        button.setAttribute("aria-label", label);
        button.title = label;
    }

    button.addEventListener("click", () => {
        const nextState = !isSoundEnabled();

        setSoundEnabled(nextState);
        updateButtonState();

        if (nextState) {
            playTone(660, true);
        }
    });

    updateButtonState();
    dock.querySelector(".a11y-dock-secondary").appendChild(button);
}

function setupCurrentYear() {
    const currentYear = new Date().getFullYear();

    document.querySelectorAll("[data-current-year]").forEach((element) => {
        element.textContent = currentYear;
    });
}

function setupResponsiveImages() {
    document.querySelectorAll("img").forEach((image) => {
        if (!image.hasAttribute("decoding")) {
            image.decoding = "async";
        }

        if (image.closest(".brand")) {
            image.loading = "eager";
            image.fetchPriority = "high";
            return;
        }

        if (!image.hasAttribute("loading")) {
            image.loading = "lazy";
        }
    });
}

function setupRevealAnimation() {
    const animatedElements = [...document.querySelectorAll("[data-reveal], .feature-card, .planet-card, .topic-card, .section-box, .planet-content, .planet-image")];

    if (!("IntersectionObserver" in window) || animatedElements.length === 0) {
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
    });

    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    // As medições acontecem todas antes das escritas para não alternar leitura e escrita de layout.
    const distancesToViewport = animatedElements.map((element) => element.getBoundingClientRect().top);

    animatedElements.forEach((element, index) => {
        // O conteúdo que já está visível na primeira dobra entra sem animação, evitando o piscar inicial.
        if (distancesToViewport[index] < viewportHeight) {
            return;
        }

        element.classList.add("js-reveal");
        observer.observe(element);
    });
}

// Órbitas fora da tela continuavam animando e consumindo quadros sem nenhum ganho visual.
function setupOffscreenAnimationPause() {
    const stage = document.querySelector(".solar-stage");

    if (!stage || !("IntersectionObserver" in window)) {
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        stage.classList.toggle("is-paused", !entries[0].isIntersecting);
    }, { threshold: 0 });

    observer.observe(stage);
}
