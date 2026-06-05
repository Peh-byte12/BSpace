import { DEFAULT_MISSION_SLUG, MISSIONS } from "../data/missions.js";
import { renderMissionCards } from "../components/mission-card.js";
import { renderMissionGallery } from "../components/mission-gallery.js";
import { renderMissionStats } from "../components/mission-stats.js";
import { renderMissionTimeline } from "../components/mission-timeline.js";
import { setupMissionSimulator } from "../components/mission-simulator.js";
import { incrementMissionSimulations } from "../services/exploration-progress-service.js";
import { byId, createTextElement, setText } from "../utils/dom.js";

let selectedMissionSlug = DEFAULT_MISSION_SLUG;

export function initPage() {
    renderMissionExperience(selectedMissionSlug);

    setupMissionSimulator({
        targetId: "missionTarget",
        typeId: "missionType",
        buttonId: "launchMission",
        outputId: "missionResult",
        onSimulate: incrementMissionSimulations
    });
}

function renderMissionExperience(slug) {
    const mission = MISSIONS.find((item) => item.slug === slug) || MISSIONS[0];

    selectedMissionSlug = mission.slug;
    renderMissionBanner(mission);
    renderMissionCards({
        container: byId("missionCards"),
        missions: MISSIONS,
        selectedSlug: selectedMissionSlug,
        onSelect: renderMissionExperience
    });
    renderMissionStats({
        container: byId("missionStats"),
        stats: mission.stats
    });
    renderMissionTimeline({
        container: byId("missionTimeline"),
        timeline: mission.timeline
    });
    renderMissionCrew(mission);
    renderList("missionObjectives", mission.objectives);
    renderList("missionTechnologies", mission.technologies);
    renderList("missionResults", mission.results);
    renderMissionGallery({
        container: byId("missionGallery"),
        gallery: mission.gallery
    });
}

function renderMissionBanner(mission) {
    setText("missionEyebrow", mission.eyebrow);
    setText("missionTitle", mission.name);
    setText("missionTagline", mission.tagline);

    const image = byId("missionBannerImage");
    const banner = byId("missionBanner");

    if (image) {
        image.src = mission.bannerImage;
        image.alt = "";
        image.loading = "eager";
        image.decoding = "async";
        image.fetchPriority = "high";
    }

    if (banner) {
        banner.style.setProperty("--mission-banner-image", `url("${mission.bannerImage}")`);
    }
}

function renderMissionCrew(mission) {
    const container = byId("missionCrew");

    if (!container) {
        return;
    }

    container.innerHTML = "";
    mission.crew.forEach((member) => {
        const item = document.createElement("article");
        item.className = "crew-card";
        item.append(
            createTextElement("span", member.role),
            createTextElement("strong", member.name)
        );
        container.appendChild(item);
    });
}

function renderList(containerId, items) {
    const container = byId(containerId);

    if (!container) {
        return;
    }

    container.innerHTML = "";
    items.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        container.appendChild(listItem);
    });
}
