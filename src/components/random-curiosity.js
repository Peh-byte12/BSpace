import { byId } from "../utils/dom.js";

export function setupRandomCuriosity({ buttonId, outputId, curiosities, onReveal }) {
    const button = byId(buttonId);
    const output = byId(outputId);
    let lastIndex = -1;

    if (!button || !output || curiosities.length === 0) {
        return;
    }

    button.addEventListener("click", () => {
        let randomIndex = Math.floor(Math.random() * curiosities.length);

        if (curiosities.length > 1 && randomIndex === lastIndex) {
            randomIndex = (randomIndex + 1) % curiosities.length;
        }

        lastIndex = randomIndex;
        output.textContent = curiosities[randomIndex];
        onReveal?.(randomIndex);
    });
}
