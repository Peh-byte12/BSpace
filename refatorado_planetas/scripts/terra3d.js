import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = document.getElementById('planeta3d');

if (!container) {
  throw new Error('Container #planeta3d nao encontrado.');
}

const modelos3d = {
  venus: {
    nome: 'Venus',
    arquivo: './assets/models/venus.glb',
    tamanho: 2.7,
    velocidade: 0.0035
  },
  terra: {
    nome: 'Terra',
    arquivo: './assets/models/earth.glb',
    tamanho: 2.6,
    velocidade: 0.004
  },
  marte: {
    nome: 'Marte',
    arquivo: './assets/models/marte.glb',
    tamanho: 2.7,
    velocidade: 0.004
  },
  jupiter: {
    nome: 'Jupiter',
    arquivo: './assets/models/jupiter.glb',
    tamanho: 3.1,
    velocidade: 0.003
  },
  saturno: {
    nome: 'Saturno',
    arquivo: './assets/models/saturno.glb',
    tamanho: 3.5,
    velocidade: 0.003,
    exposicao: 1.25,
    luzes: {
      hemisferio: 4,
      ambiente: 1.4,
      principal: 4.2,
      preenchimento: 3.2,
      contorno: 1.5,
      corChao: 0x7d725e
    }
  }
};

const parametros = new URLSearchParams(window.location.search);
const chavePlaneta = (parametros.get('nome') || 'terra').toLowerCase();
const modeloAtual = modelos3d[chavePlaneta];

if (!modeloAtual) {
  container.hidden = true;
} else {
  container.setAttribute('aria-label', `Modelo 3D de ${modeloAtual.nome}`);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 4.8);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });

  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.LinearToneMapping;
  renderer.toneMappingExposure = modeloAtual.exposicao || 1;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 2.8;
  controls.maxDistance = 7;

  configurarLuzes(scene);

  let planeta;

  function resizeRenderer() {
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 500;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  function centralizarModelo(modelo) {
    const box = new THREE.Box3().setFromObject(modelo);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maiorLado = Math.max(size.x, size.y, size.z);

    if (maiorLado > 0) {
      const escala = modeloAtual.tamanho / maiorLado;
      modelo.scale.setScalar(escala);
      modelo.position.set(-center.x * escala, -center.y * escala, -center.z * escala);
    }
  }

  function configurarLuzes(cena) {
    const luzes = {
      hemisferio: 2.6,
      ambiente: 0.25,
      principal: 3.5,
      preenchimento: 1.1,
      contorno: 0.6,
      corChao: 0x223366,
      ...modeloAtual.luzes
    };

    cena.add(new THREE.HemisphereLight(0xffffff, luzes.corChao, luzes.hemisferio));
    cena.add(new THREE.AmbientLight(0xffffff, luzes.ambiente));

    const luzPrincipal = new THREE.DirectionalLight(0xffffff, luzes.principal);
    luzPrincipal.position.set(4, 5, 6);
    cena.add(luzPrincipal);

    const luzPreenchimento = new THREE.DirectionalLight(0xfff0d2, luzes.preenchimento);
    luzPreenchimento.position.set(-5, 1.5, 4);
    cena.add(luzPreenchimento);

    const luzContorno = new THREE.DirectionalLight(0x9fc8ff, luzes.contorno);
    luzContorno.position.set(0, 3, -5);
    cena.add(luzContorno);
  }

  function paraCadaMaterial(objeto, callback) {
    objeto.traverse((item) => {
      if (!item.isMesh || !item.material) {
        return;
      }

      const materiais = Array.isArray(item.material) ? item.material : [item.material];
      materiais.forEach((material, index) => callback(material, item, index));
    });
  }

  function ajustarTexturas(modelo) {
    paraCadaMaterial(modelo, (material) => {
      if (material.map) {
        material.map.colorSpace = THREE.SRGBColorSpace;
      }

      material.needsUpdate = true;
    });
  }

  function ajustarMateriaisSaturno(modelo) {
    paraCadaMaterial(modelo, (material, mesh, index) => {
      const nome = `${material.name || ''} ${mesh.name || ''}`.toLowerCase();
      const ehAneis = nome.includes('ring');

      if (ehAneis) {
        if (material.map) {
          material.map.colorSpace = THREE.SRGBColorSpace;
        }

        const materialAneis = new THREE.MeshBasicMaterial({
          map: material.map || null,
          color: new THREE.Color(2.8, 2.45, 1.8),
          transparent: true,
          opacity: Math.max(material.opacity || 0.72, 0.72),
          side: THREE.DoubleSide,
          depthWrite: false,
          alphaTest: 0.02
        });

        if (Array.isArray(mesh.material)) {
          mesh.material[index] = materialAneis;
        } else {
          mesh.material = materialAneis;
        }

        mesh.renderOrder = 2;
        return;
      }

      material.side = THREE.DoubleSide;

      if ('aoMapIntensity' in material) {
        material.aoMapIntensity = 0.25;
      }

      if ('emissive' in material) {
        material.emissive.set(0x352613);
        material.emissiveIntensity = 0.22;
      }

      material.needsUpdate = true;
    });
  }

  function aplicarAjustesDoModelo(modelo) {
    ajustarTexturas(modelo);

    if (chavePlaneta === 'saturno') {
      ajustarMateriaisSaturno(modelo);
    }
  }

  const loader = new GLTFLoader();

  loader.load(
    modeloAtual.arquivo,
    (gltf) => {
      planeta = gltf.scene;
      centralizarModelo(planeta);
      aplicarAjustesDoModelo(planeta);
      scene.add(planeta);
      container.classList.add('is-loaded');
    },
    undefined,
    (error) => {
      console.error('Nao foi possivel carregar o modelo 3D:', error);
      container.classList.add('has-error');
    }
  );

  function animate() {
    requestAnimationFrame(animate);

    if (planeta) {
      planeta.rotation.y += modeloAtual.velocidade;
    }

    controls.update();
    renderer.render(scene, camera);
  }

  resizeRenderer();
  window.addEventListener('resize', resizeRenderer);
  animate();
}
