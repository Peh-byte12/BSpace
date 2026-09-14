import { isFavorite, toggleFavorite } from "../services/exploration-progress-service.js";
import { announce } from "../utils/announce.js";

export function createFavoriteToggle({ type, id, name }) {
    const button = document.createElement("button");
    const icon = document.createElement("span");
    const text = document.createElement("span");

    button.type = "button";
    button.className = "favorite-toggle";
    icon.className = "favorite-toggle-icon";
    icon.setAttribute("aria-hidden", "true");
    text.textContent = "Favorito";
    button.setAttribute("aria-label", `Favorito: ${name}`);
    button.append(icon, text);

    function render(isActive) {
        icon.textContent = isActive ? "★" : "☆";
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    }

    button.addEventListener("click", () => {
        const isActive = toggleFavorite(type, id);
        render(isActive);
        announce(isActive ? `${name} adicionado aos favoritos.` : `${name} removido dos favoritos.`);
    });

    render(isFavorite(type, id));
    return button;
}
