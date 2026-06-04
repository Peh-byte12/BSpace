export const MISSIONS = [
    {
        slug: "apollo-17",
        name: "Apollo 17",
        eyebrow: "Missão lunar tripulada",
        tagline: "A última missão Apollo na Lua, com ciência de campo, rover lunar e a primeira noite de lançamento do Saturn V.",
        status: "Concluída",
        period: "7-19 dez 1972",
        destination: "Lua · Taurus-Littrow",
        agency: "NASA",
        bannerImage: "https://images-assets.nasa.gov/image/S72-55070/S72-55070~orig.jpg",
        source: "NASA Apollo 17",
        stats: [
            { label: "Duração", value: "12d 13h 52min" },
            { label: "Superfície lunar", value: "75h" },
            { label: "Rover", value: "30,5 km" },
            { label: "Amostras", value: "110,4 kg" },
            { label: "Órbitas", value: "75" },
            { label: "Veículos", value: "America + Challenger" }
        ],
        crew: [
            { role: "Comandante", name: "Eugene A. Cernan" },
            { role: "Piloto do Módulo Lunar", name: "Harrison H. Schmitt" },
            { role: "Piloto do Módulo de Comando", name: "Ronald E. Evans" }
        ],
        objectives: [
            "Investigar e coletar amostras geológicas na região Taurus-Littrow.",
            "Implantar experimentos de superfície, incluindo ALSEP.",
            "Executar experimentos em órbita lunar e registros fotográficos durante o retorno."
        ],
        technologies: [
            "Saturn V SA-512",
            "Módulo de Comando America",
            "Módulo Lunar Challenger",
            "Lunar Roving Vehicle",
            "Apollo Lunar Surface Experiments Package"
        ],
        results: [
            "Primeiro cientista-astronauta a caminhar na Lua.",
            "Maior retorno de amostras lunares do programa Apollo.",
            "Três EVAs somando 22h04min de atividade externa.",
            "Último pouso lunar tripulado do programa Apollo."
        ],
        timeline: [
            {
                date: "07 dez",
                title: "Lançamento noturno",
                description: "Saturn V parte do Complexo 39A levando a tripulação rumo à Lua."
            },
            {
                date: "10 dez",
                title: "Órbita lunar",
                description: "A nave entra em órbita lunar e prepara a descida para Taurus-Littrow."
            },
            {
                date: "11 dez",
                title: "Pouso lunar",
                description: "O módulo Challenger pousa na região montanhosa escolhida para estudos geológicos."
            },
            {
                date: "12-14 dez",
                title: "EVAs e rover",
                description: "A tripulação realiza três saídas, percorre 30,5 km e coleta amostras lunares."
            },
            {
                date: "19 dez",
                title: "Retorno à Terra",
                description: "A cápsula amerissa no Pacífico e conclui a missão Apollo 17."
            }
        ],
        gallery: [
            {
                image: "https://images-assets.nasa.gov/image/S72-55070/S72-55070~orig.jpg",
                title: "Lançamento do Saturn V",
                caption: "Apollo 17 decola à noite do Kennedy Space Center."
            },
            {
                image: "https://images-assets.nasa.gov/image/S72-50438/S72-50438~large.jpg",
                title: "Tripulação principal",
                caption: "Cernan, Evans e Schmitt posam antes da missão."
            },
            {
                image: "https://images-assets.nasa.gov/image/S72-54813/S72-54813~large.jpg",
                title: "Pad 39A iluminado",
                caption: "A nave Apollo 17 antes da primeira decolagem noturna do Saturn V."
            }
        ]
    },
    {
        slug: "voyager",
        name: "Voyager 1 e 2",
        eyebrow: "Exploração dos planetas externos",
        tagline: "Sondas que transformaram o estudo de Júpiter, Saturno, Urano e Netuno, seguindo até o espaço interestelar.",
        status: "Em operação estendida",
        period: "Desde 1977",
        destination: "Sistema Solar externo",
        agency: "NASA/JPL",
        bannerImage: "src/assets/saturno.jpg",
        source: "Arquivo BSpace",
        stats: [
            { label: "Lançamento", value: "1977" },
            { label: "Veículos", value: "2 sondas" },
            { label: "Alvos", value: "4 gigantes" },
            { label: "Energia", value: "RTG" },
            { label: "Comunicação", value: "Deep Space Network" },
            { label: "Status", value: "Estendida" }
        ],
        crew: [
            { role: "Tipo", name: "Missão robótica" },
            { role: "Operação", name: "NASA/JPL" },
            { role: "Comunicação", name: "Deep Space Network" }
        ],
        objectives: [
            "Realizar sobrevoos científicos dos planetas externos.",
            "Mapear atmosferas, luas, anéis e campos magnéticos.",
            "Enviar dados de regiões cada vez mais distantes do Sol."
        ],
        technologies: [
            "Geradores termoelétricos de radioisótopos",
            "Antena de alto ganho",
            "Câmeras de imageamento",
            "Magnetômetros",
            "Golden Record"
        ],
        results: [
            "Revelou detalhes inéditos de luas e anéis.",
            "Transformou o entendimento dos gigantes gasosos.",
            "Entrou em operação científica além dos planetas externos."
        ],
        timeline: [
            {
                date: "1977",
                title: "Lançamentos",
                description: "Voyager 1 e 2 iniciam trajetórias para aproveitar alinhamentos planetários raros."
            },
            {
                date: "1979",
                title: "Júpiter",
                description: "As sondas observam a Grande Mancha Vermelha, luas e campos magnéticos."
            },
            {
                date: "1980-81",
                title: "Saturno",
                description: "Os encontros revelam estruturas dos anéis e dados sobre Titã."
            },
            {
                date: "1986-89",
                title: "Urano e Netuno",
                description: "Voyager 2 completa os primeiros sobrevoos desses gigantes gelados."
            }
        ],
        gallery: [
            {
                image: "src/assets/jupiter.jpg",
                title: "Júpiter",
                caption: "Um dos principais alvos científicos das Voyager."
            },
            {
                image: "src/assets/saturno.jpg",
                title: "Saturno",
                caption: "Anéis e luas revelaram novas perguntas científicas."
            },
            {
                image: "src/assets/netuno.webp",
                title: "Netuno",
                caption: "O encontro de 1989 mostrou ventos e sistemas atmosféricos intensos."
            }
        ]
    },
    {
        slug: "perseverance",
        name: "Perseverance",
        eyebrow: "Robótica em Marte",
        tagline: "Um laboratório móvel em Jezero, estudando rochas, clima, sinais de habitabilidade antiga e tecnologias futuras.",
        status: "Ativa",
        period: "Desde 2021",
        destination: "Marte · Cratera Jezero",
        agency: "NASA/JPL",
        bannerImage: "src/assets/marte.jpg",
        source: "Arquivo BSpace",
        stats: [
            { label: "Destino", value: "Marte" },
            { label: "Tipo", value: "Rover" },
            { label: "Pouso", value: "2021" },
            { label: "Energia", value: "MMRTG" },
            { label: "Instrumentos", value: "7+" },
            { label: "Foco", value: "Astrobiologia" }
        ],
        crew: [
            { role: "Tipo", name: "Missão robótica" },
            { role: "Equipe", name: "NASA/JPL" },
            { role: "Companheiro", name: "Helicóptero Ingenuity" }
        ],
        objectives: [
            "Estudar rochas e sedimentos da Cratera Jezero.",
            "Coletar e armazenar amostras para estudos futuros.",
            "Testar tecnologias úteis para exploração humana de Marte."
        ],
        technologies: [
            "Sistema de pouso Sky Crane",
            "Mastcam-Z",
            "SuperCam",
            "MOXIE",
            "Sistema de coleta de amostras"
        ],
        results: [
            "Caracterizou ambientes antigos potencialmente habitáveis.",
            "Armazenou amostras selecionadas do solo marciano.",
            "Apoiou o primeiro voo controlado em outro planeta com Ingenuity."
        ],
        timeline: [
            {
                date: "2020",
                title: "Lançamento",
                description: "A missão parte da Terra rumo à Cratera Jezero."
            },
            {
                date: "2021",
                title: "Pouso em Marte",
                description: "O rover pousa com o sistema Sky Crane e inicia a fase de checagem."
            },
            {
                date: "2021+",
                title: "Operação científica",
                description: "Perseverance coleta dados, imagens e amostras em terreno marciano."
            }
        ],
        gallery: [
            {
                image: "src/assets/marte.jpg",
                title: "Marte",
                caption: "Planeta de destino e laboratório natural da missão."
            },
            {
                image: "src/assets/terra.jpg",
                title: "Terra e Marte",
                caption: "A comparação entre mundos guia perguntas sobre habitabilidade."
            },
            {
                image: "src/assets/venus.webp",
                title: "Planetas rochosos",
                caption: "A exploração marciana ganha contexto ao comparar ambientes rochosos."
            }
        ]
    }
];

export const DEFAULT_MISSION_SLUG = "apollo-17";
