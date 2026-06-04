export const DASHBOARD_HIGHLIGHTS = [
    {
        title: "Academia BSpace",
        description: "Avance por módulos de astronomia com conteúdo, exercícios, quiz e XP salvo no navegador.",
        href: "academia.html"
    },
    {
        title: "Calendário astronômico",
        description: "Planeje observações com eclipses, fases da Lua, chuvas de meteoros e conjunções.",
        href: "calendario.html"
    },
    {
        title: "Planetas rochosos",
        description: "Conheça Mercúrio, Vênus, Terra e Marte com um panorama dos ambientes mais próximos do Sol.",
        href: "planetas.html"
    },
    {
        title: "Gigantes gasosos",
        description: "Explore Júpiter e Saturno para entender tempestades violentas, anéis e atmosferas densas.",
        href: "planetas.html"
    },
    {
        title: "Missões históricas",
        description: "Reveja sondas, orbitadores e pousos que ampliaram nosso conhecimento do Sistema Solar.",
        href: "missoes.html"
    }
];

export const WEEKLY_EVENTS = [
    {
        title: "Lua em destaque",
        description: "Observe crateras, mares lunares e a mudança de iluminação ao longo da semana.",
        items: [
            { label: "Melhor horário:", value: "início da noite" },
            { label: "Dica:", value: "use céu limpo e pouco brilho urbano" }
        ]
    },
    {
        title: "Chuva de meteoros",
        description: "Procure rastros rápidos em regiões abertas do céu noturno, longe de luzes fortes.",
        items: [
            { label: "Melhor horário:", value: "23h às 2h" },
            { label: "Visibilidade:", value: "céu limpo e horizonte aberto" }
        ]
    },
    {
        title: "Júpiter e Saturno",
        description: "Compare os gigantes gasosos e observe como anéis, luas e atmosferas contam histórias diferentes.",
        items: [
            { label: "Foco:", value: "gigantes gasosos" },
            { label: "Próximo passo:", value: "abrir modelos 3D" }
        ]
    },
    {
        title: "Planetas internos",
        description: "Revise os planetas rochosos e perceba como distância, atmosfera e gravidade mudam cada mundo.",
        items: [
            { label: "Foco:", value: "Mercúrio, Vênus, Terra e Marte" },
            { label: "Atividade:", value: "comparar diâmetro e gravidade" }
        ]
    }
];

export const MISSION_RECOMMENDATIONS = {
    mercurio: {
        title: "Sobrevoo em Mercúrio",
        description: "Uma missão curta e precisa para investigar crateras, calor extremo e superfície rochosa.",
        type: "Sobrevoo",
        level: "Risco baixo",
        href: "missoes.html"
    },
    venus: {
        title: "Orbital em Vênus",
        description: "Uma missão ideal para estudar atmosfera densa, nuvens e efeito estufa extremo.",
        type: "Missão orbital",
        level: "Risco médio",
        href: "missoes.html"
    },
    terra: {
        title: "Observação da Terra",
        description: "Uma missão de referência para comparar água, atmosfera e vida com os outros planetas.",
        type: "Observação",
        level: "Risco baixo",
        href: "missoes.html"
    },
    marte: {
        title: "Pouso em Marte",
        description: "Uma missão de superfície para explorar solo avermelhado, crateras e sinais de água antiga.",
        type: "Pouso",
        level: "Risco alto",
        href: "missoes.html"
    },
    jupiter: {
        title: "Orbital em Júpiter",
        description: "Uma missão de alto impacto para investigar faixas atmosféricas, luas e tempestades gigantes.",
        type: "Missão orbital",
        level: "Risco médio",
        href: "missoes.html"
    },
    saturno: {
        title: "Sobrevoo em Saturno",
        description: "Uma rota visualmente rica para estudar anéis, baixa densidade e atmosfera gasosa.",
        type: "Sobrevoo",
        level: "Risco baixo",
        href: "missoes.html"
    },
    urano: {
        title: "Orbital em Urano",
        description: "Uma missão recomendada para entender inclinação extrema, atmosfera azulada e gigante gelado.",
        type: "Missão orbital",
        level: "Risco médio",
        href: "missoes.html"
    },
    netuno: {
        title: "Sobrevoo em Netuno",
        description: "Uma missão distante para observar ventos intensos e a região externa do Sistema Solar.",
        type: "Sobrevoo",
        level: "Risco médio",
        href: "missoes.html"
    }
};
