import { setupPlanetComparison } from "../components/planet-comparison.js";
import { setupPlanetCatalog } from "../components/planet-list.js";

export function initPage() {
    setupPlanetCatalog({
        gridId: "planetsGrid",
        searchId: "planetSearch"
    });

    setupPlanetComparison({
        selectAId: "comparePlanetA",
        selectBId: "comparePlanetB",
        tableId: "planetComparison",
        insightId: "planetComparisonInsight"
    });
}
