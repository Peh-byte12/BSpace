import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = document.getElementById('planeta3d');

if (!container) {
  throw new Error('Container #planeta3d nao encontrado.');
}

const anotacoesPlanetas = {
  mercurio: [
    { numero: 1, texto: 'Crateras', posicao: [-0.68, 0.46, 1.15] },
    { numero: 2, texto: 'Bacia Caloris', posicao: [0.36, 0.08, 1.28] },
    { numero: 3, texto: 'Escarpas', posicao: [0.86, -0.38, 0.9] }
  ],
  venus: [
    { numero: 1, texto: 'Atmosfera densa', posicao: [-0.58, 0.56, 1.12] },
    { numero: 2, texto: 'Nuvens acidas', posicao: [0.38, 0.12, 1.27] },
    { numero: 3, texto: 'Superficie vulcanica', posicao: [0.78, -0.48, 0.95] }
  ],
  terra: [
    { numero: 1, texto: 'Oceanos', posicao: [-0.72, 0.3, 1.12] },
    { numero: 2, texto: 'Continentes', posicao: [0.28, -0.18, 1.28] },
    { numero: 3, texto: 'Nuvens', posicao: [0.66, 0.58, 0.98] }
  ],
  marte: [
    { numero: 1, texto: 'Solo oxidado', posicao: [-0.64, 0.18, 1.18] },
    { numero: 2, texto: 'Regioes polares', posicao: [0.2, 0.78, 0.98] },
    { numero: 3, texto: 'Crateras', posicao: [0.78, -0.42, 0.98] }
  ],
  jupiter: [
    { numero: 1, texto: 'Faixas atmosfericas', posicao: [-0.72, 0.18, 1.34] },
    { numero: 2, texto: 'Grande Mancha Vermelha', posicao: [0.54, -0.24, 1.3] },
    { numero: 3, texto: 'Zonas claras', posicao: [0.46, 0.5, 1.2] }
  ],
  saturno: [
    { numero: 1, texto: 'Aneis principais', posicao: [-1.78, 0.02, 0.78], limiarVisibilidade: -0.35 },
    { numero: 2, texto: 'Faixas de nuvens', posicao: [0.18, 0.42, 1.18] },
    { numero: 3, texto: 'Divisao dos aneis', posicao: [1.72, -0.08, 0.7], limiarVisibilidade: -0.35 }
  ],
  urano: [
    { numero: 1, texto: 'Atmosfera azulada', posicao: [-0.58, 0.32, 1.18] },
    { numero: 2, texto: 'Inclinacao axial', posicao: [0.18, 0.72, 1.02] },
    { numero: 3, texto: 'Nuvens de metano', posicao: [0.78, -0.34, 0.98] }
  ],
  netuno: [
    { numero: 1, texto: 'Atmosfera azul', posicao: [-0.62, 0.22, 1.2] },
    { numero: 2, texto: 'Ventos intensos', posicao: [0.48, 0.34, 1.16] },
    { numero: 3, texto: 'Nuvens de metano', posicao: [0.72, -0.42, 0.96] }
  ]
};

