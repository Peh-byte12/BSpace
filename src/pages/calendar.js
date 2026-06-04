import { setupAstronomyCalendar } from "../components/astronomy-calendar.js";
import { byId } from "../utils/dom.js";

export function initPage() {
    setupAstronomyCalendar({
        searchInput: byId("calendarSearch"),
        typeFilters: byId("calendarTypeFilters"),
        statsPanel: byId("calendarStats"),
        eventsGrid: byId("calendarEvents"),
        detailsPanel: byId("calendarDetails"),
        emptyState: byId("calendarEmpty")
    });
}
