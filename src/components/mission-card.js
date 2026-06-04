export function renderMissionCards({ container, missions, selectedSlug, onSelect }) {
    if (!container) {
        return;
    }

    container.innerHTML = "";

    missions.forEach((mission) => {
        const card = document.createElement("button");
        const meta = document.createElement("span");
        const title = document.createElement("strong");
        const summary = document.createElement("span");

        card.type = "button";
        card.className = "mission-card";
        card.dataset.mission = mission.slug;
        card.setAttribute("aria-pressed", String(mission.slug === selectedSlug));

        meta.className = "mission-card-meta";
        meta.textContent = `${mission.period} · ${mission.status}`;

        title.textContent = mission.name;
        summary.textContent = mission.eyebrow;

        card.append(meta, title, summary);
        card.addEventListener("click", () => onSelect?.(mission.slug));
        container.appendChild(card);
    });
}
