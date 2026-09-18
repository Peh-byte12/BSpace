# BSpace

Plataforma educacional de astronomia com dashboard de exploração, planetas em 3D, missões espaciais históricas e calendário astronômico integrado à API da NASA.

**Site publicado:** <https://peh-byte12.github.io/BSpace/>

---

## Sobre o projeto

O BSpace reúne, em um site estático, recursos para estudar o Sistema Solar: um painel inicial que acompanha o progresso de exploração, páginas de detalhe para os oito planetas, visualização 3D interativa dos modelos, uma linha do tempo de missões espaciais e um calendário de eventos astronômicos que combina dados locais com aproximações de asteroides consultadas na NASA.

Todo o estado do usuário fica no próprio navegador: não há login, back-end nem banco de dados.

## Tecnologias

- **HTML, CSS e JavaScript (ES Modules)** — sem framework e sem etapa de build
- **[Three.js](https://threejs.org/) 0.160.0** — `GLTFLoader` e `OrbitControls`, carregados via CDN (unpkg) por `importmap` em `planeta.html`
- **[NASA NeoWs API](https://api.nasa.gov/)** — aproximações de asteroides no calendário
- **localStorage** — preferências de acessibilidade, estatísticas de uso e cache da API

## Como executar localmente

Não há dependências para instalar e não existe etapa de build. O projeto precisa apenas ser servido por HTTP.

> **Importante:** abrir os arquivos com `file://` não funciona. Os ES Modules e o `importmap` do Three.js exigem um servidor HTTP.

Com Python:

```bash
python -m http.server 5173
```

Ou com Node.js:

```bash
npx serve .
```

Depois abra <http://127.0.0.1:5173> no navegador.

### Configuração da API da NASA

O calendário funciona sem nenhuma configuração: por padrão é usada a chave pública `DEMO_KEY`, que tem limite baixo de requisições.

Para uso mais intenso, gere uma chave gratuita em <https://api.nasa.gov/> e substitua o valor de `DEFAULT_API_KEY` em `src/services/astronomy-api-service.js`.

Se a API falhar, o site usa o último resultado salvo no navegador e, na falta dele, apenas o calendário local — a página nunca fica sem conteúdo.

## Estrutura do projeto

```
.
├── index.html              # Home (dashboard)
├── calendario.html         # Calendário astronômico
├── planetas.html           # Catálogo e comparador de planetas
├── planeta.html            # Detalhe do planeta + modelo 3D
├── curiosidades.html       # Curiosidades e simulação do tempo da luz
├── missoes.html            # Missões espaciais
├── src/
│   ├── assets/             # Imagens, logo, social card
│   │   ├── missions/       # Imagens das missões espaciais
│   │   └── models/         # Modelos 3D (.glb) dos planetas
│   ├── components/         # Componentes interativos reutilizáveis
│   ├── data/               # Dados puros do domínio
│   ├── pages/              # Inicializadores de cada página
│   ├── services/           # Acesso a dados e serviços de apoio
│   ├── styles/             # CSS base e estilos por página
│   └── utils/              # Helpers pequenos e genéricos
├── .htaccess               # Compressão e cache (Apache)
├── web.config              # Compressão, cache e MIME types (IIS)
├── robots.txt
└── sitemap.xml
```

## Arquitetura

- Os dados dos planetas ficam centralizados em `src/data/planets.js`. A lista, o comparador, a página de detalhe e o modelo 3D consomem o mesmo cadastro.
- As curiosidades e os tipos de missão ficam em arquivos de dados próprios.
- Todas as páginas HTML apontam para `src/pages/app.js`, que lê o `data-page` do `<body>` e importa dinamicamente apenas o módulo daquela página.
- `planeta.html` carrega `src/pages/planet-3d.js` separadamente, para não trazer o Three.js nas outras páginas.
- O site é totalmente estático: basta servir os arquivos.

## Funcionalidades

**Navegação e interface**

- Destaque automático do link ativo no menu
- Botão de voltar ao topo, que aparece junto da seta de acessibilidade depois de rolar a página
- Ano automático no rodapé
- Animações de entrada nos cards e seções, com durações e curvas padronizadas em variáveis CSS (`--dur-*`, `--ease-*`)
- Som de interface opcional, ativado por um botão nas páginas que usam áudio

**Exploração**

- Home em formato de dashboard de exploração espacial
- Sistema solar simplificado na página inicial, com destaque do planeta selecionado
- Busca e comparação entre planetas
- Página dinâmica de detalhe dos planetas
- Visualização 3D com loader, zoom, rotação automática, hotspots clicáveis, painel contextual e tela cheia
- Simulação do tempo da luz e simulador de missões
- Missão recomendada e evento astronômico da semana
- Página de missões com timeline, tripulação, tecnologias, resultados e galeria
- Calendário astronômico com filtros, busca, eventos futuros em primeiro lugar e marcação dos que já ocorreram

**Progresso do usuário**

- Estatísticas de uso por navegador, começando em zero
- Favoritos de planetas e eventos astronômicos

## Estatísticas do usuário

- `src/services/exploration-progress-service.js` guarda tudo em uma única chave do localStorage (`bspaceUserStats`).
- Não há login: cada navegador recebe um identificador anônimo (`profileId`) criado na primeira visita.
- Métricas: planetas explorados, eventos visualizados, missões exploradas, curiosidades descobertas, missões simuladas, pesquisas realizadas e favoritos.
- Itens exploráveis são guardados como conjuntos sem repetição, então recarregar a página ou repetir a mesma ação não duplica a contagem.
- Pesquisas só contam quando o usuário para de digitar um termo com pelo menos 2 letras diferente do último contado.
- A home se atualiza sozinha quando as estatísticas mudam, inclusive a partir de outra aba.
- O botão "Zerar estatísticas" apaga os dados daquele navegador.

## Acessibilidade

- A seta no canto inferior direito abre o painel com tamanho do texto, alto contraste, redução de animações, links sublinhados e espaçamento de leitura.
- Essa seta, o botão de voltar ao topo e o botão de som ficam agrupados no mesmo painel flutuante (`.a11y-dock`), montado em `src/components/site-shell.js`, para não se sobreporem.
- O painel abre acima da seta, fecha com `Esc`, com clique fora ou quando o foco sai do grupo, e devolve o foco para a seta.
- As preferências ficam em `bspaceA11yPreferences` e são aplicadas antes da primeira pintura por `src/utils/accessibility-boot.js`, evitando o "salto" de fonte e contraste.
- O projeto respeita `prefers-reduced-motion`, além da preferência manual de reduzir animações.
- Todas as páginas têm link "Pular para o conteúdo principal", foco visível e anúncios para leitores de tela via `src/utils/announce.js`.
- O modelo 3D pode ser controlado pelo teclado: setas giram, `+` e `-` aproximam ou afastam e `R` centraliza.

## Como continuar o desenvolvimento

- Para adicionar um planeta, edite apenas `src/data/planets.js`.
- Para alterar curiosidades, edite `src/data/curiosities.js`.
- Para alterar tipos de missão, edite `src/data/mission-types.js`.
- Para adicionar eventos fixos ao calendário, edite `src/data/astronomy-events.js`.
- Para criar uma nova página: adicione um `data-page` no `<body>`, crie um módulo em `src/pages/` e registre esse módulo em `src/pages/app.js`.

## Licença

Distribuído sob a licença ISC. Veja [LICENSE](LICENSE).
