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
  intro: "uma retrospectiva bem imparcial rsrs",
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
      src: "/memories/cinemark-01.webp",
      suggested: "cinemark-01.webp",
      alt: `Uma memória de ${identity.author} e ${identity.person.nickname} no Cinemark`,
      label: "pense num lugarzinho peculiar",
    },
    trip: {
      src: "/memories/joao-pessoa-01.webp",
      suggested: "joao-pessoa-01.webp",
      alt: `${identity.author} e ${identity.person.nickname} em João Pessoa`,
      label: "não tem sorriso mais sincero que esse",
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
    `${identity.person.nickname}, eu fiz esse negócio inteiro brincando com números, músicas e estatísticas que provavelmente seriam rejeitadas por qualquer instituição ou pessoa minimamente séria. Mas essa parte não é brincadeira.`,
    "Desde o Cinemark, das caronas, dos filmes, das conversas, dos rolês, você foi se tornando uma pessoa cada vez mais importante para mim. Esses momentos pareciam pequenos na hora mas desde cedo, eu via o tamanho da importância que eles têm.",
    "Eu gosto das nossas picuinhas, dos presentes, das viagens e das músicas que começaram a ter seu nome sem terem seu nome. Eu nem sabia quantas memórias boas estava criando enquanto vivia tudo isso com você.",
    `Eu gosto muito de você, ${identity.person.nickname}. Gosto muito mesmo. Da sua companhia, do seu jeito, das nossas conversas, do seu abraço, do seu cheiro, até mesmo do caos inexplicável que parece surgir ao seu redor.`,
    `De todas as pessoas que poderiam ter aparecido na minha vida naquele Cinemark e de todos os momentos quue você poderia ter aparecido, eu fico feliz demais que tenha sido você. ${identity.person.affectionateName.charAt(0).toUpperCase() + identity.person.affectionateName.slice(1)}, você virou uma das minhas pessoas favoritas. E eu quero muito continuar criando histórias com você.`,
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
    kicker: "e no meio de tudo isso…",
    note: "é, lascou...",
    transition: "slam",
  },
  {
    id: "effect",
    track: "just-the-way",
    chapter: `o efeito ${identity.person.nickname}`,
    theme: "pink",
    title: "847%",
    kicker: "PORCENTAGEM DO MEU DIA QUE EU PENSO NELA",
    note: "não fiz as contas direito, estava ocupado pensando em você.",
    rows: [
      ["rodar de uber", "37%"],
      ["pensar em bolsonaro", "22%"],
      ["sanidade", "0,00000005%"],
    ],
    transition: "slam",
  },
  {
    id: "cinema",
    chapter: "a cena de abertura",
    theme: "orange",
    title: "CINE\nMARK.",
    kicker: "ONDE TUDO COMEÇOU (E CONTINUOU)",
    note: "colegas de trabalho → amigos → por que meu coração tá batendo tão forte?",
    photo: "cinema",
    transition: "wipe",
  },
  {
    id: "updates",
    chapter: "de pouquinho em pouquinho",
    theme: "lime",
    title: "ALGO FOI CRESCENDO",
    kicker: "DE POUQUINHO EM POUQUINHO…",
    rows: [
      ["+", "caronas que viravam conversa"],
      ["+", "filmes que viravam dates"],
      ["+", "conversas maiores e profundas"],
      ["+", "provocações frequentes"],
      ["+", `mais “${identity.person.affectionateName}” nas conversas`],
      ["+", "minha pose de “só amizade”"],
    ],
    note: "só amizade. aham.",
    transition: "wipe",
  },
  {
    id: "nickname",
    track: "jenifer",
    chapter: `${identity.author} sendo ${identity.author}`,
    theme: "violet",
    title: "meu tamburete de forró",
    kicker: "MEU MELHOR APELIDO DADO ATÉ AGORA",
    note: "nunca descreveu alguém tão bem, né meu tamburetezinho?",
    transition: "circle",
  },
  {
    id: "chaos",
    chapter: "ela também fez história",
    theme: "yellow",
    title: "UM CAOS\nSOZINHA.",
    kicker: `${identity.person.nickname.toUpperCase()} E SEUS INCIDENTES DOMICILARES`,
    rows: [
      ["energia elétrica", "*sem energia pra escrever*"],
      ["frigideiras", "têm medo dela"],
      ["chance de virar saudades", "100%"],
    ],
    note: `como uma ${identity.person.nickname} pode causar tanta coisa ao mesmo tempo?`,
    transition: "circle",
  },
  {
    id: "blackout",
    chapter: "incidente nº 001",
    theme: "ink",
    title: "COINCI\nDÊNCIA?",
    kicker: "as más línguas dizem que a mão nem molhada estava...",
    rows: [
      ["01", `${identity.person.nickname} foi morar sozinha.`],
      ["02", "Foi encostar na luz do banheiro."],
      ["03", "A rua INTEIRA ficou sem energia."],
    ],
    note: "como diria piu-piu: 'acho que eu vi um gatinho'",
    transition: "slam",
  },
  {
    id: "pan",
    track: "sinais-de-fogo",
    chapter: "um minuto de silêncio",
    theme: "coral",
    title: "IN\nMEMORIAM",
    kicker: "trabalhar enquanto eles dormem?",
    note: `que não tankou a experiência ${identity.person.nickname}. Ela foi dormir e a panela virou história.`,
    transition: "circle",
  },
  {
    id: "music",
    chapter: "a trilha mudou",
    theme: "blue",
    title: `5 MÚSICAS.\n1 PESSOA.`,
    kicker: "ATÉ MÚSICA TE LEMBRA...",
    note: "eu apertava o play. e pensava em você.",
    transition: "circle",
  },
  {
    id: "anjos",
    chapter: "SINTO COMO OS",
    theme: "periwinkle",
    title: "ANJOS",
    track: "anjos",
    beats: [
      "tem música que lembra alguém depois.",
      "essa lembrava você antes mesmo de tocar.",
      "eu provavelmente já devia ter entendido.",
    ],
    transition: "soft",
  },
  {
    id: "secret",
    chapter: "essa eu guardava pra mim",
    theme: "ink",
    title: "this is what falling in love feels like.",
    kicker:
      '"EU SEI QUE PARECE SUPER CLICHÊ,\nMas você me faz sentir de\nalguma forma especial"',
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
      "eu sabia que tinha um motivo por eu amar azul.",
      "a cor favorita da minha pessoa favorita.",
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
    note: "a rota era nova, a companhia também.",
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
      ["1ª", "vez em um zoológico, lagoa e praia de JP"],
      ["1ª", "vez conhecendo um interior na mesma viagem"],
    ],
    note: "e nós dois no meio disso tudo.",
    transition: "wipe",
  },
  {
    id: "tripstats",
    chapter: "o balanço da viagem",
    theme: "navy",
    title: "MUITAS!",
    kicker: "MEMÓRIAS QUE VOU GUARDAR COMIGO?",
    rows: [
      ["carros alugados", "1"],
      [`vezes que ${identity.author} ficou perdido`, "11"],
      [
        `vezes que ${identity.person.nickname} não sabia o que era esquerda e direita`,
        "7",
      ],
      ["lugares visitados e que marcaram", "vários"],
      ["chance de viajar de novo com você", "100%"],
    ],
    note: "quilômetros? muitos. você faz valer a pena cada um deles.",
    transition: "circle",
  },
  {
    id: "alignment",
    chapter: "hora certa",
    theme: "navy",
    title: "ALINHAMENTO\nMILENAR",
    track: "alinhamento",
    beats: [
      "algumas músicas marcam MOMENTOS.",
      "algumas músicas marcam PESSOAS.",
      "você fez com que essa conseguisse fazer os dois.",
    ],
    note: `"VOCÊ ME AMA E EU TE AMO, ..."`,
    transition: "circle",
  },
  {
    id: "candy",
    chapter: `coisas que ${identity.author} gosta`,
    theme: "pink",
    title: `GOSTO DE VOCÊ, \n${identity.person.nickname.toUpperCase()}!`,
    track: "cajuzinho",
    kicker: "que eu gosto de você? isso não é novidade",
    note: "e sempre vamos saber que não tem encontro melhor que comida e você na mesma ocasião.",
    transition: "slam",
  },
  {
    id: "top",
    track: "exagerado",
    chapter: "o ranking definitivo",
    theme: "blue",
    title: `${identity.person.nickname.toUpperCase()}`,
    kicker: "RANKING DE AMORES DE YURI NESSA VIDA",
    note: "o resultado era meio óbvio, né?",
    rows: [
      ["#2", "chocolate"],
      ["#3", "viajar"],
      ["#4", "música"],
      ["#5", "cinema"],
    ],
    transition: "slam",
  },
  {
    id: "year",
    chapter: "os dados não mentem*",
    theme: "sky",
    title: `2026 EM NÚMEROS`,
    kicker: "E AGORA, NOSSO",
    rows: [
      ["1", "viagem que eu não esqueço"],
      [String(jenyWrapped.songs.length), "músicas que ficaram especiais"],
      ["???", "chocolates compartilhados"],
      ["muitas", "provocações desnecessárias"],
      ["1", "frigideira que virou lenda"],
      ["100%", "chance de você rir disso tudo"],
    ],
    transition: "wipe",
  },
  {
    id: "truth",
    chapter: "agora, sem brincadeira",
    theme: "navy",
    title: "ok.",
    beats: [
      "ok.",
      "chega de números inventados.",
      "tem uma coisa aqui que é 100% verdade.",
    ],
    transition: "soft",
  },
  {
    id: "declaration",
    chapter: "a única* estatística real",
    theme: "blue",
    title: `eu gosto muito de você, ${identity.person.nickname}.`,
    beats: [
      `eu gosto muito de você, ${identity.person.nickname}.`,
      "muito mesmo.",
      "e não é só porque temos piadas internas, músicas incríveis ou memórias boas.",
      "eu gosto de estar com você. de conversar com você. das coisas que a gente vive e sei que ainda vamos viver.",
      "gosto muito do lugar que você acabou ocupando na minha vida e os lugares que sonho que você ocupe.",
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
