BSpace - Plataforma educacional de astronomia

Estrutura atual

- index.html, planetas.html, planeta.html, curiosidades.html, missoes.html: páginas HTML de entrada
- src/assets/: imagens, logo e modelos 3D
- src/data/: dados puros do domínio
- src/components/: componentes interativos reutilizáveis
- src/pages/: inicializadores de página
- src/services/: regras de acesso a dados e serviços de apoio
- src/utils/: helpers pequenos e genéricos
- src/styles/: CSS base e estilos por página

Arquitetura

- Os dados dos planetas ficam centralizados em src/data/planets.js.
- A lista, o comparador, a página de detalhe e o modelo 3D consomem o mesmo cadastro.
- O quiz, as curiosidades e os tipos de missão ficam em arquivos de dados próprios.
- As páginas HTML apontam para src/pages/app.js, que carrega apenas o módulo da página atual.
- A página planeta.html carrega src/pages/planet-3d.js separadamente para evitar carregar Three.js nas outras páginas.

Guia de manutenção

- Para adicionar um planeta, edite apenas src/data/planets.js.
- Para alterar perguntas do quiz, edite src/data/quiz.js.
- Para alterar curiosidades, edite src/data/curiosities.js.
- Para alterar tipos de missão, edite src/data/mission-types.js.
- Para criar uma nova página, adicione um data-page no body, crie um módulo em src/pages/ e registre esse módulo em src/pages/app.js.

Funcionalidades

- Destaque automático do link ativo no menu
- Botão voltar ao topo
- Ano automático no rodapé
- Animação suave nos cards e seções
- Home em formato de dashboard de exploração espacial
- Sistema solar simplificado na página inicial
- Último planeta visitado salvo localmente
- Missão recomendada e evento astronômico da semana
- Estatísticas locais de exploração, missões e quiz
- Quiz interativo na página de curiosidades
- Simulação de tempo da luz
- Simulador de missões
- Página de missões em formato de experiência interativa
- Componentes MissionCard, MissionTimeline, MissionStats e MissionGallery
- Busca e comparação entre planetas
- Página dinâmica de detalhe dos planetas
- Visualização 3D com Three.js, GLTFLoader e OrbitControls
- Viewer 3D com loader, zoom, rotação automática, hotspots clicáveis, painel contextual e tela cheia
