# Jeny Wrapped 2026

Uma retrospectiva pessoal em 24 stories, feita por Yuri para Jeny. Next.js 16, React, TypeScript, Motion e CSS/SVG originais. Sem backend, banco de dados, autenticação ou serviços de rastreamento.

## Rodar

Use Node.js 20.9+ e pnpm 10+ (ou npm).

```sh
pnpm install
pnpm dev
```

No computador desta entrega, você também pode abrir `Iniciar Jeny Wrapped.cmd`, que usa o Node disponível no ambiente do Codex quando ele não está no PATH. Abra http://localhost:3000. Scripts equivalentes: `npm install` e `npm run dev`. O lockfile versionado é `pnpm-lock.yaml`; prefira pnpm para reproduzir as mesmas versões.

```sh
pnpm format
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

`pnpm build` gera um site estático em `out/`. Para visualizar essa saída, use `pnpm start` (ou `npm start`). O script usa um servidor estático incluído no projeto.

## Personalização rápida para Yuri

Edite **src/data/jeny.ts**:

- `jenyWrapped.person` e `year`: nome, apelido e edição.
- `scenes`: títulos, legendas, estatísticas, duração em milissegundos e `auto`.
- `beats`: páginas dentro de uma história manual. Cada toque avança uma página; o progresso superior avança proporcionalmente.
- `jenyWrapped.finalLetter`: cinco páginas da carta. Pode editar e adicionar páginas. Mantenha cada página com aproximadamente 45 palavras para caber em celulares pequenos.
- `jenyWrapped.songs`: títulos, artistas, cores e IDs oficiais do Spotify.
- `jenyWrapped.photos`: caminho e texto alternativo das fotos.
- `jenyWrapped.share`: dados de destaque do card.

O layout e a coreografia ficam em `src/components/Scenes.tsx`. Cores, espaços, variantes móveis e desenhos ficam em `src/styles/globals.css`. As transições compartilhadas ficam em `src/lib/motion.ts`.

## Fotos

Coloque fotos autorizadas e comprimidas em `public/memories/`. Sugestões:

- `cinemark-01.webp`, `cinemark-02.webp`
- `joao-pessoa-01.webp`, `joao-pessoa-02.webp`
- `joao-pessoa-zoo.webp`, `joao-pessoa-lagoa.webp`
- `jeny-01.webp`, `together-01.webp`

Depois configure, por exemplo, `photos.trip.src: '/memories/joao-pessoa-01.webp'`. Caminhos vazios ou imagens que falharem usam uma composição geométrica original, sem ícone de imagem quebrada. Nenhuma foto pessoal foi inventada. Os rótulos de arquivo sugerido ficam apenas nos dados.

## Músicas

As cinco faixas já têm IDs oficiais do Spotify. Depois de começar a retrospectiva, cada cena musical carrega seu player e solicita reprodução automaticamente. Pausar, silenciar, trocar de cena ou ocultar a aba interrompe a reprodução. Alguns navegadores (principalmente Safari) e condições da conta Spotify exigem um toque no player; nesse caso há um botão de play visível. A duração disponível é determinada pelo Spotify.

Você também pode configurar `audioSrc: '/audio/seu-arquivo-autorizado.mp3'` para uma gravação que tenha autorização para distribuir. Ela usa o mesmo controle de início, pausa e som. Nenhuma faixa comercial foi baixada ou incluída no repositório.

## Navegação

- Botão na capa inicia a experiência.
- Toque no terço esquerdo: voltar. Toque à direita: avançar.
- Arraste horizontalmente para trocar de história.
- Segure para pausar; solte para retomar.
- Setas esquerda/direita e Espaço navegam quando o foco não está num controle.
- Botão de pausa ou tecla P pausa explicitamente.
- Player aberto e aba oculta pausam a contagem.
- Anjos, Azul, Alinhamento, declaração e carta aguardam cada toque.
- O botão de recomeçar volta à capa. O card final tem replay e download PNG 1080×1920, sem controles.
- Preferências de movimento reduzido simplificam os efeitos sem retirar conteúdo.

Os números absurdos são piadas, não medições reais. Não há coleta de dados. O tempo total depende da leitura das cenas manuais, com cerca de dois minutos de cenas automáticas mais as páginas de leitura.

## Debug

Em desenvolvimento: http://localhost:3000/?debug=1. O painel permite saltar entre cenas, pausar e consultar estado/duração. Ele não existe no build de produção, mesmo com a query string.

## Verificação no navegador

```sh
pnpm exec playwright install chrome
pnpm dev
# Em outro terminal:
pnpm exec playwright test
```

Os testes cobrem navegação, pausas, páginas manuais, modal, exportação e os seis tamanhos do briefing. Imagens de revisão ficam em `test-results/` (ignoradas pelo Git).

## Deploy

O projeto é exportado estaticamente, sem segredos ou variáveis de ambiente obrigatórias. Na Vercel, importe a pasta como projeto Next.js e execute `pnpm build`. Em um host estático, publique somente a pasta `out/` gerada. O projeto também está configurado para publicação privada no Sites, com saída estática em `out/`.

## Arquitetura

`StoryEngine` mantém índice, página, entrada e razões independentes de pausa. Um único `requestAnimationFrame` conta tempo ativo; voltar, avançar ou reiniciar zera esse tempo. A visibilidade do documento e o modal interrompem o mesmo relógio. O progresso é atualizado diretamente no elemento, sem renderizar toda a árvore a cada frame. Apenas a cena atual e a transição de saída permanecem montadas. Tudo componentizado para facilitar modulação.

Os gráficos e capas são autorais. Fontes locais via pacote `@fontsource-variable/space-grotesk`, sem requisição ao Google Fonts. O único serviço externo é o Spotify, carregado nas cenas musicais após iniciar a retrospectiva. Não é um produto oficial do Spotify.
