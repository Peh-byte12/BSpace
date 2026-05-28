const planetasBase = {
    mercurio: {
        nome: "Mercúrio",
        tipo: "Rochoso",
        diametro: 4879,
        distancia: 57.9,
        gravidade: 3.7,
        luas: 0,
        resumo: "O menor planeta e o mais próximo do Sol."
    },
    venus: {
        nome: "Vênus",
        tipo: "Rochoso",
        diametro: 12104,
        distancia: 108.2,
        gravidade: 8.9,
        luas: 0,
        resumo: "Um planeta quente, com atmosfera extremamente densa."
    },
    terra: {
        nome: "Terra",
        tipo: "Rochoso",
        diametro: 12742,
        distancia: 149.6,
        gravidade: 9.8,
        luas: 1,
        resumo: "Nosso planeta, com água líquida abundante e vida confirmada."
    },
    marte: {
        nome: "Marte",
        tipo: "Rochoso",
        diametro: 6779,
        distancia: 227.9,
        gravidade: 3.7,
        luas: 2,
        resumo: "O planeta vermelho, alvo frequente de missões robóticas."
    },
    jupiter: {
        nome: "Júpiter",
        tipo: "Gigante gasoso",
        diametro: 139820,
        distancia: 778.5,
        gravidade: 24.8,
        luas: 95,
        resumo: "O maior planeta do Sistema Solar, famoso pela Grande Mancha Vermelha."
    },
    saturno: {
        nome: "Saturno",
        tipo: "Gigante gasoso",
        diametro: 116460,
        distancia: 1434,
        gravidade: 10.4,
        luas: 146,
        resumo: "Conhecido pelo sistema de anéis mais marcante do Sistema Solar."
    },
    urano: {
        nome: "Urano",
        tipo: "Gigante gelado",
        diametro: 50724,
        distancia: 2871,
        gravidade: 8.7,
        luas: 28,
        resumo: "Um gigante gelado que gira quase de lado."
    },
    netuno: {
        nome: "Netuno",
        tipo: "Gigante gelado",
        diametro: 49244,
        distancia: 4495,
        gravidade: 11.2,
        luas: 16,
        resumo: "O planeta mais distante do Sol, com ventos muito intensos."
    }
};

const perguntasQuiz = [
    {
        pergunta: "Qual planeta é conhecido como planeta vermelho?",
        opcoes: ["Marte", "Vênus", "Netuno"],
        correta: 0
    },
    {
        pergunta: "Qual planeta tem o sistema de anéis mais famoso?",
        opcoes: ["Mercúrio", "Saturno", "Terra"],
        correta: 1
    },
    {
        pergunta: "Qual é o maior planeta do Sistema Solar?",
        opcoes: ["Júpiter", "Urano", "Marte"],
        correta: 0
    },
    {
        pergunta: "Qual planeta tem vida confirmada até agora?",
        opcoes: ["Terra", "Vênus", "Saturno"],
        correta: 0
    }
];

const estadoUsuario = {
    nome: lerLocal("bspaceProfileName", ""),
    xp: Number(lerLocal("bspaceXp", "0")),
    somAtivo: lerLocal("bspaceSound", "false") === "true"
};

let indicePergunta = 0;
let audioContext;
let toastTimer;

document.addEventListener("DOMContentLoaded", () => {
    configurarCeuEstrelado();
    destacarLinkAtivo();
    configurarBotaoVoltarAoTopo();
    configurarAnoAtual();
    configurarImagensResponsivas();
    configurarPerfilPremium();
    configurarSistemaSolarHome();
    configurarBuscaPlanetas();
    configurarComparadorPlanetas();
    configurarQuizInterativo();
    configurarSimulacaoLuz();
    configurarSimuladorMissoes();
    configurarCuriosidadesAleatorias();
    configurarAnimacaoSuaveDosCards();
});

