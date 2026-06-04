export function formatNumber(value) {
    return new Intl.NumberFormat("pt-BR").format(value);
}

export function formatTime(minutes) {
    if (minutes < 60) {
        return `${minutes.toFixed(1).replace(".", ",")} minutos`;
    }

    const hours = minutes / 60;
    return `${hours.toFixed(1).replace(".", ",")} horas`;
}

export function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}
