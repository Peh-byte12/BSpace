export function renderMissionStats({ container, stats }) {
    if (!container || !stats?.length) {
        return;
    }

    container.innerHTML = "";

    stats.forEach((stat) => {
        const item = document.createElement("div");
        const label = document.createElement("span");
        const value = document.createElement("strong");

        item.className = "mission-stat";
        label.textContent = stat.label;
        value.textContent = stat.value;

        item.append(label, value);
        container.appendChild(item);
    });
}
