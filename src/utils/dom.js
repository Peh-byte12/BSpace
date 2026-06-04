export function byId(id) {
    return document.getElementById(id);
}

export function setText(id, text) {
    const element = byId(id);

    if (element) {
        element.textContent = text;
    }
}

export function createOption(value, text) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = text;
    return option;
}

export function createTextElement(tagName, text, className = "") {
    const element = document.createElement(tagName);
    element.textContent = text;

    if (className) {
        element.className = className;
    }

    return element;
}
