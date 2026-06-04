export const ASTRONOMY_EVENT_TYPES = [
    {
        id: "todos",
        label: "Todos",
        description: "Todos os eventos astronômicos cadastrados."
    },
    {
        id: "eclipse",
        label: "Eclipses",
        description: "Eventos em que Sol, Terra e Lua ficam alinhados."
    },
    {
        id: "lua",
        label: "Lua",
        description: "Fases lunares e observações recomendadas."
    },
    {
        id: "meteoros",
        label: "Meteoros",
        description: "Picos de chuvas de meteoros e dicas de observação."
    },
    {
        id: "conjuncao",
        label: "Conjunções",
        description: "Aproximações aparentes entre Lua, planetas e estrelas."
    }
];

export const ASTRONOMY_EVENTS = [
    {
        id: "venus-jupiter-2026-06-09",
        type: "conjuncao",
        title: "Conjunção de Vênus e Júpiter",
        date: "2026-06-09",
        time: "Após o pôr do Sol",
        visibility: "Oeste-noroeste, baixo no horizonte",
        location: "Boa parte do mundo, com horizonte livre",
        summary: "Os dois planetas mais brilhantes do céu aparecem próximos no crepúsculo.",
        details: [
            "Vênus e Júpiter ficam visualmente próximos, embora estejam separados por enormes distâncias reais.",
            "O melhor momento é pouco depois do pôr do Sol, com céu limpo e horizonte oeste livre.",
            "A observação funciona a olho nu, mas binóculos ajudam a destacar o contraste entre os planetas."
        ],
        tips: [
            "Procure um local sem prédios ou árvores no horizonte oeste.",
            "Chegue antes do fim do crepúsculo para localizar Vênus primeiro.",
            "Não use telescópio apontado perto do Sol antes do pôr do Sol."
        ],
        source: {
            name: "Sky & Telescope / Space.com",
            url: "https://skyandtelescope.org/astronomy-press-releases/close-encounter-jupiter-and-venus/"
        },
        apiTags: ["planetary-conjunction", "venus", "jupiter"]
    },
    {
        id: "solar-eclipse-2026-08-12",
        type: "eclipse",
        title: "Eclipse solar total",
        date: "2026-08-12",
        time: "Horário varia por local",
        visibility: "Totalidade em partes da Groenlândia, Islândia, Espanha e pequena área de Portugal",
        location: "Parcial em regiões da Europa, África, América do Norte e oceanos próximos",
        summary: "A Lua passa à frente do Sol e projeta sua sombra pela região norte do planeta.",
        details: [
            "A totalidade ocorre apenas dentro de uma faixa estreita de visibilidade.",
            "Fora da faixa, muitos locais verão apenas um eclipse parcial.",
            "É um evento excelente para ensinar alinhamento entre Sol, Terra e Lua."
        ],
        tips: [
            "Nunca observe o Sol sem filtro solar certificado.",
            "Para atividade educacional, compare mapa de visibilidade com a rotação da Terra.",
            "Planeje observação local com antecedência, pois a visibilidade muda por cidade."
        ],
        source: {
            name: "NASA Future Eclipses",
            url: "https://science.nasa.gov/eclipses/future-eclipses"
        },
        apiTags: ["solar-eclipse", "moon", "sun"]
    },
    {
        id: "new-moon-2026-08-12",
        type: "lua",
        title: "Lua nova de agosto",
        date: "2026-08-12",
        time: "17:37 UTC",
        visibility: "Não visível diretamente; ideal para céu escuro",
        location: "Global",
        summary: "A Lua nova deixa o céu mais escuro e favorece observações de objetos tênues.",
        details: [
            "A fase nova acontece quando a Lua fica aproximadamente entre a Terra e o Sol.",
            "A face iluminada aponta para longe de nós, por isso ela praticamente desaparece do céu noturno.",
            "A coincidência com o eclipse solar acontece porque eclipses solares só ocorrem em lua nova."
        ],
        tips: [
            "Use esta data para observar a Via Láctea e meteoros.",
            "Explique a diferença entre fase lunar e eclipse: nem toda lua nova gera eclipse.",
            "Evite locais com poluição luminosa."
        ],
        source: {
            name: "NASA SkyCal",
            url: "https://eclipse.gsfc.nasa.gov/SKYCAL/SKYCAL.html?cal=2026"
        },
        apiTags: ["moon-phase", "new-moon"]
    },
    {
        id: "perseids-2026-08-12",
        type: "meteoros",
        title: "Pico das Perseidas",
        date: "2026-08-12",
        time: "Madrugada",
        visibility: "Melhor no hemisfério norte; possível observar rastros em céus escuros",
        location: "Céu escuro, longe de luz urbana",
        summary: "Uma das chuvas de meteoros mais conhecidas terá ótima condição lunar em 2026.",
        details: [
            "As Perseidas são associadas a detritos deixados pelo cometa Swift-Tuttle.",
            "Em 2026, o pico coincide com lua nova, reduzindo interferência de brilho lunar.",
            "O número observado depende de céu escuro, radiante alto e paciência."
        ],
        tips: [
            "Observe sem telescópio; meteoros cruzam grandes áreas do céu.",
            "Deite-se olhando para uma região ampla do céu.",
            "Reserve pelo menos 40 minutos para adaptação dos olhos ao escuro."
        ],
        source: {
            name: "International Meteor Organization / Skylook",
            url: "https://imo.net/files/meteor-shower/cal2026.pdf"
        },
        apiTags: ["meteor-shower", "perseids"]
    },
    {
        id: "lunar-eclipse-2026-08-28",
        type: "eclipse",
        title: "Eclipse lunar parcial",
        date: "2026-08-28",
        time: "Horário varia por local",
        visibility: "Regiões no lado noturno da Terra durante o evento",
        location: "Visibilidade depende de localização e horizonte",
        summary: "Parte da Lua passa pela sombra umbral da Terra durante a fase cheia.",
        details: [
            "Eclipses lunares acontecem quando a Terra fica entre o Sol e a Lua.",
            "Este evento é parcial: somente uma parte do disco lunar entra na sombra mais escura.",
            "Ao contrário de eclipses solares, eclipses lunares podem ser observados sem filtro."
        ],
        tips: [
            "Procure horários locais próximos ao nascer ou pôr da Lua.",
            "Use binóculos para acompanhar a borda da sombra.",
            "Compare com a lua cheia comum para notar a diferença de iluminação."
        ],
        source: {
            name: "NASA SkyCal / Timeanddate",
            url: "https://www.timeanddate.com/eclipse/lunar/2026-august-28"
        },
        apiTags: ["lunar-eclipse", "full-moon"]
    },
    {
        id: "orionids-2026-10-20",
        type: "meteoros",
        title: "Pico das Orionídeas",
        date: "2026-10-20",
        time: "Madrugada",
        visibility: "Melhor após meia-noite",
        location: "Global, com céu escuro",
        summary: "Meteoros associados ao cometa Halley cruzam o céu em velocidade alta.",
        details: [
            "As Orionídeas parecem irradiar da região da constelação de Órion.",
            "Meteoros rápidos podem deixar rastros persistentes.",
            "A Lua pode interferir parcialmente, então a escolha do local importa bastante."
        ],
        tips: [
            "Observe depois da meia-noite, quando o radiante ganha altura.",
            "Evite olhar apenas para Órion; rastros podem aparecer em várias áreas.",
            "Prefira horizontes abertos e céu sem nuvens."
        ],
        source: {
            name: "International Meteor Organization / Skylook",
            url: "https://imo.net/files/meteor-shower/cal2026.pdf"
        },
        apiTags: ["meteor-shower", "orionids"]
    },
    {
        id: "geminids-2026-12-13",
        type: "meteoros",
        title: "Pico das Geminídeas",
        date: "2026-12-13",
        time: "Noite e madrugada",
        visibility: "Excelente em céu escuro",
        location: "Global, favorecida no hemisfério norte",
        summary: "Uma das chuvas de meteoros mais fortes do ano, associada ao asteroide 3200 Phaethon.",
        details: [
            "As Geminídeas costumam produzir meteoros brilhantes e numerosos.",
            "O radiante fica na região de Gêmeos.",
            "Em 2026, a interferência lunar tende a ser baixa no pico."
        ],
        tips: [
            "Leve agasalho e observe por sessões longas.",
            "Não use telescópio; campo amplo é melhor.",
            "Registre contagem por intervalo de 15 minutos para transformar a observação em atividade científica."
        ],
        source: {
            name: "International Meteor Organization / Skylook",
            url: "https://imo.net/files/meteor-shower/cal2026.pdf"
        },
        apiTags: ["meteor-shower", "geminids"]
    }
];
