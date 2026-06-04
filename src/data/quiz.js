export const QUIZ_CATEGORIES = [
    {
        id: "planetas",
        nome: "Planetas",
        descricao: "Características dos mundos do Sistema Solar."
    },
    {
        id: "sistema-solar",
        nome: "Sistema Solar",
        descricao: "Órbitas, proporções e relações entre os planetas."
    },
    {
        id: "exploracao",
        nome: "Exploração",
        descricao: "Missões, telescópios e descobertas espaciais."
    }
];

export const QUIZ_DIFFICULTY_LABELS = {
    facil: "Fácil",
    medio: "Médio",
    avancado: "Avançado"
};

export const QUIZ_QUESTIONS = [
    {
        id: "planeta-vermelho",
        categoria: "planetas",
        dificuldade: "facil",
        pergunta: "Qual planeta é conhecido como planeta vermelho?",
        opcoes: ["Marte", "Vênus", "Netuno"],
        correta: 0,
        explicacao: "Marte recebe esse apelido por causa do óxido de ferro presente em sua superfície."
    },
    {
        id: "aneis-famosos",
        categoria: "planetas",
        dificuldade: "facil",
        pergunta: "Qual planeta tem o sistema de anéis mais famoso?",
        opcoes: ["Mercúrio", "Saturno", "Terra"],
        correta: 1,
        explicacao: "Saturno tem anéis extensos e brilhantes, formados por gelo, rochas e poeira."
    },
    {
        id: "maior-planeta",
        categoria: "planetas",
        dificuldade: "facil",
        pergunta: "Qual é o maior planeta do Sistema Solar?",
        opcoes: ["Júpiter", "Urano", "Marte"],
        correta: 0,
        explicacao: "Júpiter é o maior planeta e também o gigante gasoso mais massivo do Sistema Solar."
    },
    {
        id: "vida-confirmada",
        categoria: "planetas",
        dificuldade: "facil",
        pergunta: "Qual planeta tem vida confirmada até agora?",
        opcoes: ["Terra", "Vênus", "Saturno"],
        correta: 0,
        explicacao: "A Terra é o único planeta com vida confirmada pela ciência até o momento."
    },
    {
        id: "planeta-mais-proximo-sol",
        categoria: "sistema-solar",
        dificuldade: "medio",
        pergunta: "Qual planeta fica mais próximo do Sol?",
        opcoes: ["Mercúrio", "Marte", "Júpiter"],
        correta: 0,
        explicacao: "Mercúrio é o primeiro planeta a partir do Sol e completa uma órbita em cerca de 88 dias terrestres."
    },
    {
        id: "luz-ate-terra",
        categoria: "sistema-solar",
        dificuldade: "medio",
        pergunta: "Quanto tempo a luz do Sol leva aproximadamente para chegar à Terra?",
        opcoes: ["8 minutos", "8 horas", "8 segundos"],
        correta: 0,
        explicacao: "A luz solar leva cerca de 8 minutos para percorrer a distância entre o Sol e a Terra."
    },
    {
        id: "gigantes-gasosos",
        categoria: "sistema-solar",
        dificuldade: "medio",
        pergunta: "Quais destes planetas são gigantes gasosos?",
        opcoes: ["Júpiter e Saturno", "Mercúrio e Vênus", "Terra e Marte"],
        correta: 0,
        explicacao: "Júpiter e Saturno são gigantes gasosos, compostos principalmente por hidrogênio e hélio."
    },
    {
        id: "apollo-17",
        categoria: "exploracao",
        dificuldade: "medio",
        pergunta: "Qual missão Apollo foi a última missão tripulada a pousar na Lua?",
        opcoes: ["Apollo 11", "Apollo 13", "Apollo 17"],
        correta: 2,
        explicacao: "A Apollo 17, lançada em 1972, foi a última missão tripulada a pousar na superfície lunar."
    },
    {
        id: "voyager-planetas-externos",
        categoria: "exploracao",
        dificuldade: "avancado",
        pergunta: "Qual programa de sondas ficou famoso por explorar os planetas externos?",
        opcoes: ["Voyager", "Gemini", "Mercury"],
        correta: 0,
        explicacao: "As sondas Voyager ampliaram o conhecimento sobre Júpiter, Saturno, Urano e Netuno."
    },
    {
        id: "telescopio-james-webb",
        categoria: "exploracao",
        dificuldade: "avancado",
        pergunta: "O Telescópio Espacial James Webb observa o universo principalmente em qual faixa?",
        opcoes: ["Infravermelho", "Ondas de rádio", "Raios gama"],
        correta: 0,
        explicacao: "O James Webb observa principalmente no infravermelho, ideal para estudar objetos distantes e frios."
    }
];
