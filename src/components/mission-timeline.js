export function renderMissionTimeline({ container, timeline }) {
    if (!container || !timeline?.length) {
        return;
    }

    container.innerHTML = "";

    const detail = document.createElement("div");
    detail.className = "timeline-detail";
    detail.setAttribute("aria-live", "polite");

    timeline.forEach((item, index) => {
        const button = document.createElement("button");
        const date = document.createElement("span");
        const title = document.createElement("strong");

        button.type = "button";
        button.className = "timeline-step";
        button.dataset.timelineIndex = String(index);

        date.textContent = item.date;
        title.textContent = item.title;
        button.append(date, title);
        button.addEventListener("click", () => setActiveTimelineStep(container, detail, timeline, index));
        container.appendChild(button);
    });

    container.appendChild(detail);
    setActiveTimelineStep(container, detail, timeline, 0);
}

function setActiveTimelineStep(container, detail, timeline, activeIndex) {
    container.querySelectorAll(".timeline-step").forEach((step) => {
        const isActive = Number(step.dataset.timelineIndex) === activeIndex;
        step.classList.toggle("is-active", isActive);
        step.setAttribute("aria-current", isActive ? "step" : "false");
    });

    const item = timeline[activeIndex];
    detail.innerHTML = "";

    const title = document.createElement("strong");
    const description = document.createElement("p");

    title.textContent = `${item.date} · ${item.title}`;
    description.textContent = item.description;

    detail.append(title, description);
}
