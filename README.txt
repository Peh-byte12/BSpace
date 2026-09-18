BSpace - Plataforma educacional de astronomia

Estrutura atual

- index.html, calendario.html, planetas.html, planeta.html, curiosidades.html, missoes.html: páginas HTML de entrada
- src/assets/: imagens, logo e modelos 3D
- src/assets/missions/: imagens das missões espaciais
- src/data/: dados puros do domínio
- src/components/: componentes interativos reutilizáveis
- src/pages/: inicializadores de página
- src/services/: regras de acesso a dados e serviços de apoio
- src/utils/: helpers pequenos e genéricos
- src/styles/: CSS base e estilos por página

Arquitetura

- Os dados dos planetas ficam centralizados em src/data/planets.js.
- A lista, o comparador, a página de detalhe e o modelo 3D consomem o mesmo cadastro.
- As curiosidades e os tipos de missão ficam em arquivos de dados próprios.
- As páginas HTML apontam para src/pages/app.js, que carrega apenas o módulo da página atual.
- A página planeta.html carrega src/pages/planet-3d.js separadamente para evitar carregar Three.js nas outras páginas.
- O site é totalmente estático: basta servir os arquivos, sem build e sem dependências de Node.

Calendário astronômico e API

- src/data/astronomy-events.js guarda o calendário local (eclipses, Lua, meteoros e conjunções).
- src/services/astronomy-api-service.js consulta a API pública NeoWs da NASA e converte as aproximações de asteroides para o formato de evento do projeto.
- src/services/astronomy-event-service.js junta os eventos locais com os da API, guarda o resultado em cache e decide qual fonte usar.
- Se a API falhar, o site usa o último resultado salvo no navegador e, na falta dele, apenas o calendário local. A página nunca fica sem conteúdo.
- Os eventos são recarregados automaticamente a cada 30 minutos enquanto a página fica aberta.
- O cache expira em 6 horas, o que evita consultas repetidas à API a cada filtro ou busca.
- A chave DEMO_KEY da NASA é usada por padrão. Para uso intenso, troque por uma chave própria em src/services/astronomy-api-service.js.

Estatísticas do usuário

- src/services/exploration-progress-service.js guarda todas as estatísticas em uma única chave do localStorage (bspaceUserStats).
- Não há login: cada navegador recebe um identificador anônimo (profileId) criado na primeira visita.
- Um usuário novo começa com todos os valores em zero.
- Métricas: planetas explorados, eventos visualizados, missões históricas exploradas, curiosidades descobertas, missões simuladas, pesquisas realizadas e favoritos.
- Itens exploráveis são guardados como conjuntos sem repetição, então recarregar a página ou repetir a mesma ação não duplica a contagem.
- Pesquisas só contam quando o usuário para de digitar um termo com pelo menos 2 letras diferente do último termo contado.
- A home se atualiza sozinha quando as estatísticas mudam, inclusive a partir de outra aba.
- O botão "Zerar estatísticas" na home apaga os dados deste navegador.

Acessibilidade

- A seta no canto inferior direito abre opções de tamanho do texto, alto contraste, redução de animações, links sublinhados e espaçamento de leitura.
- Essa seta, o botão de voltar ao topo e o botão de som ficam agrupados em src/components/site-shell.js no mesmo painel flutuante (.a11y-dock), para não se sobreporem.
- O painel abre acima da seta, fecha com Escape, com clique fora ou quando o foco sai do grupo, e devolve o foco para a seta.
- As preferências ficam em bspaceA11yPreferences e são aplicadas antes da primeira pintura por src/utils/accessibility-boot.js.
- Todas as páginas têm link "Pular para o conteúdo principal", foco visível e anúncios para leitores de tela via src/utils/announce.js.
- O modelo 3D pode ser controlado pelo teclado: setas giram, + e - aproximam ou afastam e R centraliza.

Guia de manutenção

- Para adicionar um planeta, edite apenas src/data/planets.js.
- Para alterar curiosidades, edite src/data/curiosities.js.
- Para alterar tipos de missão, edite src/data/mission-types.js.
- Para adicionar eventos fixos ao calendário, edite src/data/astronomy-events.js.
- Para criar uma nova página, adicione um data-page no body, crie um módulo em src/pages/ e registre esse módulo em src/pages/app.js.

Funcionalidades

- Destaque automático do link ativo no menu
- Botão voltar ao topo, que aparece junto da seta de acessibilidade depois de rolar a página
- Ano automático no rodapé
- Animação suave nos cards e seções, com durações e curvas padronizadas em variáveis CSS (--dur-*, --ease-*)
- Home em formato de dashboard de exploração espacial
- Sistema solar simplificado na página inicial com os oito planetas e destaque do planeta selecionado
- Estatísticas de uso por navegador, começando em zero
- Favoritos de planetas e eventos astronômicos
- Painel de acessibilidade com preferências salvas
- Missão recomendada e evento astronômico da semana
- Simulação de tempo da luz
- Simulador de missões
- Som de interface opcional, ativado por um botão nas páginas que usam áudio
- Página de missões em formato de experiência interativa
- Componentes MissionCard, MissionTimeline, MissionStats e MissionGallery
- Busca e comparação entre planetas
- Página dinâmica de detalhe dos planetas
- Visualização 3D com Three.js, GLTFLoader e OrbitControls
- Viewer 3D com loader, zoom, rotação automática, hotspots clicáveis, painel contextual e tela cheia
- Calendário astronômico com filtros, busca, eventos futuros em primeiro lugar e marcação dos eventos já ocorridos
- Aproximações de asteroides atualizadas pela API da NASA, com cache e retorno automático aos dados locais
