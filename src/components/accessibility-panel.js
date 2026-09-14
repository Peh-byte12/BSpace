import { getPreferences, resetPreferences, stepFontScale, updatePreferences } from "../services/accessibility-service.js";
import { FONT_SCALES } from "../services/accessibility-service.js";
import { announce } from "../utils/announce.js";

const TOGGLES = [
    { key: "highContrast", label: "Alto contraste", hint: "Deixa textos, bordas e fundos mais nítidos." },
    { key: "reduceMotion", label: "Reduzir animações", hint: "Pausa estrelas, órbitas, transições e a rotação automática do 3D." },
    { key: "underlineLinks", label: "Sublinhar links", hint: "Destaca todos os links com sublinhado." },
    { key: "textSpacing", label: "Espaçamento de leitura", hint: "Aumenta o espaço entre linhas, palavras e letras." }
];

export function setupAccessibilityPanel(header) {
    if (!header || document.getElementById("a11yPanel")) {
        return;
    }

    const wrapper = document.createElement("div");
    const trigger = createTrigger();
    const panel = createPanel();

    wrapper.className = "a11y-menu";
    wrapper.append(trigger, panel.element);
    header.appendChild(wrapper);

    function setOpen(isOpen) {
        panel.element.hidden = !isOpen;
        trigger.setAttribute("aria-expanded", String(isOpen));
    }

    trigger.addEventListener("click", () => setOpen(panel.element.hidden));

    wrapper.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !panel.element.hidden) {
            setOpen(false);
            trigger.focus();
        }
    });

    document.addEventListener("click", (event) => {
        if (!panel.element.hidden && !wrapper.contains(event.target)) {
            setOpen(false);
        }
    });

    panel.sync(getPreferences());
}

function createTrigger() {
    const button = document.createElement("button");
    const icon = document.createElement("span");

    button.type = "button";
    button.id = "a11yTrigger";
    button.className = "a11y-trigger";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", "a11yPanel");
    icon.className = "a11y-trigger-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "Aa";
    button.append(icon, document.createTextNode("Acessibilidade"));

    return button;
}

function createPanel() {
    const element = document.createElement("section");
    const title = document.createElement("p");
    const fontGroup = document.createElement("div");
    const fontLabel = document.createElement("span");
    const fontControls = document.createElement("div");
    const fontValue = document.createElement("output");
    const decrease = createFontButton("A−", "Diminuir tamanho do texto");
    const increase = createFontButton("A+", "Aumentar tamanho do texto");
    const fontReset = document.createElement("button");
    const toggleList = document.createElement("ul");
    const resetAll = document.createElement("button");
    const checkboxes = new Map();

    element.id = "a11yPanel";
    element.className = "a11y-panel";
    element.hidden = true;
    element.setAttribute("aria-labelledby", "a11yPanelTitle");
    element.setAttribute("role", "region");

    title.id = "a11yPanelTitle";
    title.className = "a11y-panel-title";
    title.textContent = "Opções de acessibilidade";

    fontGroup.className = "a11y-font";
    fontGroup.setAttribute("role", "group");
    fontGroup.setAttribute("aria-labelledby", "a11yFontLabel");
    fontLabel.id = "a11yFontLabel";
    fontLabel.className = "a11y-label";
    fontLabel.textContent = "Tamanho do texto";
    fontControls.className = "a11y-font-controls";
    fontValue.id = "a11yFontValue";
    fontValue.className = "a11y-font-value";

    fontReset.type = "button";
    fontReset.className = "a11y-small-button";
    fontReset.textContent = "Padrão";

    fontControls.append(decrease, fontValue, increase, fontReset);
    fontGroup.append(fontLabel, fontControls);

    toggleList.className = "a11y-toggle-list";
    TOGGLES.forEach((toggle) => {
        const item = document.createElement("li");
        const label = document.createElement("label");
        const input = document.createElement("input");
        const text = document.createElement("span");
        const name = document.createElement("strong");
        const hint = document.createElement("span");

        input.type = "checkbox";
        input.id = `a11y-${toggle.key}`;
        hint.id = `a11y-${toggle.key}-hint`;
        input.setAttribute("aria-describedby", hint.id);
        label.className = "a11y-toggle";
        text.className = "a11y-toggle-text";
        hint.className = "a11y-hint";
        name.textContent = toggle.label;
        hint.textContent = toggle.hint;

        input.addEventListener("change", () => {
            sync(updatePreferences({ [toggle.key]: input.checked }));
            announce(`${toggle.label} ${input.checked ? "ativado" : "desativado"}.`);
        });

        text.append(name, hint);
        label.append(input, text);
        item.appendChild(label);
        toggleList.appendChild(item);
        checkboxes.set(toggle.key, input);
    });

    resetAll.type = "button";
    resetAll.className = "button-secondary a11y-reset";
    resetAll.textContent = "Restaurar padrões";

    decrease.addEventListener("click", () => changeFont(-1));
    increase.addEventListener("click", () => changeFont(1));
    fontReset.addEventListener("click", () => {
        sync(updatePreferences({ fontScale: 1 }));
        announce("Tamanho do texto: 100%.");
    });
    resetAll.addEventListener("click", () => {
        sync(resetPreferences());
        announce("Configurações de acessibilidade restauradas.");
    });

    element.append(title, fontGroup, toggleList, resetAll);

    function changeFont(direction) {
        const preferences = stepFontScale(direction);
        sync(preferences);
        announce(`Tamanho do texto: ${formatScale(preferences.fontScale)}.`);
    }

    function sync(preferences) {
        const index = FONT_SCALES.indexOf(preferences.fontScale);

        fontValue.textContent = formatScale(preferences.fontScale);
        decrease.setAttribute("aria-disabled", String(index <= 0));
        increase.setAttribute("aria-disabled", String(index >= FONT_SCALES.length - 1));
        checkboxes.forEach((input, key) => {
            input.checked = preferences[key] === true;
        });
    }

    return { element, sync };
}

function createFontButton(symbol, label) {
    const button = document.createElement("button");
    const visible = document.createElement("span");
    const hidden = document.createElement("span");

    button.type = "button";
    button.className = "a11y-small-button a11y-font-button";
    visible.setAttribute("aria-hidden", "true");
    visible.textContent = symbol;
    hidden.className = "visually-hidden";
    hidden.textContent = label;
    button.append(visible, hidden);

    return button;
}

function formatScale(scale) {
    return `${Math.round(scale * 100)}%`;
}
