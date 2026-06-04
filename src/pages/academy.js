import { ACADEMY_MODULES } from "../data/academy-modules.js";
import { setupAcademy } from "../components/academy.js";
import { byId } from "../utils/dom.js";

export function initPage() {
    setupAcademy({
        modules: ACADEMY_MODULES,
        moduleList: byId("academyModuleList"),
        moduleContent: byId("academyModuleContent"),
        progressPanel: byId("academyProgress")
    });
}