function configurarCeuEstrelado() {
    const ceus = document.querySelectorAll(".ceu[data-stars]");

    if (ceus.length === 0) {
        return;
    }

    const estrelas = [
        [5, 10, 0.2], [12, 25, 1], [8, 42, 0.5], [18, 60, 1.7], [10, 80, 0.8],
        [22, 15, 1.3], [28, 35, 0.6], [30, 52, 1.8], [24, 72, 0.9], [36, 88, 1.2],
        [42, 8, 0.3], [48, 20, 1.4], [40, 38, 0.7], [55, 50, 1.6], [44, 68, 0.4],
        [52, 82, 1.1], [60, 12, 0.9], [65, 28, 1.5], [58, 44, 0.2], [70, 62, 1.9],
        [74, 78, 0.8], [82, 18, 1.2], [86, 36, 0.5], [80, 54, 1.7], [90, 72, 1],
        [14, 92, 0.6], [32, 95, 1.4], [67, 92, 0.7], [88, 92, 1.6], [50, 96, 0.3]
    ];

    ceus.forEach((ceu) => {
        if (ceu.querySelector(".estrela")) {
            return;
        }

        estrelas.forEach(([top, left, delay]) => {
            const estrela = document.createElement("div");
            estrela.className = "estrela";
            estrela.style.top = `${top}%`;
            estrela.style.left = `${left}%`;
            estrela.style.animationDelay = `${delay}s`;
            ceu.appendChild(estrela);
        });
    });
}

function destacarLinkAtivo() {
    const linksNavegacao = document.querySelectorAll(".nav-links a");
    const paginaAtual = window.location.pathname.split("/").pop() || "index.html";

    linksNavegacao.forEach((link) => {
        const destino = link.getAttribute("href");
        const paginaDestino = destino.split("?")[0];

        if (paginaDestino === paginaAtual || (paginaAtual === "planeta.html" && paginaDestino === "planetas.html")) {
            link.classList.add("ativo");
            link.setAttribute("aria-current", "page");
        }
    });
}

