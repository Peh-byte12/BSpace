export const QUIZ_ACHIEVEMENTS = [
    {
        id: "primeira-orbita",
        titulo: "Primeira órbita",
        descricao: "Acerte sua primeira pergunta.",
        tipo: "correctAnswers",
        alvo: 1,
        xpBonus: 20
    },
    {
        id: "sequencia-estelar",
        titulo: "Sequência estelar",
        descricao: "Alcance um combo de 3 respostas corretas.",
        tipo: "bestCombo",
        alvo: 3,
        xpBonus: 35
    },
    {
        id: "cartografo-cosmico",
        titulo: "Cartógrafo cósmico",
        descricao: "Acerte pelo menos uma pergunta de cada categoria.",
        tipo: "categoryCoverage",
        alvo: 3,
        xpBonus: 45
    },
    {
        id: "especialista-orbital",
        titulo: "Especialista orbital",
        descricao: "Complete uma categoria com todas as perguntas corretas.",
        tipo: "perfectCategories",
        alvo: 1,
        xpBonus: 50
    },
    {
        id: "cadencia-de-estudo",
        titulo: "Cadência de estudo",
        descricao: "Responda 10 perguntas no histórico do quiz.",
        tipo: "totalAnswers",
        alvo: 10,
        xpBonus: 30
    },
    {
        id: "explorador-nivel-3",
        titulo: "Explorador nível 3",
        descricao: "Chegue ao nível 3 do Cosmic Quiz.",
        tipo: "level",
        alvo: 3,
        xpBonus: 60
    }
];
