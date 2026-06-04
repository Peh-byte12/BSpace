export function renderMissionGallery({ container, gallery }) {
    if (!container || !gallery?.length) {
        return;
    }

    container.innerHTML = "";

    const stage = document.createElement("figure");
    const image = document.createElement("img");
    const caption = document.createElement("figcaption");
    const thumbs = document.createElement("div");

    stage.className = "mission-gallery-stage";
    image.loading = "lazy";
    image.decoding = "async";
    caption.className = "mission-gallery-caption";
    thumbs.className = "mission-gallery-thumbs";

    stage.append(image, caption);
    container.append(stage, thumbs);

    gallery.forEach((item, index) => {
        const button = document.createElement("button");
        const thumb = document.createElement("img");
        const label = document.createElement("span");

        button.type = "button";
        button.className = "gallery-thumb";
        button.dataset.galleryIndex = String(index);

        thumb.src = item.image;
        thumb.alt = "";
        thumb.loading = "lazy";
        thumb.decoding = "async";
        label.textContent = item.title;

        button.append(thumb, label);
        button.addEventListener("click", () => setActiveGalleryItem({ image, caption, thumbs, gallery, index }));
        thumbs.appendChild(button);
    });

    setActiveGalleryItem({ image, caption, thumbs, gallery, index: 0 });
}

function setActiveGalleryItem({ image, caption, thumbs, gallery, index }) {
    const item = gallery[index];

    image.src = item.image;
    image.alt = item.title;
    caption.textContent = item.caption;

    thumbs.querySelectorAll(".gallery-thumb").forEach((button) => {
        const isActive = Number(button.dataset.galleryIndex) === index;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-current", isActive ? "true" : "false");
    });
}