function configurarBotaoVoltarAoTopo() {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "back-to-top";
    botao.id = "backToTop";
    botao.setAttribute("aria-label", "Voltar ao topo da página");
    botao.textContent = "↑";

    document.body.appendChild(botao);

    let aguardandoFrame = false;

    function atualizarEstadoDoBotao() {
        botao.classList.toggle("show", window.scrollY > 250);
    }

    window.addEventListener("scroll", () => {
        if (aguardandoFrame) {
            return;
        }

        aguardandoFrame = true;
        window.requestAnimationFrame(() => {
            atualizarEstadoDoBotao();
            aguardandoFrame = false;
        });
    }, { passive: true });

    atualizarEstadoDoBotao();

    botao.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

function configurarAnoAtual() {
    const elementosAno = document.querySelectorAll("[data-current-year]");
    const anoAtual = new Date().getFullYear();

    elementosAno.forEach((elemento) => {
        elemento.textContent = anoAtual;
    });
}

function configurarImagensResponsivas() {
    document.querySelectorAll("img").forEach((imagem) => {
        if (!imagem.hasAttribute("decoding")) {
            imagem.decoding = "async";
        }

        if (!imagem.closest(".brand") && !imagem.hasAttribute("loading")) {
            imagem.loading = "lazy";
        }
    });
}

function configurarPerfilPremium() {
    const campoNome = document.getElementById("profileName");
    const botaoSalvar = document.getElementById("saveProfile");
    const botaoIA = document.getElementById("aiGuide");
    const botaoSom = document.getElementById("soundToggle");

    if (campoNome && estadoUsuario.nome) {
        campoNome.value = estadoUsuario.nome;
    }

    if (botaoSom) {
        botaoSom.textContent = estadoUsuario.somAtivo ? "Som: ligado" : "Som: desligado";
        botaoSom.setAttribute("aria-pressed", String(estadoUsuario.somAtivo));
    }

    botaoSalvar?.addEventListener("click", () => {
        const nome = campoNome.value.trim() || "Explorador BSpace";
        estadoUsuario.nome = nome;
        salvarLocal("bspaceProfileName", nome);
        adicionarXp(15, "Perfil salvo");
        atualizarPainelUsuario();
    });

    botaoIA?.addEventListener("click", () => {
        const nome = campoNome?.value.trim() || estadoUsuario.nome || "Explorador";
        const nivel = obterNivelDoUsuario();
        const foco = estadoUsuario.xp >= 120 ? "missões e planetas externos" : "planetas rochosos e quiz de curiosidades";
        definirTexto("aiGuideOutput", `${nome}, sua trilha IA sugerida: revise ${foco}, faça uma comparação entre dois planetas e conclua uma simulação de missão. Nível atual: ${nivel}.`);
        adicionarXp(10, "Trilha IA gerada");
    });

    botaoSom?.addEventListener("click", () => {
        estadoUsuario.somAtivo = !estadoUsuario.somAtivo;
        salvarLocal("bspaceSound", String(estadoUsuario.somAtivo));
        botaoSom.textContent = estadoUsuario.somAtivo ? "Som: ligado" : "Som: desligado";
        botaoSom.setAttribute("aria-pressed", String(estadoUsuario.somAtivo));
        tocarSom(620, true);
    });

    atualizarPainelUsuario();
}

function configurarSistemaSolarHome() {
    const container = document.getElementById("solarPlanetButtons");
    const info = document.getElementById("solarPlanetInfo");

    if (!container || !info) {
        return;
    }

    Object.entries(planetasBase).forEach(([chave, planeta], indice) => {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.textContent = planeta.nome;
        botao.addEventListener("click", () => {
            selecionarPlanetaSolar(chave);
        });
        container.appendChild(botao);

        if (indice === 2) {
            botao.classList.add("is-active");
            info.textContent = `${planeta.nome}: ${planeta.resumo}`;
        }
    });
}

function selecionarPlanetaSolar(chave) {
    const planeta = planetasBase[chave];

    if (!planeta) {
        return;
    }

    document.querySelectorAll("#solarPlanetButtons button").forEach((botao) => {
        botao.classList.toggle("is-active", botao.textContent === planeta.nome);
    });

    definirTexto("solarPlanetInfo", `${planeta.nome}: ${planeta.resumo} Distância média do Sol: ${formatarNumero(planeta.distancia)} milhões de km.`);
    tocarSom(440);
}

function configurarBuscaPlanetas() {
    const campoBusca = document.getElementById("planetSearch");
    const cards = document.querySelectorAll("[data-planet-card]");

    if (!campoBusca || cards.length === 0) {
        return;
    }

    campoBusca.addEventListener("input", () => {
        const termo = normalizarTexto(campoBusca.value);

        cards.forEach((card) => {
            const texto = normalizarTexto(card.dataset.search || card.textContent);
            card.classList.toggle("is-hidden", termo.length > 0 && !texto.includes(termo));
        });
    });
}

function configurarComparadorPlanetas() {
    const selectA = document.getElementById("comparePlanetA");
    const selectB = document.getElementById("comparePlanetB");

    if (!selectA || !selectB) {
        return;
    }

    Object.entries(planetasBase).forEach(([chave, planeta]) => {
        selectA.appendChild(criarOpcao(chave, planeta.nome));
        selectB.appendChild(criarOpcao(chave, planeta.nome));
    });

    selectA.value = "terra";
    selectB.value = "jupiter";
    selectA.addEventListener("change", renderizarComparacaoPlanetas);
    selectB.addEventListener("change", renderizarComparacaoPlanetas);
    renderizarComparacaoPlanetas();
}

function renderizarComparacaoPlanetas() {
    const tabela = document.getElementById("planetComparison");
    const selectA = document.getElementById("comparePlanetA");
    const selectB = document.getElementById("comparePlanetB");

    if (!tabela || !selectA || !selectB) {
        return;
    }

    const planetaA = planetasBase[selectA.value];
    const planetaB = planetasBase[selectB.value];

    if (!planetaA || !planetaB) {
        return;
    }

    const linhas = [
        ["Tipo", planetaA.tipo, planetaB.tipo],
        ["Diâmetro", `${formatarNumero(planetaA.diametro)} km`, `${formatarNumero(planetaB.diametro)} km`],
        ["Distância", `${formatarNumero(planetaA.distancia)} mi km`, `${formatarNumero(planetaB.distancia)} mi km`],
        ["Gravidade", `${planetaA.gravidade} m/s²`, `${planetaB.gravidade} m/s²`],
        ["Luas", formatarNumero(planetaA.luas), formatarNumero(planetaB.luas)]
    ];

    tabela.innerHTML = "";
    linhas.forEach(([metrica, valorA, valorB]) => {
        const linha = document.createElement("div");
        linha.className = "comparison-row";
        linha.append(criarSpan(metrica), criarStrong(valorA), criarStrong(valorB));
        tabela.appendChild(linha);
    });

    const maior = planetaA.diametro > planetaB.diametro ? planetaA : planetaB;
    const menor = maior === planetaA ? planetaB : planetaA;
    const proporcao = Math.max(1, Math.round(maior.diametro / menor.diametro));
    definirTexto("planetComparisonInsight", `${maior.nome} tem cerca de ${proporcao} vez(es) o diâmetro de ${menor.nome}.`);
}

function configurarQuizInterativo() {
    const perguntaElemento = document.getElementById("quizQuestion");
    const opcoesElemento = document.getElementById("quizOptions");

    if (!perguntaElemento || !opcoesElemento) {
        return;
    }

    renderizarPerguntaQuiz();
}

function renderizarPerguntaQuiz() {
    const pergunta = perguntasQuiz[indicePergunta % perguntasQuiz.length];
    const perguntaElemento = document.getElementById("quizQuestion");
    const opcoesElemento = document.getElementById("quizOptions");

    if (!perguntaElemento || !opcoesElemento) {
        return;
    }

    perguntaElemento.textContent = pergunta.pergunta;
    opcoesElemento.innerHTML = "";
    definirTexto("quizFeedback", "Cada resposta soma XP ao seu perfil.");

    pergunta.opcoes.forEach((opcao, indice) => {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.textContent = opcao;
        botao.addEventListener("click", () => responderQuiz(indice, botao));
        opcoesElemento.appendChild(botao);
    });
}

function responderQuiz(indiceEscolhido, botaoEscolhido) {
    const pergunta = perguntasQuiz[indicePergunta % perguntasQuiz.length];
    const acertou = indiceEscolhido === pergunta.correta;
    const botoes = document.querySelectorAll("#quizOptions button");

    botoes.forEach((botao, indice) => {
        botao.disabled = true;
        botao.classList.toggle("is-correct", indice === pergunta.correta);
    });

    if (!acertou) {
        botaoEscolhido.classList.add("is-wrong");
    }

    definirTexto("quizFeedback", acertou ? "Resposta correta. +30 XP!" : "Quase. Você ganhou +10 XP por tentar.");
    adicionarXp(acertou ? 30 : 10, acertou ? "Quiz correto" : "Tentativa de quiz");

    window.setTimeout(() => {
        indicePergunta += 1;
        renderizarPerguntaQuiz();
    }, 1300);
}

function configurarSimulacaoLuz() {
    const select = document.getElementById("lightDestination");

    if (!select) {
        return;
    }

    Object.entries(planetasBase).forEach(([chave, planeta]) => {
        select.appendChild(criarOpcao(chave, planeta.nome));
    });

    select.value = "terra";
    select.addEventListener("change", renderizarSimulacaoLuz);
    renderizarSimulacaoLuz();
}

function renderizarSimulacaoLuz() {
    const select = document.getElementById("lightDestination");
    const barra = document.getElementById("lightMeter");

    if (!select || !barra) {
        return;
    }

    const planeta = planetasBase[select.value];
    const maxDistancia = planetasBase.netuno.distancia;
    const minutos = planeta.distancia / 17.987;
    const porcentagem = Math.max(4, (planeta.distancia / maxDistancia) * 100);

    barra.style.width = `${porcentagem}%`;
    definirTexto("lightOutput", `A luz do Sol leva aproximadamente ${formatarTempo(minutos)} para chegar até ${planeta.nome}.`);
    tocarSom(520);
}

function configurarSimuladorMissoes() {
    const destino = document.getElementById("missionTarget");
    const tipo = document.getElementById("missionType");
    const botao = document.getElementById("launchMission");

    if (!destino || !tipo || !botao) {
        return;
    }

    Object.entries(planetasBase).forEach(([chave, planeta]) => {
        destino.appendChild(criarOpcao(chave, planeta.nome));
    });

    destino.value = "marte";
    botao.addEventListener("click", () => {
        const planeta = planetasBase[destino.value];
        const tipoMissao = tipo.value;
        const multiplicadores = {
            sobrevoo: { risco: "baixo", xp: 20, complexidade: 1 },
            orbital: { risco: "médio", xp: 35, complexidade: 1.35 },
            pouso: { risco: "alto", xp: 50, complexidade: 1.8 }
        };
        const config = multiplicadores[tipoMissao];
        const duracao = Math.max(2, Math.round((planeta.distancia / 120) * config.complexidade));

        definirTexto("missionResult", `Missão para ${planeta.nome}: duração estimada de ${duracao} meses, risco ${config.risco} e recompensa de ${config.xp} XP.`);
        adicionarXp(config.xp, "Missão simulada");
    });
}

function configurarCuriosidadesAleatorias() {
    const botaoCuriosidade = document.getElementById("btnCuriosidade");
    const textoCuriosidade = document.getElementById("curiosidadeTexto");

    if (!botaoCuriosidade || !textoCuriosidade) {
        return;
    }

    const curiosidades = [
        "Um dia em Vênus dura mais do que um ano venusiano.",
        "Júpiter é tão grande que caberiam mais de 1.300 Terras dentro dele.",
        "Netuno tem alguns dos ventos mais rápidos já observados no Sistema Solar.",
        "Marte abriga o Monte Olimpo, o maior vulcão conhecido do Sistema Solar.",
        "A luz do Sol leva cerca de 8 minutos e 20 segundos para chegar à Terra.",
        "Saturno é tão pouco denso que, em teoria, flutuaria em uma piscina enorme de água."
    ];

    function mostrarCuriosidadeAleatoria() {
        const indiceAleatorio = Math.floor(Math.random() * curiosidades.length);
        textoCuriosidade.textContent = curiosidades[indiceAleatorio];
        adicionarXp(5, "Curiosidade descoberta");
    }

    botaoCuriosidade.addEventListener("click", mostrarCuriosidadeAleatoria);
}

function configurarAnimacaoSuaveDosCards() {
    const elementosAnimados = document.querySelectorAll("[data-reveal], .feature-card, .planet-card, .topic-card, .section-box, .planet-content, .planet-image");

    if (!("IntersectionObserver" in window) || elementosAnimados.length === 0) {
        return;
    }

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("is-visible");
                observador.unobserve(entrada.target);
            }
        });
    }, {
        threshold: 0.15
    });

    elementosAnimados.forEach((elemento) => {
        elemento.classList.add("js-reveal");
        observador.observe(elemento);
    });
}

