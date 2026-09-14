import { prefersReducedMotion } from "../services/accessibility-service.js";
import { isSoundEnabled, playTone, setSoundEnabled } from "../services/audio-service.js";
import { setupAccessibilityPanel } from "./accessibility-panel.js";

const SOUND_PAGES = ["home", "curiosities"];

export function initSiteShell() {
    setupSkipLink();
    setupStarrySky();
    setupAccessibilityPanel(document.querySelector(".site-header"));
    highlightActiveLink();
    setupBackToTop();
    setupSoundToggle();
    setupCurrentYear();
}

export function enhancePageContent() {
    setupResponsiveImages();
    setupRevealAnimation();
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

function setupBackToTop() {
    if (document.getElementById("backToTop")) {
        return;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "back-to-top";
    button.id = "backToTop";
    button.setAttribute("aria-label", "Voltar ao topo da página");
    button.textContent = "↑";

    document.body.appendChild(button);

    let waitingFrame = false;

    function updateButtonState() {
        button.classList.toggle("show", window.scrollY > 250);
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

function setupSoundToggle() {
    if (!SOUND_PAGES.includes(document.body.dataset.page) || document.getElementById("soundToggle")) {
        return;
    }

    const button = document.createElement("button");

    button.type = "button";
    button.className = "sound-toggle";
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
    document.body.appendChild(button);
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
    const animatedElements = document.querySelectorAll("[data-reveal], .feature-card, .planet-card, .topic-card, .section-box, .planet-content, .planet-image");

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
        threshold: 0.15
    });

    animatedElements.forEach((element) => {
        element.classList.add("js-reveal");
        observer.observe(element);
    });
}
