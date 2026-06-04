import { byId } from "../utils/dom.js";

export function setupRandomCuriosity({ buttonId, outputId, curiosities }) {
    const button = byId(buttonId);
    const output = byId(outputId);

    if (!button || !output || curiosities.length === 0) {
        return;
    }

    button.addEventListener("click", () => {
        const randomIndex = Math.floor(Math.random() * curiosities.length);
        output.textContent = curiosities[randomIndex];
    });
}
