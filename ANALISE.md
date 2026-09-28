**Registro histórico:** esta análise descreve o commit original. As correções e a navegação manual solicitadas posteriormente estão implementadas no código local; consulte o README para o funcionamento atual. As quatro novas faixas e a repetição de Alinhamento Milenar no card final foram configuradas conforme a escolha do usuário, com reprodução sem interface visível.

Análise do Jeny Wrapped — 28/09/2026

Repositório: https://github.com/yurizinlala/jenywrapped

Branch analisada: `main`. Commit: `ec2e671b6e44f312c713af511624c07ef9a16d7a`.

O projeto está funcional para sua proposta: uma retrospectiva pessoal, com identidade visual própria, navegação por stories e integração com Spotify. O build e os testes existentes passaram. Os problemas encontrados concentram-se na recuperação de falhas do áudio, na publicação em subdiretório e em algumas diferenças entre a personalização documentada e a implementação.

**Escopo e arquitetura**

Foram revisados os componentes, dados, estilos, utilitários, testes, scripts, documentação, configurações de ferramentas e workflow de publicação versionados. A validação local usou Windows, Node 24.13.1, pnpm 11.19.0 e Chrome.

As versões efetivamente instaladas pelo lockfile foram Next.js 16.3.6, React/React DOM 19.3.0, Motion 12.43.0, TypeScript 5.9.3 e Playwright 1.63.0. Elas podem diferir dos limites mínimos declarados no package.json.

O site possui uma rota principal e exportação estática. Não há backend de negócio, banco, login ou persistência de progresso. Os dados pessoais e textos estão no código entregue ao navegador.

| Arquivo ou conjunto              | Responsabilidade                                                       | Avaliação                                                                           |
| -------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `src/data/jeny.ts`               | Conteúdo, faixas, fotos, carta e configuração de cenas                 | Boa centralização, com partes da identidade ainda fixas nos componentes             |
| `src/components/StoryEngine.tsx` | Índice, páginas internas, gestos, teclado, progresso e razões de pausa | Organização clara; contador temporal evita renderização da árvore a cada frame      |
| `src/lib/story.mjs`              | Avançar, voltar e calcular fase                                        | Funções pequenas, puras e cobertas por testes                                       |
| `src/components/Scenes.tsx`      | Composição visual das 24 cenas                                         | Adequado ao projeto atual; switch extenso dificulta ampliar o catálogo              |
| `src/components/StoryAudio.tsx`  | Spotify e áudio local                                                  | Integração principal funciona nos testes; caminhos de falha precisam de revisão     |
| `src/components/MusicDialog.tsx` | Seleção de músicas e player em modal                                   | Dialog nativo e restauração de foco; preferência de fonte difere das cenas          |
| `src/components/ShareCard.tsx`   | Card e exportação Canvas para PNG                                      | Download validado; representação visual e Canvas exigem manutenção em dois lugares  |
| `src/components/Primitives.tsx`  | Tipografia animada, formas, fotos e contador                           | Reutilização útil; contador não respeita a pausa global                             |
| `src/styles/globals.css`         | Temas, cenas, responsividade e animações                               | Cerca de 3 mil linhas, com regras antigas e sobrescritas posteriores                |
| `src/app/*`                      | Entrada, metadados, loading e erro                                     | Estrutura enxuta e compatível com exportação estática                               |
| `scripts/serve.mjs`              | Servir a pasta out localmente                                          | Suficiente para o preview usado; não equivale à configuração de um host de produção |
| `.github/workflows/pages.yml`    | Build e publicação no GitHub Pages                                     | Build validado localmente; faltam testes e lint como bloqueios de publicação        |

Há 24 cenas: 16 automáticas e 8 manuais, contando capa e encerramento. As automáticas somam 112 segundos de duração configurada, além das transições. As cenas com texto paginado contêm 22 páginas. A experiência oferece toque, swipe, teclado, pausa, músicas, carta final e PNG de 1080 × 1920.

As fotos ainda têm caminhos vazios. Por isso aparecem composições geométricas, conforme previsto. Apenas os espaços de cinema e viagem são utilizados nas cenas atuais; o cadastro `together` não é renderizado.

**Resultados da validação**

| Verificação                          | Resultado                                                                          |
| ------------------------------------ | ---------------------------------------------------------------------------------- |
| `pnpm install --frozen-lockfile`     | Passou sem alteração do lockfile                                                   |
| `pnpm lint`                          | Passou                                                                             |
| `pnpm typecheck`                     | Passou                                                                             |
| `pnpm test`                          | 4 de 4 testes passaram                                                             |
| `pnpm build`                         | Passou e gerou exportação estática                                                 |
| Build com `GITHUB_ACTIONS=true`      | Passou; prefixo `/jenywrapped` confirmado no bundle                                |
| `pnpm exec playwright test`          | 11 de 11 testes passaram, em aproximadamente 3 minutos                             |
| `node scripts/verify-production.mjs` | Passou: título, capa, navegação, pausa, ausência de debug e de exceções capturadas |
| Download do card                     | PNG gerado e inspecionado visualmente                                              |
| `pnpm format:check`                  | Falhou por quebras de linha CRLF do checkout Windows                               |
| Prettier com `--end-of-line auto`    | Todos os arquivos originais passaram                                               |

Os testes de layout percorreram as 24 cenas em 320×568, 360×800, 390×844, 430×932, 768×1024 e 1440×900. Verificam limites de determinados elementos e usam movimento reduzido. Isso não cobre todas as sobreposições durante animações, todas as páginas da carta ou navegadores diferentes. As capturas e o card estão em `test-results/`, pasta ignorada pelo Git.

