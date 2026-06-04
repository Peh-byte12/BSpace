export const PLANETS = [
    {
        slug: "mercurio",
        nome: "Mercúrio",
        tipo: "Rochoso",
        diametro: 4879,
        distancia: 57.9,
        gravidade: 3.7,
        luas: 0,
        resumo: "O menor planeta e o mais próximo do Sol.",
        descricao: "Mercúrio é o menor planeta do Sistema Solar e o mais próximo do Sol.",
        imagem: "src/assets/mercurio.jpg",
        lista: {
            resumo: "O planeta mais próximo do Sol e também um dos menores do Sistema Solar.",
            busca: "mercurio mercúrio rochoso pequeno sol"
        },
        fatos: [
            { titulo: "Posição", valor: "1º planeta" },
            { titulo: "Destaque", valor: "Grande variação térmica" },
            { titulo: "Superfície", valor: "Rochosa e craterada" },
            { titulo: "Ano", valor: "88 dias terrestres" }
        ],
        modelo3d: {
            arquivo: "src/assets/models/mercury.glb",
            tamanho: 2.55,
            velocidade: 0.0038,
            anotacoes: [
                { numero: 1, texto: "Crateras", detalhe: "Marcas de impactos antigos ajudam a revelar a história da superfície de Mercúrio.", posicao: [-0.68, 0.46, 1.15] },
                { numero: 2, texto: "Bacia Caloris", detalhe: "Uma das maiores bacias de impacto do Sistema Solar interno.", posicao: [0.36, 0.08, 1.28] },
                { numero: 3, texto: "Escarpas", detalhe: "Grandes falhas indicam contração do planeta ao longo de sua evolução.", posicao: [0.86, -0.38, 0.9] }
            ]
        }
    },
    {
        slug: "venus",
        nome: "Vênus",
        tipo: "Rochoso",
        diametro: 12104,
        distancia: 108.2,
        gravidade: 8.9,
        luas: 0,
        resumo: "Um planeta quente, com atmosfera extremamente densa.",
        descricao: "Vênus é parecido em tamanho com a Terra, mas possui atmosfera extremamente densa e quente.",
        imagem: "src/assets/venus.webp",
        lista: {
            resumo: "Conhecido pelo calor extremo e pela atmosfera densa rica em dióxido de carbono.",
            busca: "venus vênus rochoso quente atmosfera"
        },
        fatos: [
            { titulo: "Posição", valor: "2º planeta" },
            { titulo: "Destaque", valor: "Planeta mais quente" },
            { titulo: "Atmosfera", valor: "Muito espessa" },
            { titulo: "Rotação", valor: "Muito lenta" }
        ],
        modelo3d: {
            arquivo: "src/assets/models/venus.glb",
            tamanho: 2.7,
            velocidade: 0.0035,
            anotacoes: [
                { numero: 1, texto: "Atmosfera densa", detalhe: "A pressão atmosférica intensa contribui para temperaturas extremas.", posicao: [-0.58, 0.56, 1.12] },
                { numero: 2, texto: "Nuvens ácidas", detalhe: "Camadas de nuvens refletem luz e escondem a superfície do planeta.", posicao: [0.38, 0.12, 1.27] },
                { numero: 3, texto: "Superfície vulcânica", detalhe: "Planícies vulcânicas dominam grande parte da paisagem venusiana.", posicao: [0.78, -0.48, 0.95] }
            ]
        }
    },
    {
        slug: "terra",
        nome: "Terra",
        tipo: "Rochoso",
        diametro: 12742,
        distancia: 149.6,
        gravidade: 9.8,
        luas: 1,
        resumo: "Nosso planeta, com água líquida abundante e vida confirmada.",
        descricao: "A Terra é o terceiro planeta do Sistema Solar e o único com vida confirmada até o momento.",
        imagem: "src/assets/terra.jpg",
        lista: {
            resumo: "O único planeta conhecido com água líquida estável na superfície e vida confirmada.",
            busca: "terra rochoso agua água vida lua"
        },
        fatos: [
            { titulo: "Posição", valor: "3º planeta" },
            { titulo: "Destaque", valor: "Água líquida abundante" },
            { titulo: "Atmosfera", valor: "Rica em nitrogênio e oxigênio" },
            { titulo: "Satélite natural", valor: "Lua" }
        ],
        modelo3d: {
            arquivo: "src/assets/models/earth.glb",
            tamanho: 2.6,
            velocidade: 0.004,
            anotacoes: [
                { numero: 1, texto: "Oceanos", detalhe: "A água líquida cobre a maior parte da superfície e regula o clima global.", posicao: [-0.72, 0.3, 1.12] },
                { numero: 2, texto: "Continentes", detalhe: "Placas tectônicas remodelam a crosta e ajudam no ciclo geológico.", posicao: [0.28, -0.18, 1.28] },
                { numero: 3, texto: "Nuvens", detalhe: "Sistemas de nuvens mostram a circulação atmosférica em tempo real.", posicao: [0.66, 0.58, 0.98] }
            ]
        }
    },
    {
        slug: "marte",
        nome: "Marte",
        tipo: "Rochoso",
        diametro: 6779,
        distancia: 227.9,
        gravidade: 3.7,
        luas: 2,
        resumo: "O planeta vermelho, alvo frequente de missões robóticas.",
        descricao: "Marte é conhecido como planeta vermelho e é um dos corpos mais estudados na busca por sinais de vida passada.",
        imagem: "src/assets/marte.jpg",
        lista: {
            resumo: "Famoso pela coloração avermelhada e por ser um alvo frequente de missões robóticas.",
            busca: "marte rochoso vermelho missões robóticas"
        },
        fatos: [
            { titulo: "Posição", valor: "4º planeta" },
            { titulo: "Destaque", valor: "Solo avermelhado" },
            { titulo: "Atmosfera", valor: "Fina e fria" },
            { titulo: "Exploração", valor: "Muitas missões robóticas" }
        ],
        modelo3d: {
            arquivo: "src/assets/models/marte.glb",
            tamanho: 2.7,
            velocidade: 0.004,
            anotacoes: [
                { numero: 1, texto: "Solo oxidado", detalhe: "Óxidos de ferro dão a Marte sua coloração avermelhada característica.", posicao: [-0.64, 0.18, 1.18] },
                { numero: 2, texto: "Regiões polares", detalhe: "Calotas de gelo variam com as estações marcianas.", posicao: [0.2, 0.78, 0.98] },
                { numero: 3, texto: "Crateras", detalhe: "Crateras preservam pistas sobre impactos e antigos ambientes marcianos.", posicao: [0.78, -0.42, 0.98] }
            ]
        }
    },
    {
        slug: "jupiter",
        nome: "Júpiter",
        tipo: "Gigante gasoso",
        diametro: 139820,
        distancia: 778.5,
        gravidade: 24.8,
        luas: 95,
        resumo: "O maior planeta do Sistema Solar, famoso pela Grande Mancha Vermelha.",
        descricao: "Júpiter é o maior planeta do Sistema Solar e possui dezenas de luas, além da Grande Mancha Vermelha.",
        imagem: "src/assets/jupiter.jpg",
        lista: {
            resumo: "O maior planeta do Sistema Solar, com intensa atividade atmosférica.",
            busca: "jupiter júpiter gigante gasoso mancha vermelha luas"
        },
        fatos: [
            { titulo: "Posição", valor: "5º planeta" },
            { titulo: "Destaque", valor: "Maior planeta do sistema" },
            { titulo: "Composição", valor: "Gigante gasoso" },
            { titulo: "Luas", valor: "Muitas luas conhecidas" }
        ],
        modelo3d: {
            arquivo: "src/assets/models/jupiter.glb",
            tamanho: 3.1,
            velocidade: 0.003,
            anotacoes: [
                { numero: 1, texto: "Faixas atmosféricas", detalhe: "Correntes de vento criam bandas alternadas de nuvens e tempestades.", posicao: [-0.72, 0.18, 1.34] },
                { numero: 2, texto: "Grande Mancha Vermelha", detalhe: "Uma tempestade gigantesca observada há séculos na atmosfera joviana.", posicao: [0.54, -0.24, 1.3] },
                { numero: 3, texto: "Zonas claras", detalhe: "Regiões claras indicam diferenças de altitude, composição e dinâmica atmosférica.", posicao: [0.46, 0.5, 1.2] }
            ]
        }
    },
    {
        slug: "saturno",
        nome: "Saturno",
        tipo: "Gigante gasoso",
        diametro: 116460,
        distancia: 1434,
        gravidade: 10.4,
        luas: 146,
        resumo: "Conhecido pelo sistema de anéis mais marcante do Sistema Solar.",
        descricao: "Saturno é famoso por seus anéis extensos e por ser um gigante gasoso de baixa densidade.",
        imagem: "src/assets/saturno.jpg",
        lista: {
            resumo: "Reconhecido principalmente pelo seu impressionante sistema de anéis.",
            busca: "saturno gigante gasoso aneis anéis"
        },
        fatos: [
            { titulo: "Posição", valor: "6º planeta" },
            { titulo: "Destaque", valor: "Sistema de anéis" },
            { titulo: "Composição", valor: "Gigante gasoso" },
            { titulo: "Densidade", valor: "Menor que a da água" }
        ],
        modelo3d: {
            arquivo: "src/assets/models/saturno.glb",
            tamanho: 3.35,
            velocidade: 0.003,
            exposicao: 0.92,
            luzes: {
                hemisferio: 2.2,
                ambiente: 0.18,
                principal: 2.9,
                preenchimento: 0.9,
                contorno: 0.45,
                corChao: 0x4a463c
            },
            anotacoes: [
                { numero: 1, texto: "Anéis principais", detalhe: "Os anéis são formados por partículas de gelo e rocha em órbita.", posicao: [-1.78, 0.02, 0.78], limiarVisibilidade: -0.35 },
                { numero: 2, texto: "Faixas de nuvens", detalhe: "A atmosfera de Saturno também possui bandas, embora mais suaves que as de Júpiter.", posicao: [0.18, 0.42, 1.18] },
                { numero: 3, texto: "Divisão dos anéis", detalhe: "Lacunas nos anéis revelam influência gravitacional de luas e ressonâncias.", posicao: [1.72, -0.08, 0.7], limiarVisibilidade: -0.35 }
            ]
        }
    },
    {
        slug: "urano",
        nome: "Urano",
        tipo: "Gigante gelado",
        diametro: 50724,
        distancia: 2871,
        gravidade: 8.7,
        luas: 28,
        resumo: "Um gigante gelado que gira quase de lado.",
        descricao: "Urano é um gigante gelado e possui um eixo de rotação extremamente inclinado.",
        imagem: "src/assets/urano.jpg",
        lista: {
            resumo: "Um gigante gelado que gira praticamente de lado em relação à sua órbita.",
            busca: "urano gigante gelado inclinado azul"
        },
        fatos: [
            { titulo: "Posição", valor: "7º planeta" },
            { titulo: "Destaque", valor: "Gira quase de lado" },
            { titulo: "Composição", valor: "Gigante gelado" },
            { titulo: "Anéis", valor: "Possui anéis discretos" }
        ],
        modelo3d: {
            arquivo: "src/assets/models/uranus.glb",
            tamanho: 2.7,
            velocidade: 0.0034,
            anotacoes: [
                { numero: 1, texto: "Atmosfera azulada", detalhe: "O metano absorve luz vermelha e ajuda a produzir a coloração azul-esverdeada.", posicao: [-0.58, 0.32, 1.18] },
                { numero: 2, texto: "Inclinação axial", detalhe: "Urano gira quase de lado, criando estações extremamente longas.", posicao: [0.18, 0.72, 1.02] },
                { numero: 3, texto: "Nuvens de metano", detalhe: "Camadas de metano moldam a aparência e a dinâmica do gigante gelado.", posicao: [0.78, -0.34, 0.98] }
            ]
        }
    },
    {
        slug: "netuno",
        nome: "Netuno",
        tipo: "Gigante gelado",
        diametro: 49244,
        distancia: 4495,
        gravidade: 11.2,
        luas: 16,
        resumo: "O planeta mais distante do Sol, com ventos muito intensos.",
        descricao: "Netuno é o planeta mais distante do Sol e apresenta ventos extremamente intensos.",
        imagem: "src/assets/netuno.webp",
        lista: {
            resumo: "Planeta distante, frio e com ventos entre os mais fortes já observados.",
            busca: "netuno gigante gelado ventos distante azul"
        },
        fatos: [
            { titulo: "Posição", valor: "8º planeta" },
            { titulo: "Destaque", valor: "Ventos muito fortes" },
            { titulo: "Composição", valor: "Gigante gelado" },
            { titulo: "Distância", valor: "Região externa do sistema" }
        ],
        modelo3d: {
            arquivo: "src/assets/models/neptune.glb",
            tamanho: 2.7,
            velocidade: 0.0034,
            anotacoes: [
                { numero: 1, texto: "Atmosfera azul", detalhe: "A coloração intensa está ligada à composição atmosférica e à absorção de luz.", posicao: [-0.62, 0.22, 1.2] },
                { numero: 2, texto: "Ventos intensos", detalhe: "Netuno possui alguns dos ventos mais rápidos medidos no Sistema Solar.", posicao: [0.48, 0.34, 1.16] },
                { numero: 3, texto: "Nuvens de metano", detalhe: "Nuvens brilhantes indicam atividade atmosférica em grande altitude.", posicao: [0.72, -0.42, 0.96] }
            ]
        }
    }
];

export const PLANET_ORDER = PLANETS.map((planet) => planet.slug);
