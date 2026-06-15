export const ACADEMY_MODULES = [
    {
        slug: "sistema-solar",
        ordem: 1,
        titulo: "Sistema Solar",
        nivel: "Fundamentos",
        duracao: "18 min",
        resumo: "Entenda como o Sol, planetas, luas, asteroides e cometas formam uma vizinhança cósmica organizada por gravidade.",
        objetivos: [
            "Reconhecer os principais corpos do Sistema Solar.",
            "Relacionar órbitas, gravidade e distância ao Sol.",
            "Diferenciar planetas rochosos, gigantes gasosos e gigantes gelados."
        ],
        conteudo: [
            {
                titulo: "O Sol como centro gravitacional",
                texto: "O Sol concentra quase toda a massa do Sistema Solar. Sua gravidade mantém planetas, luas, asteroides e cometas em órbitas estáveis."
            },
            {
                titulo: "Famílias planetárias",
                texto: "Mercúrio, Vênus, Terra e Marte são rochosos. Júpiter e Saturno são gigantes gasosos. Urano e Netuno são gigantes gelados."
            },
            {
                titulo: "Escalas e órbitas",
                texto: "Quanto mais distante do Sol, maior tende a ser o tempo orbital. Netuno leva cerca de 165 anos terrestres para completar uma volta."
            }
        ],
        exercicios: [
            {
                id: "classificar-planetas",
                titulo: "Classifique os planetas",
                instrucao: "Separe mentalmente os oito planetas entre rochosos, gasosos e gelados.",
            },
            {
                id: "ordem-orbital",
                titulo: "Reconstrua a ordem orbital",
                instrucao: "Liste os planetas do mais próximo ao mais distante do Sol.",
            }
        ],
        quiz: [
            {
                id: "centro-sistema-solar",
                pergunta: "Qual corpo concentra a maior parte da massa do Sistema Solar?",
                opcoes: ["Sol", "Júpiter", "Terra"],
                correta: 0,
                explicacao: "O Sol concentra quase toda a massa do Sistema Solar e domina sua gravidade.",
            },
            {
                id: "gigante-gelado",
                pergunta: "Qual destes planetas é classificado como gigante gelado?",
                opcoes: ["Netuno", "Marte", "Saturno"],
                correta: 0,
                explicacao: "Netuno e Urano são chamados de gigantes gelados por sua composição rica em compostos voláteis.",
            }
        ]
    },
    {
        slug: "estrelas",
        ordem: 2,
        titulo: "Estrelas",
        nivel: "Essencial",
        duracao: "20 min",
        resumo: "Aprenda como estrelas nascem, brilham, evoluem e por que massa, cor e temperatura contam histórias diferentes.",
        objetivos: [
            "Explicar o brilho das estrelas por fusão nuclear.",
            "Relacionar cor, temperatura e massa estelar.",
            "Identificar fases básicas do ciclo de vida estelar."
        ],
        conteudo: [
            {
                titulo: "Fusão nuclear",
                texto: "Estrelas brilham porque núcleos leves se unem em seus interiores, liberando energia. No Sol, o hidrogênio é convertido em hélio."
            },
            {
                titulo: "Cor e temperatura",
                texto: "Estrelas azuladas são mais quentes. Estrelas avermelhadas são mais frias. A cor é uma pista direta de temperatura superficial."
            },
            {
                titulo: "Vida guiada pela massa",
                texto: "Estrelas mais massivas consomem combustível rapidamente e vivem menos. Estrelas menores podem permanecer estáveis por bilhões ou trilhões de anos."
            }
        ],
        exercicios: [
            {
                id: "comparar-cores",
                titulo: "Compare cores estelares",
                instrucao: "Ordene mentalmente estrelas vermelhas, amarelas e azuis da mais fria para a mais quente.",
            },
            {
                id: "ciclo-estelar",
                titulo: "Mapa do ciclo estelar",
                instrucao: "Descreva em uma frase como massa influencia o destino de uma estrela.",
            }
        ],
        quiz: [
            {
                id: "energia-estelar",
                pergunta: "Qual processo libera a energia que faz estrelas brilharem?",
                opcoes: ["Fusão nuclear", "Evaporação", "Reflexão de planetas"],
                correta: 0,
                explicacao: "A fusão nuclear converte massa em energia no interior das estrelas.",
            },
            {
                id: "cor-mais-quente",
                pergunta: "Entre estas cores, qual indica uma estrela mais quente?",
                opcoes: ["Azul", "Vermelha", "Laranja"],
                correta: 0,
                explicacao: "Estrelas azuladas têm temperaturas superficiais mais altas.",
            }
        ]
    },
    {
        slug: "galaxias",
        ordem: 3,
        titulo: "Galáxias",
        nivel: "Intermediário",
        duracao: "22 min",
        resumo: "Explore galáxias como grandes sistemas de estrelas, gás, poeira e matéria escura em constante evolução.",
        objetivos: [
            "Definir galáxias como sistemas gravitacionais.",
            "Comparar tipos básicos de galáxias.",
            "Entender colisões e formação estelar em escala galáctica."
        ],
        conteudo: [
            {
                titulo: "Cidades de estrelas",
                texto: "Galáxias reúnem bilhões ou trilhões de estrelas, além de gás, poeira e matéria escura ligados pela gravidade."
            },
            {
                titulo: "Formas galácticas",
                texto: "Galáxias podem ser espirais, elípticas ou irregulares. A Via Láctea é uma espiral barrada."
            },
            {
                titulo: "Interações cósmicas",
                texto: "Galáxias podem colidir e se fundir. Essas interações reorganizam estrelas e podem disparar novas regiões de formação estelar."
            }
        ],
        exercicios: [
            {
                id: "identificar-via-lactea",
                titulo: "Localize nossa galáxia",
                instrucao: "Explique por que o Sistema Solar pertence à Via Láctea, mas não fica no seu centro.",
            },
            {
                id: "tipos-galaxias",
                titulo: "Compare formatos",
                instrucao: "Associe espiral, elíptica e irregular a uma característica visual de cada tipo.",
            }
        ],
        quiz: [
            {
                id: "tipo-via-lactea",
                pergunta: "A Via Láctea é classificada como qual tipo de galáxia?",
                opcoes: ["Espiral barrada", "Elíptica anã", "Irregular"],
                correta: 0,
                explicacao: "A Via Láctea possui braços espirais e uma barra central de estrelas.",
            },
            {
                id: "conteudo-galaxia",
                pergunta: "Além de estrelas, galáxias também contêm:",
                opcoes: ["Gás, poeira e matéria escura", "Apenas planetas", "Som atmosférico"],
                correta: 0,
                explicacao: "Galáxias são sistemas complexos com estrelas, gás, poeira e matéria escura.",
            }
        ]
    },
    {
        slug: "buracos-negros",
        ordem: 4,
        titulo: "Buracos Negros",
        nivel: "Avançado",
        duracao: "24 min",
        resumo: "Descubra o que torna buracos negros extremos, como são detectados e por que o horizonte de eventos é tão importante.",
        objetivos: [
            "Definir buracos negros por gravidade extrema.",
            "Compreender o conceito de horizonte de eventos.",
            "Reconhecer evidências observacionais de buracos negros."
        ],
        conteudo: [
            {
                titulo: "Gravidade extrema",
                texto: "Um buraco negro é uma região onde a gravidade é tão intensa que nem a luz escapa após cruzar o horizonte de eventos."
            },
            {
                titulo: "Como observamos algo escuro",
                texto: "Astrônomos detectam buracos negros por seus efeitos: movimento de estrelas próximas, discos de acreção e ondas gravitacionais."
            },
            {
                titulo: "Escalas diferentes",
                texto: "Existem buracos negros de massa estelar e buracos negros supermassivos, encontrados nos centros de muitas galáxias."
            }
        ],
        exercicios: [
            {
                id: "horizonte-eventos",
                titulo: "Explique o limite",
                instrucao: "Defina horizonte de eventos em uma frase simples.",
            },
            {
                id: "evidencias",
                titulo: "Rastreie evidências",
                instrucao: "Liste dois sinais indiretos usados para identificar buracos negros.",
            }
        ],
        quiz: [
            {
                id: "horizonte-definicao",
                pergunta: "O horizonte de eventos é:",
                opcoes: ["O limite após o qual nem a luz escapa", "A superfície sólida do buraco negro", "Uma lua em órbita"],
                correta: 0,
                explicacao: "O horizonte de eventos marca a fronteira sem retorno para luz e matéria.",
            },
            {
                id: "deteccao-buraco-negro",
                pergunta: "Qual evidência pode indicar a presença de um buraco negro?",
                opcoes: ["Movimento de estrelas próximas", "Som no espaço vazio", "Mudança de estações na Terra"],
                correta: 0,
                explicacao: "Órbitas de estrelas próximas podem revelar a massa invisível de um buraco negro.",
            }
        ]
    },
    {
        slug: "exoplanetas",
        ordem: 5,
        titulo: "Exoplanetas",
        nivel: "Aplicado",
        duracao: "26 min",
        resumo: "Conheça planetas fora do Sistema Solar, métodos de descoberta e critérios básicos de habitabilidade.",
        objetivos: [
            "Definir exoplanetas.",
            "Entender os métodos de trânsito e velocidade radial.",
            "Avaliar habitabilidade como um conjunto de condições, não uma promessa de vida."
        ],
        conteudo: [
            {
                titulo: "Planetas de outras estrelas",
                texto: "Exoplanetas são mundos que orbitam estrelas além do Sol. Milhares já foram confirmados em sistemas muito diversos."
            },
            {
                titulo: "Método de trânsito",
                texto: "Quando um planeta passa na frente de sua estrela, o brilho observado diminui levemente. Essa queda pode revelar tamanho e período orbital."
            },
            {
                titulo: "Habitabilidade",
                texto: "A zona habitável indica onde água líquida poderia existir, mas vida depende também de atmosfera, química, estabilidade e energia."
            }
        ],
        exercicios: [
            {
                id: "curva-luz",
                titulo: "Leia uma curva de luz",
                instrucao: "Imagine uma queda periódica no brilho de uma estrela e explique por que isso sugere um planeta.",
            },
            {
                id: "habitabilidade",
                titulo: "Avalie habitabilidade",
                instrucao: "Liste três fatores que importam além da distância até a estrela.",
            }
        ],
        quiz: [
            {
                id: "definir-exoplaneta",
                pergunta: "O que é um exoplaneta?",
                opcoes: ["Um planeta fora do Sistema Solar", "Uma estrela jovem", "Uma lua de Saturno"],
                correta: 0,
                explicacao: "Exoplanetas orbitam estrelas diferentes do Sol.",
            },
            {
                id: "metodo-transito",
                pergunta: "No método de trânsito, o que os astrônomos observam?",
                opcoes: ["Queda no brilho da estrela", "Som emitido pelo planeta", "Cor das nuvens terrestres"],
                correta: 0,
                explicacao: "A passagem do planeta diante da estrela reduz levemente o brilho observado.",
            }
        ]
    }
];

export const DEFAULT_ACADEMY_MODULE = ACADEMY_MODULES[0].slug;
