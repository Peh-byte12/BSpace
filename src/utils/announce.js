const REGION_ID = "bspaceLiveRegion";

export function announce(message) {
    let region = document.getElementById(REGION_ID);

    if (!region) {
        region = document.createElement("p");
        region.id = REGION_ID;
        region.className = "visually-hidden";
        region.setAttribute("role", "status");
        region.setAttribute("aria-live", "polite");
        document.body.appendChild(region);
    }

    region.textContent = "";
    window.setTimeout(() => {
        region.textContent = message;
    }, 60);
}
