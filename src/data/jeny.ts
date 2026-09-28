export type Track = {
  id: string;
  title: string;
  artist: string;
  color: string;
  spotifyTrackId: string;
  audioSrc?: string;
};
export type Scene = {
  id: string;
  chapter: string;
  theme:
    | "lime"
    | "pink"
    | "orange"
    | "violet"
    | "yellow"
    | "ink"
    | "coral"
    | "blue"
    | "periwinkle"
    | "sky"
    | "navy";
  title: string;
  kicker?: string;
  note?: string;
  beats?: string[];
  rows?: [string, string][];
  track?: string;
  photo?: "cinema" | "trip" | "together";
  transition: "slam" | "circle" | "wipe" | "soft";
};
export const identity = {
  year: 2026,
  person: { name: "Jennifer", nickname: "Jeny", affectionateName: "meu bem" },
  author: "Yuri",
};
export const jenyWrapped = {
  ...identity,
  intro: "uma retrospectiva completamente imparcial",
  songs: [
    {
      id: "just-the-way",
      title: "Just the Way You Are",
      artist: "Bruno Mars",
      color: "#ff77bd",
      spotifyTrackId: "7BqBn9nzAq8spo5e7cZ0dJ",
    },
    {
      id: "jenifer",
      title: "Jenifer",
      artist: "Gabriel Diniz",
      color: "#bfa3ff",
      spotifyTrackId: "7wMAgaPiKzTNxpDWu2BPfk",
    },
    {
      id: "sinais-de-fogo",
      title: "Sinais de Fogo",
      artist: "Preta Gil",
      color: "#ff705e",
      spotifyTrackId: "7D9BJEcWwRqvQVqPbj1dbF",
    },
    {
      id: "exagerado",
      title: "Exagerado",
      artist: "Cazuza",
      color: "#123df5",
      spotifyTrackId: "4d0DpU7Odiv0ztvX2GxJlk",
    },
    {
      id: "anjos",
      title: "Anjos",
      artist: "VENERE VAI VENUS",
      color: "#bfa3ff",
      spotifyTrackId: "3tHfEsbQsvAdGQ2CUFeEx0",
    },
    {
      id: "jvke",
      title: "this is what falling in love feels like",
      artist: "JVKE",
      color: "#dfff00",
      spotifyTrackId: "4UG2Fm0E98LhE2dlNxiAXx",
    },
    {
      id: "azul",
      title: "Azul",
      artist: "Gal Costa",
      color: "#68dbff",
      spotifyTrackId: "6VeAUISn8bNaW4OUa2oWi2",
    },
    {
      id: "alinhamento",
      title: "Alinhamento Milenar",
      artist: "Jão",
      color: "#ffae83",
      spotifyTrackId: "741Aeks1h7InLiTSWXMV7c",
    },
    {
      id: "cajuzinho",
      title: "Cajuzinho",
      artist: "Mara Maravilha",
      color: "#ff77bd",
      spotifyTrackId: "3fwPfeKpjmf1vZLtKk4PIT",
    },
  ] as Track[],
  photos: {
    cinema: {
      src: "",
      suggested: "cinemark-01.webp",
      alt: `Uma memória de ${identity.author} e ${identity.person.nickname} no Cinemark`,
      label: "onde tudo começou",
    },
    trip: {
      src: "",
      suggested: "joao-pessoa-01.webp",
      alt: `${identity.author} e ${identity.person.nickname} em João Pessoa`,
      label: "João Pessoa · nós dois",
    },
    together: {
      src: "",
      suggested: "together-01.webp",
      alt: `${identity.author} e ${identity.person.nickname} juntos`,
      label: "minha pessoa favorita",
    },
  },
  share: {
    topTrip: "João Pessoa",
    color: "Azul",
    chaos: "98,7%",
    affection: "100%",
  },
  finalLetter: [
    `${identity.person.nickname}, eu fiz esse negócio inteiro brincando com números, músicas e estatísticas que provavelmente seriam rejeitadas por qualquer instituição minimamente séria. Mas essa parte não é brincadeira.`,
    "Desde o Cinemark, das caronas, dos filmes e das conversas, você foi se tornando uma pessoa cada vez mais importante para mim. Esses momentos pareciam pequenos na hora. Hoje eu vejo o tamanho que eles têm.",
    "Eu gosto das nossas provocações, dos chocolates, de João Pessoa e das músicas que começaram a ter seu nome sem terem seu nome. Eu nem sabia quantas memórias boas estava criando enquanto vivia tudo isso com você.",
    `Eu gosto de você, ${identity.person.nickname}. Gosto muito. Da sua companhia, do seu jeito, das nossas conversas e até do caos inexplicável que parece surgir ao seu redor.`,
    `De todas as pessoas que poderiam ter aparecido na minha vida naquele Cinemark, eu fico feliz demais que tenha sido você. ${identity.person.affectionateName.charAt(0).toUpperCase() + identity.person.affectionateName.slice(1)}, você virou uma das minhas pessoas favoritas. E eu quero muito continuar criando histórias com você.`,
  ],
};
export const scenes: Scene[] = [
  {
    id: "cover",
    chapter: "a edição dela",
    theme: "lime",
    title: `${identity.person.nickname.toUpperCase()} WRAPPED`,
    transition: "circle",
  },
  {
    id: "scan",
    chapter: "as melhores lembranças",
    theme: "ink",
    title: `${identity.person.nickname.toUpperCase()}.`,
    kicker: "e no meio de tudo…",
    note: "puta merda.",
    transition: "slam",
  },
  {
    id: "effect",
    track: "just-the-way",
    chapter: `o efeito ${identity.person.nickname}`,
    theme: "pink",
    title: "847%",
    kicker: "PENSAMENTOS NELA",
    note: "não fiz as contas direito. mas era muito pensamento em você.",
    rows: [
      ["produtividade", "12%"],
      ["sono", "8%"],
      ["sanidade", "3%"],
    ],
    transition: "slam",
  },
  {
    id: "cinema",
    chapter: "a cena de abertura",
    theme: "orange",
    title: "CINE\nMARK.",
    kicker: "ONDE TUDO COMEÇOU",
    note: "colegas de trabalho → amigos → hmmmm.",
    photo: "cinema",
    transition: "wipe",
  },
  {
    id: "updates",
    chapter: "de pouquinho em pouquinho",
    theme: "lime",
    title: "QUANDO\nEU VI…",
    kicker: "JÁ FAZIA PARTE DOS MEUS DIAS",
    rows: [
      ["+", "uma carona virava conversa"],
      ["+", "um filme virava outro"],
      ["+", "rolês com os amigos"],
      ["+", "as conversas ficavam maiores"],
      ["+", "as provocações, também"],
      ["+", `e apareceu um “${identity.person.affectionateName}”`],
      ["−", "minha pose de “só amizade”"],
    ],
    note: "só amizade. aham.",
    transition: "wipe",
  },
  {
    id: "nickname",
    track: "jenifer",
    chapter: `${identity.author} sendo ${identity.author}`,
    theme: "violet",
    title: "meu tamburetezinho de forró",
    kicker: "E GANHOU ATÉ APELIDO",
    note: "CARINHO COM SOBRENOME.",
    transition: "circle",
  },
  {
    id: "chaos",
    chapter: "ela também fez história",
    theme: "yellow",
    title: "UM TAL\nDE CAOS.",
    kicker: `${identity.person.nickname.toUpperCase()} EM CASA`,
    rows: [
      ["energia elétrica", "questionável"],
      ["frigideiras", "em alerta"],
      ["caos doméstico", "98,7%"],
      ["chance de virar história", "100%"],
    ],
    note: `amostra: uma ${identity.person.nickname}. confiança: discutível.`,
    transition: "circle",
  },
  {
    id: "blackout",
    chapter: "incidente nº 001",
    theme: "ink",
    title: "COINCI\nDÊNCIA?",
    kicker: "a investigação continua",
    rows: [
      ["01", `${identity.person.nickname} foi morar sozinha.`],
      ["02", "Uma luz deu problema."],
      ["03", "A rua ficou sem energia."],
    ],
    note: "nenhuma conclusão juridicamente válida.",
    transition: "slam",
  },
  {
    id: "pan",
    track: "sinais-de-fogo",
    chapter: "um minuto de silêncio",
    theme: "coral",
    title: "EM\nMEMÓRIA",
    kicker: "à frigideira",
    note: `que não tankou a experiência ${identity.person.nickname}. Ela dormiu. A panela virou história.`,
    transition: "circle",
  },
  {
    id: "music",
    chapter: "a trilha mudou",
    theme: "blue",
    title: `${jenyWrapped.songs.length} MÚSICAS.\n1 PESSOA.`,
    kicker: "MAS AÍ AS MÚSICAS COMEÇARAM A MUDAR.",
    note: "eu apertava o play. e pensava em você.",
    transition: "circle",
  },
  {
    id: "anjos",
    chapter: "antes de nós",
    theme: "periwinkle",
    title: "ANJOS",
    track: "anjos",
    beats: [
      "tem música que lembra alguém depois.",
      "essa lembrava você antes.",
      "eu provavelmente já devia ter entendido.",
    ],
    transition: "soft",
  },
  {
    id: "secret",
    chapter: "essa eu guardava pra mim",
    theme: "ink",
    title: "EU NEM\nDISFARÇAVA.",
    kicker: "EU DIZIA QUE ERA SÓ UMA MÚSICA.",
    note: "desde que te conheci. essa sempre foi muito sua.",
    track: "jvke",
    transition: "wipe",
  },
  {
    id: "azul",
    chapter: "a cor do ano",
    theme: "blue",
    title: "AZUL",
    track: "azul",
    beats: [
      "qual foi a cor do ano?",
      "sua cor favorita. agora faz sentido, né?",
      "você estava deixando tudo azul sem perceber.",
    ],
    transition: "circle",
  },
  {
    id: "trip",
    chapter: "um capítulo à parte",
    theme: "sky",
    title: "JOÃO\nPESSOA.",
    kicker: "E ENTÃO VEIO",
    photo: "trip",
    note: "a rota era nova. a companhia era você.",
    transition: "wipe",
  },
  {
    id: "firsts",
    chapter: "primeiras vezes",
    theme: "blue",
    title: "PRIMEIRA\nDE MUITAS.",
    rows: [
      ["1º", "carro alugado"],
      ["1ª", "viagem tão longe dirigindo sozinho"],
      ["↗", "João Pessoa, zoológico & lagoa"],
      ["↗", "Santa Rita: sua comunidade, gente nova"],
    ],
    note: "e nós dois no meio disso tudo.",
    transition: "wipe",
  },
  {
    id: "tripstats",
    chapter: "o balanço da viagem",
    theme: "navy",
    title: "MUITAS.",
    kicker: "MEMÓRIAS",
    rows: [
      ["carros alugados", "1"],
      [`${identity.author}s ligeiramente tensos`, "1"],
      [`${identity.person.nickname}s`, "1"],
      ["lugares", "vários"],
      ["vontade de viajar de novo", "100%"],
    ],
    note: "quilômetros? muitos. sem inventar GPS.",
    transition: "circle",
  },
  {
    id: "alignment",
    chapter: "hora certa",
    theme: "navy",
    title: "ALINHAMENTO\nMILENAR",
    track: "alinhamento",
    beats: [
      "algumas músicas marcam viagens.",
      "algumas marcam pessoas.",
      "essa conseguiu fazer os dois.",
    ],
    note: `JOÃO PESSOA / ${identity.year}`,
    transition: "circle",
  },
  {
    id: "candy",
    chapter: `coisas que ${identity.author} gosta`,
    theme: "pink",
    title: `PRINCIPALMENTE\n${identity.person.nickname.toUpperCase()}.`,
    track: "cajuzinho",
    kicker: "cinema. música. viajar. chocolate.",
    note: "e inventar qualquer desculpa pra te ver.",
    transition: "slam",
  },
  {
    id: "top",
    track: "exagerado",
    chapter: "o ranking definitivo",
    theme: "blue",
    title: `${identity.person.nickname.toUpperCase()}`,
    kicker: "MINHA PESSOA Nº 1",
    note: "tempo pensando: juridicamente preocupante.",
    rows: [
      ["#2", "João Pessoa"],
      ["#3", "música"],
      ["#4", "chocolate"],
      ["#5", "cinema"],
    ],
    transition: "slam",
  },
  {
    id: "year",
    chapter: "os dados não mentem*",
    theme: "sky",
    title: `NOSSO ${identity.year}`,
    kicker: "EM NÚMEROS*",
    rows: [
      ["1", "viagem que eu não esqueço"],
      [String(jenyWrapped.songs.length), "músicas que ficaram diferentes"],
      ["???", "chocolates compartilhados"],
      ["muitas", "provocações desnecessárias"],
      ["1", "frigideira que virou lenda"],
      ["100%", "chance de você rir de mim"],
    ],
    note: "*alguns números inventados por razões científicas.",
    transition: "wipe",
  },
  {
    id: "truth",
    chapter: "agora, sem brincadeira",
    theme: "navy",
    title: "ok.",
    beats: [
      "ok.",
      "chega de estatística inventada.",
      "tem uma coisa aqui que é 100% verdade.",
    ],
    transition: "soft",
  },
  {
    id: "declaration",
    chapter: "a única estatística real",
    theme: "blue",
    title: `eu gosto de você, ${identity.person.nickname}.`,
    beats: [
      `eu gosto de você, ${identity.person.nickname}.`,
      "muito.",
      "e não é só porque você virou piada interna, música ou memória boa.",
      "eu gosto de estar com você. de conversar com você. das coisas que a gente vive.",
      "e gosto muito do lugar que você acabou ocupando na minha vida.",
    ],
    transition: "soft",
  },
  {
    id: "letter",
    chapter: `de ${identity.author}, para você`,
    theme: "navy",
    title: `${identity.person.affectionateName},`,
    beats: jenyWrapped.finalLetter,
    transition: "soft",
  },
  {
    id: "share",
    track: "alinhamento",
    chapter: "sua retrospectiva",
    theme: "blue",
    title: `${identity.person.nickname.toUpperCase()} WRAPPED`,
    transition: "circle",
  },
];
