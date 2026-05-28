28/03 - Estrutura refatorada do BSpace

Pastas:
- assets/: arquivos estáticos
- styles/: CSS compartilhado e CSS específicos de página
- *.html: páginas do site

Principais ajustes:
- Separação entre HTML e CSS
- Correção da página de missões (agora em missoes.html)
- Remoção de CSS inline repetido
- Padronização visual e responsiva
- Navegação corrigida entre páginas

_________________________________________________________________________________________________________________________________________________
28/03 - Projeto BSpace - versão completa com HTML, CSS e JavaScript

Estrutura:
- assets/: imagens e logo
- styles/: CSS base e estilos por página
- scripts/: JavaScript global do site
- *.html: páginas do site

Funcionalidades JS:
- destaque automático do link ativo no menu
- botão voltar ao topo
- ano automático no rodapé
- animação suave nos cards e seções
- curiosidade aleatória na página curiosidades

_______________________________________________________________________________________________________________________________________________
02/04 - Projeto BSpace refatorado novamente

Nova estrutura:
- index.html
- planetas.html
- planeta.html
- curiosidades.html
- missoes.html
- styles/
- scripts/

Principal mudança:
As 8 páginas individuais dos planetas foram substituídas por 1 único arquivo: planeta.html

Como funciona:
- O arquivo planeta.html permanece fixo.
- O JavaScript lê o parâmetro da URL, por exemplo:
  planeta.html?nome=marte
- Em seguida, o script planeta.js busca os dados no objeto "planetas"
  e preenche a página dinamicamente.

Vantagens:
- Menos arquivos HTML
- Menos repetição de código
- Manutenção mais fácil
- Base pronta para evoluir depois com filtros, busca e modelos 3D
_______________________________________________________________________________________________________________________________________________

Atividade de Git add no Projeto !

_______________________________________________________________________________________________________________________________________________

13/05/2026: Adicionado Modelos de planetas em 3D na Terra, Jupiter, marte, saturno, venus

Problemas encontrados:
O modelo em 3d do planeta Saturno está com o contraste muito alto, necessário encontrar forma de arrumar o planeta e os aneis separadamente.

_______________________________________________________________________________________________________________________________________________

28/05/2026: Fases 1, 2 e 3 integradas ao site existente

Fase 1 - Refinamento:
- Melhorias de visual, foco, navegacao responsiva e performance leve
- Imagens dinamicas dos planetas usando assets locais
- Scroll otimizado e imagens com carregamento/decodificacao assincrona

Fase 2 - Interatividade:
- Sistema solar simplificado na pagina inicial
- Quiz interativo na pagina de curiosidades
- Simulacao de tempo da luz e simulador de missoes
- Busca e comparacao entre planetas na pagina de planetas

Fase 3 - Experiencia Premium:
- Perfil local de usuario
- XP, niveis e feedback de gamificacao
- Sons opcionais
- Trilha IA demonstrativa baseada no progresso