**Problemas encontrados, por prioridade**

1. **Prioridade média — player alternativo perde os controles globais.** Em `src/components/StoryAudio.tsx:180`, uma falha na API cria um iframe direto. As operações de pausa e som atuam apenas no controller, que não existe nesse caminho. Ao simular falha, confirmei que o mesmo iframe permanece montado após silenciar e pausar. Portanto, um áudio iniciado nele não recebe esses comandos; também pode coexistir com o player do modal. O teste atual verifica apenas a presença e URL desse iframe. Corrigir mantendo uma fonte controlável, desmontando o embed nas condições de interrupção ou oferecendo um link externo quando não houver controle. A reprodução audível do serviço externo não foi usada como evidência dessa reprodução controlada.

2. **Prioridade média — falha inicial do Spotify fica armazenada até recarregar.** Em `src/components/StoryAudio.tsx:43`, `apiPromise` é global e permanece preenchida mesmo quando rejeitada por erro ou timeout. Reproduzi bloqueando o carregamento da API: ao mudar de Anjos para Azul houve apenas uma tentativa de carregar o script, e a segunda cena já entrou em `failed`. Limpar a promessa rejeitada e permitir nova tentativa, com limpeza de script e callback, resolveria essa recuperação.

3. **Prioridade média para mídias; baixa para o ícone — caminhos absolutos ignoram o prefixo do GitHub Pages.** `next.config.ts:6` define `/jenywrapped`, mas `src/app/layout.tsx:7` usa `/icon.svg`. No HTML gerado com a configuração do CI, confirmei que scripts têm `/jenywrapped/_next/...`, enquanto o ícone continua em `/icon.svg`. Em Pages de projeto, ele aponta para a raiz do domínio. `PhotoFrame` (`Primitives.tsx:110`) e áudio local (`StoryAudio.tsx:226`) também recebem os caminhos diretamente: seguir os exemplos `/memories/...` e `/audio/...` do README produzirá o mesmo problema quando essas mídias forem adicionadas. Hoje as fotos vazias evitam que essa falha apareça. Centralizar a resolução dos caminhos públicos considerando o prefixo.

4. **Prioridade média ao configurar áudio local — modal e cena escolhem fontes diferentes.** `StoryAudio.tsx:236` prefere `audioSrc`, mas `MusicDialog.tsx:61` prefere um ID Spotify válido. Todas as faixas atuais já possuem IDs válidos. Ao adicionar somente `audioSrc`, a cena usa o arquivo local e o modal continua usando Spotify. Constatação por leitura dos ramos de renderização; não há arquivo local no projeto para testar esse caso completo. Unificar a seleção de fonte e os controles.

5. **Prioridade baixa — contador continua durante a pausa.** `Primitives.tsx:187` cria uma animação independente do estado global; `globals.css:340` pausa apenas animações CSS. Reproduzi na cena `effect`: com `data-status="paused"`, o número avançou de 796% para 847% em 800 ms. Conectar a animação do contador ao estado de pausa.

6. **Prioridade baixa — personalização de nome e ano é parcial.** O README orienta editar `jenyWrapped.person` e `year`, mas o objeto `person` não é consumido pelos componentes, e vários textos de identidade e edição permanecem fixos. Exemplos: `Scenes.tsx:48`, `Scenes.tsx:56`, `StoryEngine.tsx:183`, `ShareCard.tsx:39` e `layout.tsx:5`. Alterar somente os dados pode criar uma retrospectiva com nomes ou anos misturados. Derivar esses elementos da mesma configuração ou documentar precisamente os pontos que exigem edição.

**Manutenção e cobertura**

O workflow publica após instalar dependências e gerar o build. Ele não executa lint, testes unitários ou Playwright. Adicionar essas verificações antes do deploy e um fluxo de validação para pull requests reduziria regressões. O build já verifica TypeScript; não se trata de ausência total de validação.

O teste de áudio com controller simulado valida troca de faixa e mute, mas, apesar do título mencionar pausa, não clica na pausa global. A falha de Spotify só é testada pela presença do embed. Convém cobrir pausa real do controller, recuperação de rede, áudio local, visibilidade da aba e caminhos com basePath. Não há validação executada em Safari ou Firefox.

O CSS contém sobras de composições anteriores, como `.terminal`, `.file-window` e `.denial`, e várias sobrescritas na seção de segunda edição. `TrackCard` também é exportado sem uso nas cenas atuais. Uma limpeza guiada pela renderização atual facilitaria alterações sem mudar a identidade visual.

Os tipos poderiam restringir IDs, temas, referências de foto e faixa, além de declarar linhas como pares de strings. Hoje `Scene.id`, `theme`, `track` e `photo` são strings amplas, e `rows` é `string[][]`. Isso permite erros de configuração que passam pela compilação.

O projeto não implementa analytics próprio, mas carrega conteúdo externo do Spotify. A frase do README sobre ausência de coleta deve distinguir o código local do comportamento do serviço incorporado. O modal também pode carregar Spotify antes do início da retrospectiva, pois está disponível na capa.

**Próxima sequência recomendada**

1. Corrigir controle e recuperação de falhas do áudio.
2. Uniformizar caminhos de mídia para GitHub Pages e a preferência por áudio local.
3. Incluir regressões desses casos e executar os checks no CI.
4. Centralizar identidade/ano e ajustar a pausa do contador.
5. Limpar estilos sem uso e refinar os tipos conforme o projeto evoluir.

A análise não alterou a implementação nem publicou mudanças. O relatório foi adicionado localmente. Os testes comprovam os fluxos descritos acima; não confirmam publicação remota nem reprodução completa das faixas em todas as contas e navegadores.
