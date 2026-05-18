document.addEventListener("DOMContentLoaded", () => {
    destacarLinkAtivo();
    configurarBotaoVoltarAoTopo();
    configurarAnoAtual();
    configurarCuriosidadesAleatorias();
    configurarAnimacaoSuaveDosCards();
});

function destacarLinkAtivo() {
    const linksNavegacao = document.querySelectorAll(".nav-links a");
    const paginaAtual = window.location.pathname.split("/").pop() || "index.html";

    linksNavegacao.forEach((link) => {
        const destino = link.getAttribute("href");

        if (destino === paginaAtual) {
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

    window.addEventListener("scroll", () => {
        if (window.scrollY > 250) {
            botao.classList.add("show");
        } else {
            botao.classList.remove("show");
        }
    });

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
    }

    botaoCuriosidade.addEventListener("click", mostrarCuriosidadeAleatoria);
}

function configurarAnimacaoSuaveDosCards() {
    const elementosAnimados = document.querySelectorAll(".feature-card, .planet-card, .topic-card, .section-box, .planet-content, .planet-image");

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