function adicionarXp(quantidade, motivo) {
    estadoUsuario.xp += quantidade;
    salvarLocal("bspaceXp", String(estadoUsuario.xp));
    atualizarPainelUsuario();
    mostrarToast(`+${quantidade} XP - ${motivo}`);
    tocarSom(quantidade >= 30 ? 660 : 480);
}

function atualizarPainelUsuario() {
    const nivel = obterNivelDoUsuario();
    const xpNoNivel = estadoUsuario.xp % 100;
    const nome = estadoUsuario.nome || "Explorador BSpace";

    definirTexto("userXp", formatarNumero(estadoUsuario.xp));
    definirTexto("userLevel", nivel);
    definirTexto("profileStatus", `${nome}, progresso local ativo. Continue explorando para subir de nível.`);

    const barra = document.getElementById("xpTrack");
    if (barra) {
        barra.style.width = `${xpNoNivel}%`;
    }
}

function obterNivelDoUsuario() {
    if (estadoUsuario.xp >= 300) {
        return "Comandante";
    }

    if (estadoUsuario.xp >= 200) {
        return "Especialista";
    }

    if (estadoUsuario.xp >= 100) {
        return "Piloto";
    }

    return "Cadete";
}

function tocarSom(frequencia, forcado = false) {
    if ((!estadoUsuario.somAtivo && !forcado) || !("AudioContext" in window || "webkitAudioContext" in window)) {
        return;
    }

    const AudioApi = window.AudioContext || window.webkitAudioContext;
    audioContext = audioContext || new AudioApi();

    const oscilador = audioContext.createOscillator();
    const ganho = audioContext.createGain();

    oscilador.frequency.value = frequencia;
    oscilador.type = "sine";
    ganho.gain.setValueAtTime(0.0001, audioContext.currentTime);
    ganho.gain.exponentialRampToValueAtTime(0.07, audioContext.currentTime + 0.02);
    ganho.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.16);

    oscilador.connect(ganho);
    ganho.connect(audioContext.destination);
    oscilador.start();
    oscilador.stop(audioContext.currentTime + 0.18);
}

