document.addEventListener("DOMContentLoaded", () => {
    carregarPlanetaDaURL();
});

const planetas = {
    mercurio: {
        nome: "Mercúrio",
        descricao: "Mercúrio é o menor planeta do Sistema Solar e o mais próximo do Sol.",
        imagem: "https://images-assets.nasa.gov/image/PIA11406/PIA11406~orig.jpg?w=400&h=270&fit=crop&crop=faces%2Cfocalpoint",
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
        imagem: "https://science.nasa.gov/wp-content/uploads/2024/03/venus-mariner-10-pia23791-fig2.jpg?w=1024",
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
        imagem: "https://assets.science.nasa.gov/content/dam/science/esd/eo/images/imagerecords/0/885/modis_wonderglobe_lrg.jpg",
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
        imagem: "https://images-assets.nasa.gov/image/PIA02653/PIA02653~large.jpg?w=1920&h=1920&fit=clip&crop=faces%2Cfocalpoint",
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
        imagem: "https://assets.science.nasa.gov/dynamicimage/assets/science/psd/photojournal/pia/pia00/pia00343/jpeg/PIA00343.jpg?w=400&h=400&fit=crop&crop=faces%2Cfocalpoint",
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
        imagem: "https://assets.science.nasa.gov/dynamicimage/assets/science/cds/general/images/2024/03/saturn-farewell-pia21345.jpg?w=400&h=207&fit=crop&crop=faces%2Cfocalpoint",
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
        imagem: "https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar/2023/09/p/i/a/0/PIA01492-1.jpg?w=2188&h=2185&fit=clip&crop=faces%2Cfocalpoint",
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
        imagem: "https://science.nasa.gov/wp-content/uploads/2024/03/pia01492-neptune-full-disk-16x9-1.jpg?resize=768,432",
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

    const factsContainer = document.getElementById("planetFacts");
    factsContainer.innerHTML = "";

    planeta.fatos.forEach((fato) => {
        const card = document.createElement("div");
        card.className = "fact";
        card.innerHTML = `
            <strong>${fato.titulo}</strong>
            <span>${fato.valor}</span>
        `;
        factsContainer.appendChild(card);
    });

    document.getElementById("linkAnterior").href = planeta.anterior;
    document.getElementById("linkProximo").href = planeta.proximo;
}
