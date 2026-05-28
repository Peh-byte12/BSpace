document.addEventListener("DOMContentLoaded", () => {
    carregarPlanetaDaURL();
});

const planetas = {
    mercurio: {
        nome: "Mercúrio",
        descricao: "Mercúrio é o menor planeta do Sistema Solar e o mais próximo do Sol.",
        imagem: "assets/mercurio.jpg",
        fatos: [
            { titulo: "Posição", valor: "1º planeta" },
            { titulo: "Destaque", valor: "Grande variação térmica" },
            { titulo: "Superfície", valor: "Rochosa e craterada" },
            { titulo: "Ano", valor: "88 dias terrestres" }
        ],
        anterior: "planetas.html",
        proximo: "planeta.html?nome=venus"
    },
    venus: {
        nome: "Vênus",
        descricao: "Vênus é parecido em tamanho com a Terra, mas possui atmosfera extremamente densa e quente.",
        imagem: "assets/venus.webp",
        fatos: [
            { titulo: "Posição", valor: "2º planeta" },
            { titulo: "Destaque", valor: "Planeta mais quente" },
            { titulo: "Atmosfera", valor: "Muito espessa" },
            { titulo: "Rotação", valor: "Muito lenta" }
        ],
        anterior: "planeta.html?nome=mercurio",
        proximo: "planeta.html?nome=terra"
    },
    terra: {
        nome: "Terra",
        descricao: "A Terra é o terceiro planeta do Sistema Solar e o único com vida confirmada até o momento.",
        imagem: "assets/terra.jpg",
        fatos: [
            { titulo: "Posição", valor: "3º planeta" },
            { titulo: "Destaque", valor: "Água líquida abundante" },
            { titulo: "Atmosfera", valor: "Rica em nitrogênio e oxigênio" },
            { titulo: "Satélite natural", valor: "Lua" }
        ],
        anterior: "planeta.html?nome=venus",
        proximo: "planeta.html?nome=marte"
    },
    marte: {
        nome: "Marte",
        descricao: "Marte é conhecido como planeta vermelho e é um dos corpos mais estudados na busca por sinais de vida passada.",
        imagem: "assets/marte.jpg",
        fatos: [
            { titulo: "Posição", valor: "4º planeta" },
            { titulo: "Destaque", valor: "Solo avermelhado" },
            { titulo: "Atmosfera", valor: "Fina e fria" },
            { titulo: "Exploração", valor: "Muitas missões robóticas" }
        ],
        anterior: "planeta.html?nome=terra",
        proximo: "planeta.html?nome=jupiter"
    },
    jupiter: {
        nome: "Júpiter",
        descricao: "Júpiter é o maior planeta do Sistema Solar e possui dezenas de luas, além da Grande Mancha Vermelha.",
        imagem: "assets/jupiter.jpg",
        fatos: [
            { titulo: "Posição", valor: "5º planeta" },
            { titulo: "Destaque", valor: "Maior planeta do sistema" },
            { titulo: "Composição", valor: "Gigante gasoso" },
            { titulo: "Luas", valor: "Muitas luas conhecidas" }
        ],
        anterior: "planeta.html?nome=marte",
        proximo: "planeta.html?nome=saturno"
    },
    saturno: {
        nome: "Saturno",
        descricao: "Saturno é famoso por seus anéis extensos e por ser um gigante gasoso de baixa densidade.",
        imagem: "assets/saturno.jpg",
        fatos: [
            { titulo: "Posição", valor: "6º planeta" },
            { titulo: "Destaque", valor: "Sistema de anéis" },
            { titulo: "Composição", valor: "Gigante gasoso" },
            { titulo: "Densidade", valor: "Menor que a da água" }
        ],
        anterior: "planeta.html?nome=jupiter",
        proximo: "planeta.html?nome=urano"
    },
    urano: {
        nome: "Urano",
        descricao: "Urano é um gigante gelado e possui um eixo de rotação extremamente inclinado.",
        imagem: "assets/urano.jpg",
        fatos: [
            { titulo: "Posição", valor: "7º planeta" },
            { titulo: "Destaque", valor: "Gira quase de lado" },
            { titulo: "Composição", valor: "Gigante gelado" },
            { titulo: "Anéis", valor: "Possui anéis discretos" }
        ],
        anterior: "planeta.html?nome=saturno",
        proximo: "planeta.html?nome=netuno"
    },
    netuno: {
        nome: "Netuno",
        descricao: "Netuno é o planeta mais distante do Sol e apresenta ventos extremamente intensos.",
        imagem: "assets/netuno.webp",
        fatos: [
            { titulo: "Posição", valor: "8º planeta" },
            { titulo: "Destaque", valor: "Ventos muito fortes" },
            { titulo: "Composição", valor: "Gigante gelado" },
            { titulo: "Distância", valor: "Região externa do sistema" }
        ],
        anterior: "planeta.html?nome=urano",
        proximo: "planetas.html"
    }
};

function carregarPlanetaDaURL() {
    const parametros = new URLSearchParams(window.location.search);
    const nomePlaneta = parametros.get("nome");
    const planeta = planetas[nomePlaneta];

    const layout = document.getElementById("planetLayout");
    const erro = document.getElementById("planetError");

    if (!layout || !erro) {
        return;
    }

    if (!planeta) {
        layout.hidden = true;
        erro.hidden = false;
        document.title = "Planeta não encontrado";
        return;
    }

    document.title = planeta.nome;
    document.getElementById("planetName").textContent = planeta.nome;
    document.getElementById("planetDescription").textContent = planeta.descricao;
    document.getElementById("planetSummary").textContent = planeta.descricao;

    const imagem = document.getElementById("planetImage");
    imagem.src = planeta.imagem;
    imagem.alt = `Imagem de ${planeta.nome}`;
    imagem.loading = "lazy";
    imagem.decoding = "async";

    const factsContainer = document.getElementById("planetFacts");
    factsContainer.innerHTML = "";

    planeta.fatos.forEach((fato) => {
        const card = document.createElement("div");
        const titulo = document.createElement("strong");
        const valor = document.createElement("span");

        card.className = "fact";
        titulo.textContent = fato.titulo;
        valor.textContent = fato.valor;
        card.append(titulo, valor);
        factsContainer.appendChild(card);
    });

    document.getElementById("linkAnterior").href = planeta.anterior;
    document.getElementById("linkProximo").href = planeta.proximo;
}