function mostrarToast(texto) {
    let toast = document.getElementById("progressToast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "progressToast";
        toast.className = "progress-toast";
        document.body.appendChild(toast);
    }

    toast.textContent = texto;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
        toast.classList.remove("show");
    }, 1700);
}

function definirTexto(id, texto) {
    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.textContent = texto;
    }
}

function criarOpcao(valor, texto) {
    const opcao = document.createElement("option");
    opcao.value = valor;
    opcao.textContent = texto;
    return opcao;
}

function criarSpan(texto) {
    const span = document.createElement("span");
    span.textContent = texto;
    return span;
}

function criarStrong(texto) {
    const strong = document.createElement("strong");
    strong.textContent = texto;
    return strong;
}

function formatarNumero(valor) {
    return new Intl.NumberFormat("pt-BR").format(valor);
}

function formatarTempo(minutos) {
    if (minutos < 60) {
        return `${minutos.toFixed(1).replace(".", ",")} minutos`;
    }

    const horas = minutos / 60;
    return `${horas.toFixed(1).replace(".", ",")} horas`;
}

function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function lerLocal(chave, fallback) {
    try {
        return window.localStorage.getItem(chave) ?? fallback;
    } catch {
        return fallback;
    }
}

function salvarLocal(chave, valor) {
    try {
        window.localStorage.setItem(chave, valor);
        return true;
    } catch {
        return false;
    }
}
