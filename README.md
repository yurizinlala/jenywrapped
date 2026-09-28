# Jeny Wrapped

Retrospectiva pessoal em 24 stories, com Next.js, React, TypeScript, Motion e CSS/SVG. Sem backend, autenticação ou banco de dados.

## Rodar

Use Node.js 20.9+ e pnpm 11. O lockfile é `pnpm-lock.yaml`.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Abra http://localhost:3000. No Windows, `Iniciar Jeny Wrapped.cmd` inicia o desenvolvimento após a instalação das dependências.

## Navegação

Cada story fica na tela por tempo indefinido. Não existe avanço automático, botão de pausa ou pausa ao segurar.

- O botão da capa inicia a experiência.
- Toque na esquerda para voltar; à direita para avançar.
- Setas inferiores, swipe horizontal, setas do teclado e Espaço também navegam.
- Cenas com várias páginas de texto avançam uma página por vez.
- O cabeçalho mostra a marca, o contador, som e reinício. Não há título da cena nem catálogo de músicas.
- O card final permite rever e baixar um PNG de 1080×1920.
- A preferência de movimento reduzido simplifica os efeitos visuais.

## Som

Stories sem música tocam um efeito curto ao entrar ou mudar de página. Os sons são sintetizados localmente com Web Audio, sem downloads ou faixas de terceiros. Os motivos e volumes ficam em `src/components/SoundEffects.tsx`. A capa inicial fica silenciosa até uma interação.

O botão de som controla tanto os efeitos quanto as músicas. Trocar de cena, reiniciar ou ocultar a aba interrompe o áudio correspondente. As cenas musicais não recebem efeitos por cima da faixa. Os efeitos não ficam repetindo durante a leitura.

As músicas usam o controller oficial do Spotify em segundo plano, sem players ou links visíveis e sem elementos focáveis. Se a integração falhar, desligar e religar o som tenta novamente; o retorno da conexão também dispara uma tentativa. Alguns navegadores, especialmente Safari, podem bloquear a reprodução pelo controller mesmo após a interação na página. A disponibilidade e a duração das faixas dependem do Spotify; no teste sem login, foram entregues prévias de aproximadamente 18–30 segundos. O story continua na tela quando a prévia acaba. Para reprodução independente desse serviço, configure arquivos locais autorizados em `audioSrc`.

O site não implementa analytics próprio. A integração faz requisições ao Spotify, que possui suas próprias práticas de dados. Não é um produto oficial do Spotify.

## Personalizar

Edite `src/data/jeny.ts`:

- `identity`: nome, apelido, tratamento carinhoso, autor e ano. A identidade visual, os metadados e os textos parametrizados usam essa configuração.
- `scenes`: conteúdo, tema, transição e páginas (`beats`). Todas as cenas são manuais.
- `jenyWrapped.finalLetter`: páginas da carta; prefira aproximadamente 45 palavras por página para celulares pequenos.
- `jenyWrapped.photos`: caminhos e textos alternativos. Coloque as imagens em `public/memories/` e use `/memories/arquivo.webp`. Caminho vazio ou imagem indisponível mostra a composição geométrica.
- `jenyWrapped.share`: viagem, cor e estatísticas do card.

Para adicionar uma música, cadastre uma entrada em `jenyWrapped.songs`, com `id`, título, artista, cor e `spotifyTrackId`. Depois associe esse `id` ao campo `track` da cena desejada. A reprodução fica fora do layout, inclusive nas cenas que originalmente não eram musicais.

```ts
// Exemplo de associação, usando uma faixa já cadastrada:
{ id: "cinema", track: "anjos", /* demais campos da cena */ }
```

Para áudio autorizado local, preencha `audioSrc: '/audio/arquivo.mp3'` na faixa e coloque o arquivo em `public/audio/`. Ele tem preferência sobre Spotify. Caminhos públicos de ícone, fotos e áudio recebem automaticamente o prefixo de publicação; não precisa adicioná-lo aos dados.

As novas associações são: página 2 → Just the Way You Are (Bruno Mars); página 5 → Jenifer (Gabriel Diniz); página 8 → Sinais de Fogo (Preta Gil); página 18 → Exagerado (Cazuza); página 23 → Alinhamento Milenar (Jão), tocada novamente desde o início. A numeração segue o contador JW, com a capa em 00. Todas as faixas, incluindo as anteriores, ficam sem controles Spotify visíveis.

Textos livres podem conter referências narrativas específicas; revise-os ao adaptar a retrospectiva para outra pessoa. Os títulos de faixas e estatísticas editoriais continuam editáveis.

## Verificar

```sh
pnpm format:check
pnpm lint
pnpm test
pnpm exec playwright install chrome
pnpm test:e2e
pnpm build
pnpm typecheck
pnpm test:production
```

Playwright inicia o servidor de desenvolvimento automaticamente e cobre navegação manual, páginas internas, seis tamanhos de tela, download PNG, efeitos sonoros, mute, visibilidade e recuperação de falhas do Spotify. A integração nos testes específicos de áudio é simulada; não valida a reprodução de faixas em todas as contas Spotify.

O teste de produção inicia e encerra seu próprio servidor na porta 3001, lê o prefixo do build e verifica também o ícone. As imagens ficam em `test-results/`. A formatação aceita as quebras de linha do checkout; `.gitattributes` padroniza arquivos de texto futuros.

Debug local: http://localhost:3000/?debug=1 permite saltar entre cenas. Não é incluído na versão de produção.

## Publicar

`pnpm build` exporta o site em `out/`. `pnpm start` serve um build local na porta 3000.

No GitHub Actions, o prefixo padrão é `/jenywrapped`. Para outro endereço, configure `NEXT_PUBLIC_BASE_PATH` no build. Para testar localmente uma exportação com prefixo, use o mesmo valor em `BASE_PATH` ao executar `pnpm start`; o teste de produção faz isso automaticamente.

O workflow valida pull requests e só publica pushes em `main` ou execuções manuais, após formatação, lint, testes unitários, testes de navegador, build e smoke de produção passarem. Nenhuma publicação é feita apenas por editar arquivos localmente.

## Arquitetura

`StoryEngine` mantém índice, página interna e visibilidade, sem relógio de avanço. `Scenes` compõe as páginas. `StoryAudio` controla as fontes musicais e sua recuperação; `SoundEffects` sintetiza os efeitos. `Primitives` concentra os elementos visuais, `ShareCard` exporta o PNG e `publicAsset` resolve caminhos no host estático. As fontes são locais via pacote `@fontsource-variable/space-grotesk`.
