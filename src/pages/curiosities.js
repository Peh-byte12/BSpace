import { CURIOSITIES } from "../data/curiosities.js";
import { setupLightSimulator } from "../components/light-simulator.js";
import { setupRandomCuriosity } from "../components/random-curiosity.js";

export function initPage() {
    setupRandomCuriosity({
        buttonId: "btnCuriosidade",
        outputId: "curiosidadeTexto",
        curiosities: CURIOSITIES
    });

    setupLightSimulator({
        selectId: "lightDestination",
        meterId: "lightMeter",
        outputId: "lightOutput"
    });
}
