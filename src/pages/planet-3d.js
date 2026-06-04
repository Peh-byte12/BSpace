import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createPlanetViewerUI } from "../components/planet-viewer-ui.js";
import { getPlanetBySlug } from "../services/planet-service.js";

const container = document.getElementById("planeta3d");

if (container) {
    const params = new URLSearchParams(window.location.search);
    const planetSlug = (params.get("nome") || "terra").toLowerCase();
    const planet = getPlanetBySlug(planetSlug);
    const currentModel = planet?.modelo3d;

    if (!currentModel) {
        container.hidden = true;
    } else {
        initPlanet3D({ container, planet, currentModel, planetSlug });
    }
}

function initPlanet3D({ container, planet, currentModel, planetSlug }) {
    container.setAttribute("aria-label", `Modelo 3D de ${planet.nome}`);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    const clock = new THREE.Clock();
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });

    camera.position.set(0, 0, 4.8);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = currentModel.exposicao ?? 1;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, currentModel.pixelRatio || 1.75));
    container.appendChild(renderer.domElement);

    const markerLayer = document.createElement("div");
    markerLayer.className = "planet-callouts";
    markerLayer.setAttribute("aria-label", "Hotspots informativos do planeta");
    container.appendChild(markerLayer);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 3.4;
    controls.maxDistance = 7;
    controls.zoomSpeed = 0.75;
    controls.rotateSpeed = 0.72;

    let planetObject;
    let planetGroup;
    let animationFrameId;
    let resizeObserver;
    let visibilityObserver;
    let markers = [];
    let activeMarkerIndex = 0;
    let autoRotationEnabled = true;
    let isHotspotInteractionPaused = false;
    let shouldRender = true;
    let isContainerVisible = true;
    let isDocumentVisible = !document.hidden;
    let isDisposed = false;
    let usesWindowResize = false;

    const ui = createPlanetViewerUI({
        container,
        planet,
        onZoomIn: () => zoomBy(0.88),
        onZoomOut: () => zoomBy(1.14),
        onZoomLevel: setZoomFromPercent,
        onResetView: resetView,
        onToggleRotation: toggleRotation,
        onToggleFullscreen: toggleFullscreen
    });

    ui.setRotationActive(autoRotationEnabled);
    setupLights(scene, currentModel);
    setupObservers();
    setupFullscreenState();
    loadModel();
    resizeRenderer();
    animate();

    function loadModel() {
        const loader = new GLTFLoader();

        loader.load(
            currentModel.arquivo,
            (gltf) => {
                prepareModel(gltf).catch((error) => {
                    console.error("Não foi possível preparar o modelo 3D:", error);
                    ui.setError("O modelo foi baixado, mas não pôde ser preparado.");
                });
            },
            (event) => {
                if (event.lengthComputable && event.total > 0) {
                    ui.setLoadingProgress((event.loaded / event.total) * 100);
                    return;
                }

                ui.setLoadingProgress(null, "Baixando modelo 3D");
            },
            (error) => {
                console.error("Não foi possível carregar o modelo 3D:", error);
                ui.setError("Verifique se o arquivo GLB está disponível.");
            }
        );
    }

    async function prepareModel(gltf) {
        planetObject = gltf.scene;
        await applySpecularGlossinessTextures(gltf);
        centerModel(planetObject);
        applyModelAdjustments(planetObject);

        planetGroup = new THREE.Group();
        planetGroup.add(planetObject);
        scene.add(planetGroup);

        applyZoomLimits();
        resetView();
        createMarkers(planetGroup, currentModel.anotacoes);
        selectMarker(0);
        ui.setLoaded();
    }

    function resizeRenderer() {
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || 500;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
        applyZoomLimits();
        updateZoomUI();
    }

    function centerModel(model) {
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const largestSide = Math.max(size.x, size.y, size.z);

        if (largestSide > 0) {
            const scale = currentModel.tamanho / largestSide;
            model.scale.setScalar(scale);
            model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
        }
    }

    function calculateSafeDistance(model) {
        const box = new THREE.Box3().setFromObject(model);
        const sphere = box.getBoundingSphere(new THREE.Sphere());

        if (!Number.isFinite(sphere.radius) || sphere.radius <= 0) {
            return controls.minDistance;
        }

        const verticalFov = THREE.MathUtils.degToRad(camera.fov);
        const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
        const limitingFov = Math.min(verticalFov, horizontalFov);
        const margin = currentModel.margemZoom || 1.12;

        return (sphere.radius / Math.sin(limitingFov / 2)) * margin;
    }

    function moveCameraToDistance(distance) {
        const direction = camera.position.clone().sub(controls.target);

        if (direction.lengthSq() === 0) {
            direction.set(0, 0, 1);
        }

        direction.normalize();
        camera.position.copy(controls.target).addScaledVector(direction, distance);
        controls.update();
        updateZoomUI();
    }

    function applyZoomLimits() {
        if (!planetGroup) {
            return;
        }

        const minDistance = Math.max(3.4, calculateSafeDistance(planetGroup));
        const maxDistance = Math.max(minDistance + 2.1, minDistance * 1.45);
        const currentDistance = camera.position.distanceTo(controls.target);

        controls.minDistance = minDistance;
        controls.maxDistance = maxDistance;

        if (currentDistance < controls.minDistance) {
            moveCameraToDistance(controls.minDistance);
        } else if (currentDistance > controls.maxDistance) {
            moveCameraToDistance(controls.maxDistance);
        }
    }

    function zoomBy(multiplier) {
        const currentDistance = camera.position.distanceTo(controls.target);
        const nextDistance = THREE.MathUtils.clamp(
            currentDistance * multiplier,
            controls.minDistance,
            controls.maxDistance
        );

        moveCameraToDistance(nextDistance);
    }

    function setZoomFromPercent(percent) {
        const normalized = THREE.MathUtils.clamp(percent / 100, 0, 1);
        const distance = THREE.MathUtils.lerp(controls.maxDistance, controls.minDistance, normalized);
        moveCameraToDistance(distance);
    }

    function getZoomPercent() {
        const distance = camera.position.distanceTo(controls.target);
        const range = controls.maxDistance - controls.minDistance;

        if (range <= 0) {
            return 50;
        }

        return ((controls.maxDistance - distance) / range) * 100;
    }

    function updateZoomUI() {
        ui.setZoomPercent(getZoomPercent());
    }

    function resetView() {
        if (!planetGroup) {
            return;
        }

        controls.target.set(0, 0, 0);
        moveCameraToDistance((controls.minDistance + controls.maxDistance) / 2);
        planetGroup.rotation.set(0, 0, 0);
        selectMarker(activeMarkerIndex);
    }

    function toggleRotation() {
        autoRotationEnabled = !autoRotationEnabled;
        ui.setRotationActive(autoRotationEnabled);
    }

    function toggleFullscreen() {
        if (document.fullscreenElement === container) {
            document.exitFullscreen?.();
            return;
        }

        container.requestFullscreen?.();
    }

    function setupFullscreenState() {
        document.addEventListener("fullscreenchange", handleFullscreenChange);
    }

    function setupObservers() {
        if ("ResizeObserver" in window) {
            resizeObserver = new ResizeObserver(resizeRenderer);
            resizeObserver.observe(container);
        } else {
            usesWindowResize = true;
            window.addEventListener("resize", resizeRenderer);
        }

        if ("IntersectionObserver" in window) {
            visibilityObserver = new IntersectionObserver((entries) => {
                isContainerVisible = entries[0]?.isIntersecting ?? true;
                updateRenderState();
            }, { threshold: 0.08 });
            visibilityObserver.observe(container);
        }

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("pagehide", disposeViewer, { once: true });
    }

    function handleFullscreenChange() {
        ui.setFullscreenActive(document.fullscreenElement === container);
        updateRenderState();
        window.setTimeout(resizeRenderer, 80);
    }

    function handleVisibilityChange() {
        isDocumentVisible = !document.hidden;
        updateRenderState();
    }

    function updateRenderState() {
        shouldRender = (isContainerVisible && isDocumentVisible) || document.fullscreenElement === container;
    }

    function forEachMaterial(object, callback) {
        object.traverse((item) => {
            if (!item.isMesh || !item.material) {
                return;
            }

            const materials = Array.isArray(item.material) ? item.material : [item.material];
            materials.forEach((material, index) => callback(material, item, index));
        });
    }

    function adjustTextures(model) {
        const maxAnisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);

        forEachMaterial(model, (material) => {
            if (material.map) {
                material.map.colorSpace = THREE.SRGBColorSpace;
                material.map.anisotropy = maxAnisotropy;
            }

            material.needsUpdate = true;
        });
    }

    async function applySpecularGlossinessTextures(gltf) {
        const parser = gltf.parser;
        const jsonMaterials = parser?.json?.materials || [];

        if (!parser || jsonMaterials.length === 0) {
            return;
        }

        const materialsByName = new Map(
            jsonMaterials
                .filter((material) => material.name)
                .map((material) => [material.name, material])
        );

        const promises = [];

        forEachMaterial(gltf.scene, (material) => {
            if (material.map) {
                return;
            }

            const jsonMaterial = materialsByName.get(material.name);
            const texture = jsonMaterial?.extensions?.KHR_materials_pbrSpecularGlossiness?.diffuseTexture;

            if (typeof texture?.index !== "number") {
                return;
            }

            promises.push(
                parser.getDependency("texture", texture.index).then((map) => {
                    map.colorSpace = THREE.SRGBColorSpace;
                    material.map = map;

                    if ("color" in material) {
                        material.color.set(0xffffff);
                    }

                    material.needsUpdate = true;
                })
            );
        });

        await Promise.all(promises);
    }

    function replaceMaterial(mesh, index, material) {
        if (Array.isArray(mesh.material)) {
            mesh.material[index] = material;
        } else {
            mesh.material = material;
        }
    }

    function isRingPart(material, mesh) {
        const name = `${material.name || ""} ${mesh.name || ""}`.toLowerCase();
        return name.includes("ring") || name.includes("anel");
    }

    function adjustRingMaterial(material, mesh, index) {
        const ringMaterial = material.clone();

        ringMaterial.side = THREE.DoubleSide;
        ringMaterial.transparent = true;
        ringMaterial.opacity = Math.min(material.opacity || 0.72, 0.78);
        ringMaterial.depthWrite = false;
        ringMaterial.alphaTest = 0.03;

        if (ringMaterial.map) {
            ringMaterial.map.colorSpace = THREE.SRGBColorSpace;
        }

        if ("color" in ringMaterial) {
            ringMaterial.color.set(0xffffff);
        }

        if ("emissive" in ringMaterial) {
            ringMaterial.emissive.set(0x000000);
            ringMaterial.emissiveIntensity = 0;
        }

        if ("roughness" in ringMaterial) {
            ringMaterial.roughness = 0.86;
        }

        if ("metalness" in ringMaterial) {
            ringMaterial.metalness = 0;
        }

        ringMaterial.needsUpdate = true;
        mesh.renderOrder = 2;
        replaceMaterial(mesh, index, ringMaterial);
    }

    function adjustSaturnBodyMaterial(material) {
        material.side = THREE.FrontSide;

        if ("color" in material) {
            material.color.set(0xffffff);
        }

        if ("aoMapIntensity" in material) {
            material.aoMapIntensity = 0.9;
        }

        if ("emissive" in material) {
            material.emissive.set(0x000000);
            material.emissiveIntensity = 0;
        }

        if ("roughness" in material) {
            material.roughness = 0.88;
        }

        if ("metalness" in material) {
            material.metalness = 0;
        }

        material.needsUpdate = true;
    }

    function adjustSaturnMaterials(model) {
        forEachMaterial(model, (material, mesh, index) => {
            if (isRingPart(material, mesh)) {
                adjustRingMaterial(material, mesh, index);
                return;
            }

            adjustSaturnBodyMaterial(material);
        });
    }

    function applyModelAdjustments(model) {
        adjustTextures(model);

        if (planetSlug === "saturno") {
            adjustSaturnMaterials(model);
        }
    }

    function clearMarkers() {
        markers.forEach(({ element }) => element.remove());
        markers = [];
        markerLayer.hidden = true;
    }

    function createMarkerElement(annotation, index) {
        const element = document.createElement("button");
        const number = document.createElement("span");
        const text = document.createElement("span");

        element.type = "button";
        element.className = "planet-callout";
        element.setAttribute("aria-label", `Hotspot ${annotation.numero || index + 1}: ${annotation.texto}`);
        element.addEventListener("click", () => selectMarker(index));
        element.addEventListener("pointerenter", () => {
            isHotspotInteractionPaused = true;
        });
        element.addEventListener("pointerleave", () => {
            isHotspotInteractionPaused = false;
        });
        element.addEventListener("focus", () => {
            isHotspotInteractionPaused = true;
        });
        element.addEventListener("blur", () => {
            isHotspotInteractionPaused = false;
        });

        number.className = "planet-callout-number";
        number.textContent = annotation.numero || index + 1;
        text.className = "planet-callout-text";
        text.textContent = annotation.texto;

        element.append(number, text);
        markerLayer.appendChild(element);

        return element;
    }

    function createMarkers(group, annotations = []) {
        clearMarkers();

        if (annotations.length === 0) {
            return;
        }

        markers = annotations.map((annotation, index) => {
            const point = new THREE.Object3D();
            point.position.set(...annotation.posicao);
            group.add(point);

            return {
                annotation,
                point,
                element: createMarkerElement(annotation, index),
                visibilityThreshold: annotation.limiarVisibilidade ?? -0.05
            };
        });

        markerLayer.hidden = false;
    }

    function selectMarker(index) {
        const marker = markers[index];

        if (!marker) {
            return;
        }

        activeMarkerIndex = index;
        markers.forEach(({ element }, markerIndex) => {
            const isActive = markerIndex === index;
            element.classList.toggle("is-active", isActive);
            element.setAttribute("aria-pressed", String(isActive));
        });
        ui.setHotspotInfo(marker.annotation, index);
    }

    function limitCoordinate(value, halfElement, limit) {
        const margin = 8;
        const min = halfElement + margin;
        const max = limit - halfElement - margin;

        if (min > max) {
            return limit / 2;
        }

        return Math.min(Math.max(value, min), max);
    }

    function updateMarkers() {
        if (!planetGroup || markers.length === 0) {
            return;
        }

        const width = renderer.domElement.clientWidth;
        const height = renderer.domElement.clientHeight;
        const center = new THREE.Vector3();
        planetGroup.getWorldPosition(center);

        markers.forEach(({ point, element, visibilityThreshold }) => {
            const worldPosition = new THREE.Vector3();
            point.getWorldPosition(worldPosition);

            const normal = worldPosition.clone().sub(center).normalize();
            const cameraDirection = camera.position.clone().sub(worldPosition).normalize();
            const isInFront = normal.dot(cameraDirection) > visibilityThreshold;
            const screenPosition = worldPosition.clone().project(camera);
            const isInFrame = screenPosition.z > -1 && screenPosition.z < 1 && Math.abs(screenPosition.x) < 1.15 && Math.abs(screenPosition.y) < 1.15;

            if (!isInFront || !isInFrame) {
                element.hidden = true;
                return;
            }

            const x = (screenPosition.x * 0.5 + 0.5) * width;
            const y = (-screenPosition.y * 0.5 + 0.5) * height;

            element.hidden = false;
            const safeX = limitCoordinate(x, element.offsetWidth / 2, width);
            const safeY = limitCoordinate(y, element.offsetHeight / 2, height);

            element.style.transform = `translate3d(${safeX}px, ${safeY}px, 0) translate(-50%, -50%)`;
            element.style.zIndex = `${Math.round((1 - screenPosition.z) * 1000)}`;
        });
    }

    function animate() {
        if (isDisposed) {
            return;
        }

        animationFrameId = requestAnimationFrame(animate);

        if (!shouldRender || document.hidden) {
            return;
        }

        const delta = Math.min(clock.getDelta(), 0.05);

        if (planetGroup && autoRotationEnabled && !isHotspotInteractionPaused) {
            planetGroup.rotation.y += currentModel.velocidade * delta * 60;
        }

        controls.update();
        updateMarkers();
        updateZoomUI();
        renderer.render(scene, camera);
    }

    function disposeViewer() {
        isDisposed = true;
        window.cancelAnimationFrame(animationFrameId);
        resizeObserver?.disconnect();
        visibilityObserver?.disconnect();
        document.removeEventListener("fullscreenchange", handleFullscreenChange);
        document.removeEventListener("visibilitychange", handleVisibilityChange);

        if (usesWindowResize) {
            window.removeEventListener("resize", resizeRenderer);
        }

        controls.dispose();

        if (planetObject) {
            disposeObject(planetObject);
        }

        renderer.dispose();
    }
}

function setupLights(scene, currentModel) {
    const lights = {
        hemisferio: 2.6,
        ambiente: 0.25,
        principal: 3.5,
        preenchimento: 1.1,
        contorno: 0.6,
        corChao: 0x223366,
        ...currentModel.luzes
    };

    scene.add(new THREE.HemisphereLight(0xffffff, lights.corChao, lights.hemisferio));
    scene.add(new THREE.AmbientLight(0xffffff, lights.ambiente));

    const mainLight = new THREE.DirectionalLight(0xffffff, lights.principal);
    mainLight.position.set(4, 5, 6);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xfff0d2, lights.preenchimento);
    fillLight.position.set(-5, 1.5, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x9fc8ff, lights.contorno);
    rimLight.position.set(0, 3, -5);
    scene.add(rimLight);
}

function disposeObject(object) {
    object.traverse((item) => {
        if (!item.isMesh) {
            return;
        }

        item.geometry?.dispose();

        const materials = Array.isArray(item.material) ? item.material : [item.material];
        materials.forEach((material) => {
            Object.values(material).forEach((value) => {
                if (value?.isTexture) {
                    value.dispose();
                }
            });
            material.dispose();
        });
    });
}