const modelos3d = {
  mercurio: {
    nome: 'Mercurio',
    arquivo: './assets/models/mercury.glb',
    tamanho: 2.55,
    velocidade: 0.0038,
    anotacoes: anotacoesPlanetas.mercurio
  },
  venus: {
    nome: 'Venus',
    arquivo: './assets/models/venus.glb',
    tamanho: 2.7,
    velocidade: 0.0035,
    anotacoes: anotacoesPlanetas.venus
  },
  terra: {
    nome: 'Terra',
    arquivo: './assets/models/earth.glb',
    tamanho: 2.6,
    velocidade: 0.004,
    anotacoes: anotacoesPlanetas.terra
  },
  marte: {
    nome: 'Marte',
    arquivo: './assets/models/marte.glb',
    tamanho: 2.7,
    velocidade: 0.004,
    anotacoes: anotacoesPlanetas.marte
  },
  jupiter: {
    nome: 'Jupiter',
    arquivo: './assets/models/jupiter.glb',
    tamanho: 3.1,
    velocidade: 0.003,
    anotacoes: anotacoesPlanetas.jupiter
  },
  saturno: {
    nome: 'Saturno',
    arquivo: './assets/models/saturno.glb',
    tamanho: 3.35,
    velocidade: 0.003,
    exposicao: 0.92,
    anotacoes: anotacoesPlanetas.saturno,
    luzes: {
      hemisferio: 2.2,
      ambiente: 0.18,
      principal: 2.9,
      preenchimento: 0.9,
      contorno: 0.45,
      corChao: 0x4a463c
    }
  },
  urano: {
    nome: 'Urano',
    arquivo: './assets/models/uranus.glb',
    tamanho: 2.7,
    velocidade: 0.0034,
    anotacoes: anotacoesPlanetas.urano
  },
  netuno: {
    nome: 'Netuno',
    arquivo: './assets/models/neptune.glb',
    tamanho: 2.7,
    velocidade: 0.0034,
    anotacoes: anotacoesPlanetas.netuno
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
  renderer.toneMappingExposure = modeloAtual.exposicao ?? 1;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const camadaMarcadores = document.createElement('div');
  camadaMarcadores.className = 'planet-callouts';
  camadaMarcadores.setAttribute('aria-hidden', 'true');
  camadaMarcadores.hidden = true;
  container.appendChild(camadaMarcadores);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 3.4;
  controls.maxDistance = 7;

  configurarLuzes(scene);

  let planeta;
  let grupoPlaneta;
  let marcadores = [];

  function resizeRenderer() {
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 500;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    aplicarLimitesDeZoom();
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

  function calcularDistanciaSegura(modelo) {
    const box = new THREE.Box3().setFromObject(modelo);
    const esfera = box.getBoundingSphere(new THREE.Sphere());

    if (!Number.isFinite(esfera.radius) || esfera.radius <= 0) {
      return controls.minDistance;
    }

    const campoVertical = THREE.MathUtils.degToRad(camera.fov);
    const campoHorizontal = 2 * Math.atan(Math.tan(campoVertical / 2) * camera.aspect);
    const campoLimitante = Math.min(campoVertical, campoHorizontal);
    const margem = modeloAtual.margemZoom || 1.12;

    return (esfera.radius / Math.sin(campoLimitante / 2)) * margem;
  }

  function moverCameraParaDistancia(distancia) {
    const direcao = camera.position.clone().sub(controls.target);

    if (direcao.lengthSq() === 0) {
      direcao.set(0, 0, 1);
    }

    direcao.normalize();
    camera.position.copy(controls.target).addScaledVector(direcao, distancia);
  }

  function aplicarLimitesDeZoom() {
    if (!grupoPlaneta) {
      return;
    }

    const distanciaMinima = Math.max(3.4, calcularDistanciaSegura(grupoPlaneta));
    const distanciaMaxima = Math.max(distanciaMinima + 2.1, distanciaMinima * 1.45);
    const distanciaAtual = camera.position.distanceTo(controls.target);

    controls.minDistance = distanciaMinima;
    controls.maxDistance = distanciaMaxima;

    if (distanciaAtual < controls.minDistance) {
      moverCameraParaDistancia(controls.minDistance);
    } else if (distanciaAtual > controls.maxDistance) {
      moverCameraParaDistancia(controls.maxDistance);
    }

    controls.update();
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

  async function aplicarTexturasSpecularGlossiness(gltf) {
    const parser = gltf.parser;
    const materiaisJson = parser?.json?.materials || [];

    if (!parser || materiaisJson.length === 0) {
      return;
    }

    const materiaisPorNome = new Map(
      materiaisJson
        .filter((material) => material.name)
        .map((material) => [material.name, material])
    );

    const promessas = [];

    paraCadaMaterial(gltf.scene, (material) => {
      if (material.map) {
        return;
      }

      const materialJson = materiaisPorNome.get(material.name);
      const textura = materialJson?.extensions?.KHR_materials_pbrSpecularGlossiness?.diffuseTexture;

      if (typeof textura?.index !== 'number') {
        return;
      }

      promessas.push(
        parser.getDependency('texture', textura.index).then((mapa) => {
          mapa.colorSpace = THREE.SRGBColorSpace;
          material.map = mapa;

          if ('color' in material) {
            material.color.set(0xffffff);
          }

          material.needsUpdate = true;
        })
      );
    });

    await Promise.all(promessas);
  }

  function substituirMaterial(mesh, index, material) {
    if (Array.isArray(mesh.material)) {
      mesh.material[index] = material;
    } else {
      mesh.material = material;
    }
  }

  function ehParteDosAneis(material, mesh) {
    const nome = `${material.name || ''} ${mesh.name || ''}`.toLowerCase();
    return nome.includes('ring') || nome.includes('anel');
  }

  function ajustarMaterialDosAneis(material, mesh, index) {
    const materialAneis = material.clone();

    materialAneis.side = THREE.DoubleSide;
    materialAneis.transparent = true;
    materialAneis.opacity = Math.min(material.opacity || 0.72, 0.78);
    materialAneis.depthWrite = false;
    materialAneis.alphaTest = 0.03;

    if (materialAneis.map) {
      materialAneis.map.colorSpace = THREE.SRGBColorSpace;
    }

    if ('color' in materialAneis) {
      materialAneis.color.set(0xffffff);
    }

    if ('emissive' in materialAneis) {
      materialAneis.emissive.set(0x000000);
      materialAneis.emissiveIntensity = 0;
    }

    if ('roughness' in materialAneis) {
      materialAneis.roughness = 0.86;
    }

    if ('metalness' in materialAneis) {
      materialAneis.metalness = 0;
    }

    materialAneis.needsUpdate = true;
    mesh.renderOrder = 2;
    substituirMaterial(mesh, index, materialAneis);
  }

  function ajustarMaterialDoCorpoSaturno(material) {
    material.side = THREE.FrontSide;

    if ('color' in material) {
      material.color.set(0xffffff);
    }

    if ('aoMapIntensity' in material) {
      material.aoMapIntensity = 0.9;
    }

    if ('emissive' in material) {
      material.emissive.set(0x000000);
      material.emissiveIntensity = 0;
    }

    if ('roughness' in material) {
      material.roughness = 0.88;
    }

    if ('metalness' in material) {
      material.metalness = 0;
    }

    material.needsUpdate = true;
  }

  function ajustarMateriaisSaturno(modelo) {
    paraCadaMaterial(modelo, (material, mesh, index) => {
      if (ehParteDosAneis(material, mesh)) {
        ajustarMaterialDosAneis(material, mesh, index);
        return;
      }

      ajustarMaterialDoCorpoSaturno(material);
    });
  }

  function aplicarAjustesDoModelo(modelo) {
    ajustarTexturas(modelo);

    if (chavePlaneta === 'saturno') {
      ajustarMateriaisSaturno(modelo);
    }
  }

  function limparMarcadores() {
    marcadores.forEach(({ elemento }) => elemento.remove());
    marcadores = [];
    camadaMarcadores.hidden = true;
  }

  function criarElementoMarcador(anotacao, index) {
    const elemento = document.createElement('div');
    elemento.className = 'planet-callout';

    const numero = document.createElement('span');
    numero.className = 'planet-callout-number';
    numero.textContent = anotacao.numero || index + 1;

    const texto = document.createElement('span');
    texto.className = 'planet-callout-text';
    texto.textContent = anotacao.texto;

    elemento.append(numero, texto);
    camadaMarcadores.appendChild(elemento);

    return elemento;
  }

  function criarMarcadores(grupo, anotacoes = []) {
    limparMarcadores();

    if (anotacoes.length === 0) {
      return;
    }

    marcadores = anotacoes.map((anotacao, index) => {
      const ponto = new THREE.Object3D();
      ponto.position.set(...anotacao.posicao);
      grupo.add(ponto);

      return {
        ponto,
        elemento: criarElementoMarcador(anotacao, index),
        limiarVisibilidade: anotacao.limiarVisibilidade ?? -0.05
      };
    });

    camadaMarcadores.hidden = false;
  }

  function limitarCoordenada(valor, metadeElemento, limite) {
    const margem = 8;
    const minimo = metadeElemento + margem;
    const maximo = limite - metadeElemento - margem;

    if (minimo > maximo) {
      return limite / 2;
    }

    return Math.min(Math.max(valor, minimo), maximo);
  }

  function atualizarMarcadores() {
    if (!grupoPlaneta || marcadores.length === 0) {
      return;
    }

    const largura = renderer.domElement.clientWidth;
    const altura = renderer.domElement.clientHeight;
    const centro = new THREE.Vector3();
    grupoPlaneta.getWorldPosition(centro);

    marcadores.forEach(({ ponto, elemento, limiarVisibilidade }) => {
      const posicaoMundo = new THREE.Vector3();
      ponto.getWorldPosition(posicaoMundo);

      const normal = posicaoMundo.clone().sub(centro).normalize();
      const direcaoCamera = camera.position.clone().sub(posicaoMundo).normalize();
      const estaNaFrente = normal.dot(direcaoCamera) > limiarVisibilidade;

      const posicaoTela = posicaoMundo.clone().project(camera);
      const estaNoQuadro = posicaoTela.z > -1 && posicaoTela.z < 1 && Math.abs(posicaoTela.x) < 1.15 && Math.abs(posicaoTela.y) < 1.15;

      if (!estaNaFrente || !estaNoQuadro) {
        elemento.hidden = true;
        return;
      }

      const x = (posicaoTela.x * 0.5 + 0.5) * largura;
      const y = (-posicaoTela.y * 0.5 + 0.5) * altura;

      elemento.hidden = false;
      const xSeguro = limitarCoordenada(x, elemento.offsetWidth / 2, largura);
      const ySeguro = limitarCoordenada(y, elemento.offsetHeight / 2, altura);

      elemento.style.transform = `translate3d(${xSeguro}px, ${ySeguro}px, 0) translate(-50%, -50%)`;
      elemento.style.zIndex = `${Math.round((1 - posicaoTela.z) * 1000)}`;
    });
  }

  async function prepararModelo(gltf) {
    planeta = gltf.scene;
    await aplicarTexturasSpecularGlossiness(gltf);
    centralizarModelo(planeta);
    aplicarAjustesDoModelo(planeta);
    grupoPlaneta = new THREE.Group();
    grupoPlaneta.add(planeta);
    scene.add(grupoPlaneta);
    aplicarLimitesDeZoom();
    criarMarcadores(grupoPlaneta, modeloAtual.anotacoes);
    container.classList.add('is-loaded');
  }

  const loader = new GLTFLoader();

  loader.load(
    modeloAtual.arquivo,
    (gltf) => {
      prepararModelo(gltf).catch((error) => {
        console.error('Nao foi possivel preparar o modelo 3D:', error);
        container.classList.add('has-error');
      });
    },
    undefined,
    (error) => {
      console.error('Nao foi possivel carregar o modelo 3D:', error);
      container.classList.add('has-error');
    }
  );

  function animate() {
    requestAnimationFrame(animate);

    if (grupoPlaneta) {
      grupoPlaneta.rotation.y += modeloAtual.velocidade;
    }

    controls.update();
    atualizarMarcadores();
    renderer.render(scene, camera);
  }

  resizeRenderer();
  window.addEventListener('resize', resizeRenderer);
  animate();
}
