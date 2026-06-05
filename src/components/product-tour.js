import { byId, createTextElement } from "../utils/dom.js";

export function renderGuidedDemoSteps(containerId, steps) {
    const container = byId(containerId);

    if (!container) {
        return;
    }

    container.innerHTML = "";
    steps.forEach((step, index) => {
        const card = document.createElement("article");
        const counter = createTextElement("span", String(index + 1).padStart(2, "0"), "demo-step-number");
        const title = createTextElement("h3", step.title);
        const description = createTextElement("p", step.description);
        const value = createTextElement("strong", step.value, "demo-step-value");
        const link = document.createElement("a");

        card.className = "demo-step-card";
        card.dataset.demoCard = String(index);
        link.className = "button-secondary";
        link.href = step.href;
        link.textContent = step.cta;
        card.append(counter, title, description, value, link);
        container.appendChild(card);
    });
}

export function setupProductTour(steps) {
    const openButton = byId("startProductTour");
    const dialog = byId("productTour");

    if (!openButton || !dialog || steps.length === 0) {
        return;
    }

    const closeButton = byId("tourClose");
    const previousButton = byId("tourPrevious");
    const nextButton = byId("tourNext");
    const title = byId("tourTitle");
    const description = byId("tourDescription");
    const value = byId("tourValue");
    const counter = byId("tourCounter");
    const progress = byId("tourProgress");
    const link = byId("tourLink");
    let currentIndex = 0;
    let previousFocus = null;
    const focusableSelector = "a[href], button:not([disabled])";

    function updateTour(index) {
        currentIndex = Math.min(Math.max(index, 0), steps.length - 1);
        const step = steps[currentIndex];
        const progressValue = Math.round(((currentIndex + 1) / steps.length) * 100);

        title.textContent = step.title;
        description.textContent = step.description;
        value.textContent = step.value;
        counter.textContent = `${currentIndex + 1} de ${steps.length}`;
        progress.style.width = `${progressValue}%`;
        link.href = step.href;
        link.textContent = step.cta;
        previousButton.disabled = currentIndex === 0;
        nextButton.textContent = currentIndex === steps.length - 1 ? "Concluir" : "Próximo";

        document.querySelectorAll("[data-demo-card]").forEach((card) => {
            card.classList.toggle("is-current", card.dataset.demoCard === String(currentIndex));
        });
    }

    function openTour() {
        previousFocus = document.activeElement;
        dialog.hidden = false;
        document.body.classList.add("tour-is-open");
        updateTour(0);
        closeButton.focus();
    }

    function closeTour() {
        dialog.hidden = true;
        document.body.classList.remove("tour-is-open");

        if (previousFocus && "focus" in previousFocus) {
            previousFocus.focus();
        }
    }

    openButton.addEventListener("click", openTour);
    closeButton.addEventListener("click", closeTour);
    previousButton.addEventListener("click", () => updateTour(currentIndex - 1));
    nextButton.addEventListener("click", () => {
        if (currentIndex === steps.length - 1) {
            closeTour();
            return;
        }

        updateTour(currentIndex + 1);
    });

    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
            closeTour();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (dialog.hidden) {
            return;
        }

        if (event.key === "Escape") {
            closeTour();
            return;
        }

        if (event.key !== "Tab") {
            return;
        }

        const focusableElements = Array.from(dialog.querySelectorAll(focusableSelector));
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!firstElement || !lastElement) {
            return;
        }

        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    });
}
