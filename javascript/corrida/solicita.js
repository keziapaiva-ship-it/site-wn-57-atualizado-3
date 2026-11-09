/* =========================================================
   WN57 - SOLICITA.JS
========================================================= */


/* =========================================================
   DADOS DOS ESTADOS
========================================================= */

const estadosBrasil = {

  AC: {
    nome: "Acre",
    capital: "Rio Branco",
    descricao: "Explore o Acre e conheça suas paisagens naturais, cultura e destinos.",
    atracoes: [
      ["Rio Branco", "Capital do Acre"],
      ["Cruzeiro do Sul", "Natureza e cultura"],
      ["Sena Madureira", "História e paisagens"]
    ],
    transporte: [
      ["Aeroporto de Rio Branco", "Transporte aéreo"],
      ["Rodoviária de Rio Branco", "Transporte rodoviário"],
      ["Transporte urbano", "Mobilidade pela cidade"]
    ],
    hoteis: [
      ["Hotéis em Rio Branco", "Hospedagem"],
      ["Pousadas do Acre", "Hospedagem"]
    ],
    entretenimento: [
      ["Parques de Rio Branco", "Lazer"],
      ["Eventos culturais", "Cultura"]
    ],
    restaurantes: [
      ["Restaurantes de Rio Branco", "Gastronomia"],
      ["Comida típica do Acre", "Gastronomia regional"]
    ]
  },

  AL: {
    nome: "Alagoas",
    capital: "Maceió",
    descricao: "Descubra praias, cultura, gastronomia e paisagens de Alagoas.",
    atracoes: [
      ["Maceió", "Praias e atrações"],
      ["Maragogi", "Piscinas naturais"],
      ["São Miguel dos Milagres", "Praias paradisíacas"]
    ],
    transporte: [
      ["Aeroporto de Maceió", "Transporte aéreo"],
      ["Rodoviária de Maceió", "Transporte rodoviário"],
      ["Transporte urbano", "Mobilidade"]
    ],
    hoteis: [
      ["Hotéis em Maceió", "Hospedagem"],
      ["Pousadas de Alagoas", "Hospedagem"]
    ],
    entretenimento: [
      ["Orla de Maceió", "Lazer"],
      ["Centro histórico", "Cultura"]
    ],
    restaurantes: [
      ["Restaurantes de Maceió", "Gastronomia"],
      ["Comida alagoana", "Gastronomia regional"]
    ]
  },

  AP: {
    nome: "Amapá",
    capital: "Macapá",
    descricao: "Conheça Macapá e as paisagens naturais do Amapá.",
    atracoes: [
      ["Macapá", "Capital do estado"],
      ["Marco Zero do Equador", "Ponto turístico"],
      ["Fortaleza de São José", "História"]
    ],
    transporte: [
      ["Aeroporto de Macapá", "Transporte aéreo"],
      ["Rodoviária", "Transporte rodoviário"],
      ["Transporte urbano", "Mobilidade"]
    ],
    hoteis: [
      ["Hotéis em Macapá", "Hospedagem"],
      ["Pousadas", "Hospedagem"]
    ],
    entretenimento: [
      ["Orla de Macapá", "Lazer"],
      ["Centro cultural", "Cultura"]
    ],
    restaurantes: [
      ["Restaurantes de Macapá", "Gastronomia"],
      ["Comida regional", "Gastronomia"]
    ]
  },

  AM: {
    nome: "Amazonas",
    capital: "Manaus",
    descricao: "Explore a Amazônia e descubra a natureza e cultura do Amazonas.",
    atracoes: [
      ["Manaus", "Capital do Amazonas"],
      ["Parintins", "Cultura amazônica"],
      ["Presidente Figueiredo", "Cachoeiras e natureza"]
    ],
    transporte: [
      ["Aeroporto de Manaus", "Transporte aéreo"],
      ["Porto de Manaus", "Transporte fluvial"],
      ["Transporte urbano", "Mobilidade"]
    ],
    hoteis: [
      ["Hotéis em Manaus", "Hospedagem"],
      ["Hotéis de selva", "Experiência amazônica"]
    ],
    entretenimento: [
      ["Teatro Amazonas", "Cultura"],
      ["Centro histórico", "Passeio"]
    ],
    restaurantes: [
      ["Restaurantes de Manaus", "Gastronomia"],
      ["Comida amazônica", "Gastronomia regional"]
    ]
  },

  BA: {
    nome: "Bahia",
    capital: "Salvador",
    descricao: "Descubra praias, história, cultura e gastronomia da Bahia.",
    atracoes: [
      ["Salvador", "Capital da Bahia"],
      ["Porto Seguro", "Praias e história"],
      ["Chapada Diamantina", "Natureza"]
    ],
    transporte: [
      ["Aeroporto de Salvador", "Transporte aéreo"],
      ["Rodoviária de Salvador", "Transporte rodoviário"],
      ["Transporte urbano", "Mobilidade"]
    ],
    hoteis: [
      ["Hotéis em Salvador", "Hospedagem"],
      ["Resorts da Bahia", "Hospedagem"]
    ],
    entretenimento: [
      ["Pelourinho", "Cultura"],
      ["Orla de Salvador", "Lazer"]
    ],
    restaurantes: [
      ["Restaurantes de Salvador", "Gastronomia"],
      ["Comida baiana", "Gastronomia regional"]
    ]
  },

  CE: {
    nome: "Ceará",
    capital: "Fortaleza",
    descricao: "Conheça as praias, cultura e atrações do Ceará.",
    atracoes: [
      ["Fortaleza", "Capital do Ceará"],
      ["Jericoacoara", "Praias"],
      ["Canoa Quebrada", "Paisagens"]
    ],
    transporte: [
      ["Aeroporto de Fortaleza", "Transporte aéreo"],
      ["Rodoviária de Fortaleza", "Transporte rodoviário"],
      ["Transporte urbano", "Mobilidade"]
    ],
    hoteis: [
      ["Hotéis em Fortaleza", "Hospedagem"],
      ["Pousadas em Jericoacoara", "Hospedagem"]
    ],
    entretenimento: [
      ["Beira-Mar", "Lazer"],
      ["Centro Dragão do Mar", "Cultura"]
    ],
    restaurantes: [
      ["Restaurantes de Fortaleza", "Gastronomia"],
      ["Comida cearense", "Gastronomia"]
    ]
  },

  DF: {
    nome: "Distrito Federal",
    capital: "Brasília",
    descricao: "Conheça Brasília e seus principais pontos turísticos.",
    atracoes: [
      ["Brasília", "Capital do Brasil"],
      ["Congresso Nacional", "Arquitetura"],
      ["Catedral de Brasília", "Cultura"]
    ],
    transporte: [
      ["Aeroporto de Brasília", "Transporte aéreo"],
      ["Rodoviária do Plano Piloto", "Transporte"],
      ["Metrô", "Mobilidade"]
    ],
    hoteis: [
      ["Hotéis em Brasília", "Hospedagem"],
      ["Hotéis do Plano Piloto", "Hospedagem"]
    ],
    entretenimento: [
      ["Esplanada dos Ministérios", "Passeio"],
      ["Museus de Brasília", "Cultura"]
    ],
    restaurantes: [
      ["Restaurantes de Brasília", "Gastronomia"],
      ["Gastronomia brasileira", "Gastronomia"]
    ]
  },

  ES: {
    nome: "Espírito Santo",
    capital: "Vitória",
    descricao: "Explore praias, montanhas e a gastronomia do Espírito Santo.",
    atracoes: [
      ["Vitória", "Capital do estado"],
      ["Vila Velha", "Praias"],
      ["Guarapari", "Litoral"]
    ],
    transporte: [
      ["Aeroporto de Vitória", "Transporte aéreo"],
      ["Rodoviária de Vitória", "Transporte"],
      ["Transporte urbano", "Mobilidade"]
    ],
    hoteis: [
      ["Hotéis em Vitória", "Hospedagem"],
      ["Pousadas do litoral", "Hospedagem"]
    ],
    entretenimento: [
      ["Centro de Vitória", "Cultura"],
      ["Orla de Vila Velha", "Lazer"]
    ],
    restaurantes: [
      ["Restaurantes de Vitória", "Gastronomia"],
      ["Moqueca capixaba", "Comida típica"]
    ]
  },

  GO: {
    nome: "Goiás",
    capital: "Goiânia",
    descricao: "Descubra natureza, cultura e gastronomia de Goiás.",
    atracoes: [
      ["Goiânia", "Capital de Goiás"],
      ["Pirenópolis", "História e natureza"],
      ["Chapada dos Veadeiros", "Natureza"]
    ],
    transporte: [
      ["Aeroporto de Goiânia", "Transporte aéreo"],
      ["Rodoviária de Goiânia", "Transporte"],
      ["Transporte urbano", "Mobilidade"]
    ],
    hoteis: [
      ["Hotéis em Goiânia", "Hospedagem"],
      ["Pousadas de Pirenópolis", "Hospedagem"]
    ],
    entretenimento: [
      ["Centro de Goiânia", "Cultura"],
      ["Parques de Goiânia", "Lazer"]
    ],
    restaurantes: [
      ["Restaurantes de Goiânia", "Gastronomia"],
      ["Comida goiana", "Gastronomia"]
    ]
  },

  MA: {
    nome: "Maranhão",
    capital: "São Luís",
    descricao: "Conheça praias, história e os Lençóis Maranhenses.",
    atracoes: [
      ["São Luís", "Capital do Maranhão"],
      ["Lençóis Maranhenses", "Natureza"],
      ["Barreirinhas", "Turismo"]
    ],
    transporte: [
      ["Aeroporto de São Luís", "Transporte aéreo"],
      ["Rodoviária", "Transporte"],
      ["Transporte urbano", "Mobilidade"]
    ],
    hoteis: [
      ["Hotéis em São Luís", "Hospedagem"],
      ["Pousadas em Barreirinhas", "Hospedagem"]
    ],
    entretenimento: [
      ["Centro histórico", "Cultura"],
      ["Orla de São Luís", "Lazer"]
    ],
    restaurantes: [
      ["Restaurantes de São Luís", "Gastronomia"],
      ["Comida maranhense", "Gastronomia"]
    ]
  },

  MT: {
    nome: "Mato Grosso",
    capital: "Cuiabá",
    descricao: "Explore o Pantanal, a natureza e as cidades de Mato Grosso.",
    atracoes: [
      ["Cuiabá", "Capital"],
      ["Pantanal", "Natureza"],
      ["Chapada dos Guimarães", "Paisagens"]
    ],
    transporte: [
      ["Aeroporto de Cuiabá", "Transporte aéreo"],
      ["Rodoviária", "Transporte"],
      ["Transporte urbano", "Mobilidade"]
    ],
    hoteis: [
      ["Hotéis em Cuiabá", "Hospedagem"],
      ["Hotéis no Pantanal", "Hospedagem"]
    ],
    entretenimento: [
      ["Centro histórico", "Cultura"],
      ["Parques naturais", "Lazer"]
    ],
    restaurantes: [
      ["Restaurantes de Cuiabá", "Gastronomia"],
      ["Comida mato-grossense", "Gastronomia"]
    ]
  },

  MS: {
    nome: "Mato Grosso do Sul",
    capital: "Campo Grande",
    descricao: "Descubra Bonito, o Pantanal e as paisagens de Mato Grosso do Sul.",
    atracoes: [
      ["Campo Grande", "Capital"],
      ["Bonito", "Natureza"],
      ["Pantanal", "Turismo"]
    ],
    transporte: [
      ["Aeroporto de Campo Grande", "Transporte aéreo"],
      ["Rodoviária", "Transporte"],
      ["Transporte urbano", "Mobilidade"]
    ],
    hoteis: [
      ["Hotéis em Campo Grande", "Hospedagem"],
      ["Pousadas em Bonito", "Hospedagem"]
    ],
    entretenimento: [
      ["Parques de Campo Grande", "Lazer"],
      ["Passeios em Bonito", "Turismo"]
    ],
    restaurantes: [
      ["Restaurantes de Campo Grande", "Gastronomia"],
      ["Comida regional", "Gastronomia"]
    ]
  },

  MG: {
    nome: "Minas Gerais",
    capital: "Belo Horizonte",
    descricao: "Conheça cidades históricas, montanhas e a gastronomia mineira.",
    atracoes: [
      ["Belo Horizonte", "Capital"],
      ["Ouro Preto", "História"],
      ["Tiradentes", "Turismo"]
    ],
    transporte: [
      ["Aeroporto de Confins", "Transporte aéreo"],
      ["Rodoviária de Belo Horizonte", "Transporte"],
      ["Transporte urbano", "Mobilidade"]
    ],
    hoteis: [
      ["Hotéis em Belo Horizonte", "Hospedagem"],
      ["Pousadas históricas", "Hospedagem"]
    ],
    entretenimento: [
      ["Praça da Liberdade", "Cultura"],
      ["Mercado Central", "Passeio"]
    ],
    restaurantes: [
      ["Restaurantes de Belo Horizonte", "Gastronomia"],
      ["Comida mineira", "Gastronomia"]
    ]
  },

  PA: {
    nome: "Pará",
    capital: "Belém",
    descricao: "Explore a Amazônia, Belém e a cultura paraense.",
    atracoes: [
      ["Belém", "Capital"],
      ["Alter do Chão", "Praias"],
      ["Ilha do Marajó", "Natureza"]
    ],
    transporte: [
      ["Aeroporto de Belém", "Transporte aéreo"],
      ["Porto de Belém", "Transporte fluvial"],
      ["Transporte urbano", "Mobilidade"]
    ],
    hoteis: [
      ["Hotéis em Belém", "Hospedagem"],
      ["Pousadas em Alter do Chão", "Hospedagem"]
    ],
    entretenimento: [
      ["Mercado Ver-o-Peso", "Cultura"],
      ["Estação das Docas", "Lazer"]
    ],
    restaurantes: [
      ["Restaurantes de Belém", "Gastronomia"],
      ["Comida paraense", "Gastronomia"]
    ]
  },

  PB: {
    nome: "Paraíba",
    capital: "João Pessoa",
    descricao: "Conheça as praias e atrações de João Pessoa e da Paraíba.",
    atracoes: [
      ["João Pessoa", "Capital"],
      ["Praia do Cabo Branco", "Praia"],
      ["Areia Vermelha", "Turismo"]
    ],
    transporte: [
      ["Aeroporto de João Pessoa", "Transporte aéreo"],
      ["Rodoviária", "Transporte"],
      ["Transporte urbano", "Mobilidade"]
    ],
    hoteis: [
      ["Hotéis em João Pessoa", "Hospedagem"],
      ["Pousadas do litoral", "Hospedagem"]
    ],
    entretenimento: [
      ["Centro histórico", "Cultura"],
      ["Orla de João Pessoa", "Lazer"]
    ],
    restaurantes: [
      ["Restaurantes de João Pessoa", "Gastronomia"],
      ["Comida paraibana", "Gastronomia"]
    ]
  },

  PR: {
    nome: "Paraná",
    capital: "Curitiba",
    descricao: "Descubra atrações, transporte, hospedagem, entretenimento e gastronomia do Paraná.",
    atracoes: [
      ["Curitiba", "Capital do Paraná"],
      ["Foz do Iguaçu", "Cataratas e natureza"],
      ["Londrina", "Turismo urbano"]
    ],
    transporte: [
      ["Aeroporto Afonso Pena", "Transporte aéreo"],
      ["Rodoviária de Curitiba", "Transporte rodoviário"],
      ["Transporte público", "Mobilidade urbana"]
    ],
    hoteis: [
      ["Hotéis em Curitiba", "Hospedagem"],
      ["Hotéis em Foz do Iguaçu", "Hospedagem"],
      ["Pousadas no Paraná", "Hospedagem"]
    ],
    entretenimento: [
      ["Jardim Botânico", "Lazer e natureza"],
      ["Museu Oscar Niemeyer", "Cultura"],
      ["Centro histórico", "Passeio"]
    ],
    restaurantes: [
      ["Restaurantes de Curitiba", "Gastronomia"],
      ["Comida paranaense", "Gastronomia regional"],
      ["Mercado Municipal", "Gastronomia"]
    ]
  },

  PE: {
    nome: "Pernambuco",
    capital: "Recife",
    descricao: "Explore Recife, Olinda, praias e a cultura de Pernambuco.",
    atracoes: [
      ["Recife", "Capital"],
      ["Olinda", "História"],
      ["Porto de Galinhas", "Praias"]
    ],
    transporte: [
      ["Aeroporto do Recife", "Transporte aéreo"],
      ["Rodoviária", "Transporte"],
      ["Metrô do Recife", "Mobilidade"]
    ],
    hoteis: [
      ["Hotéis em Recife", "Hospedagem"],
      ["Hotéis em Porto de Galinhas", "Hospedagem"]
    ],
    entretenimento: [
      ["Recife Antigo", "Cultura"],
      ["Centro histórico de Olinda", "Passeio"]
    ],
    restaurantes: [
      ["Restaurantes do Recife", "Gastronomia"],
      ["Comida pernambucana", "Gastronomia"]
    ]
  },

  PI: {
    nome: "Piauí",
    capital: "Teresina",
    descricao: "Conheça Teresina, a Serra da Capivara e as paisagens do Piauí.",
    atracoes: [
      ["Teresina", "Capital"],
      ["Serra da Capivara", "História e natureza"],
      ["Parnaíba", "Turismo"]
    ],
    transporte: [
      ["Aeroporto de Teresina", "Transporte aéreo"],
      ["Rodoviária", "Transporte"],
      ["Transporte urbano", "Mobilidade"]
    ],
    hoteis: [
      ["Hotéis em Teresina", "Hospedagem"],
      ["Pousadas", "Hospedagem"]
    ],
    entretenimento: [
      ["Centro de Teresina", "Cultura"],
      ["Parques", "Lazer"]
    ],
    restaurantes: [
      ["Restaurantes de Teresina", "Gastronomia"],
      ["Comida piauiense", "Gastronomia"]
    ]
  },

  RJ: {
    nome: "Rio de Janeiro",
    capital: "Rio de Janeiro",
    descricao: "Conheça praias, cultura, natureza e os principais pontos do Rio de Janeiro.",
    atracoes: [
      ["Rio de Janeiro", "Cidade maravilhosa"],
      ["Cristo Redentor", "Ponto turístico"],
      ["Pão de Açúcar", "Paisagem"]
    ],
    transporte: [
      ["Aeroporto Santos Dumont", "Transporte aéreo"],
      ["Rodoviária Novo Rio", "Transporte"],
      ["Metrô Rio", "Mobilidade"]
    ],
    hoteis: [
      ["Hotéis em Copacabana", "Hospedagem"],
      ["Hotéis em Ipanema", "Hospedagem"]
    ],
    entretenimento: [
      ["Lapa", "Cultura"],
      ["Copacabana", "Lazer"]
    ],
    restaurantes: [
      ["Restaurantes do Rio", "Gastronomia"],
      ["Gastronomia carioca", "Gastronomia"]
    ]
  },

  RN: {
    nome: "Rio Grande do Norte",
    capital: "Natal",
    descricao: "Explore Natal, suas praias e as paisagens do Rio Grande do Norte.",
    atracoes: [
      ["Natal", "Capital"],
      ["Ponta Negra", "Praia"],
      ["Genipabu", "Dunas"]
    ],
    transporte: [
      ["Aeroporto de Natal", "Transporte aéreo"],
      ["Rodoviária", "Transporte"],
      ["Transporte urbano", "Mobilidade"]
    ],
    hoteis: [
      ["Hotéis em Natal", "Hospedagem"],
      ["Resorts do litoral", "Hospedagem"]
    ],
    entretenimento: [
      ["Ponta Negra", "Lazer"],
      ["Centro histórico", "Cultura"]
    ],
    restaurantes: [
      ["Restaurantes de Natal", "Gastronomia"],
      ["Comida potiguar", "Gastronomia"]
    ]
  },

  RS: {
    nome: "Rio Grande do Sul",
    capital: "Porto Alegre",
    descricao: "Descubra Porto Alegre, Serra Gaúcha e a cultura do Rio Grande do Sul.",
    atracoes: [
      ["Porto Alegre", "Capital"],
      ["Gramado", "Turismo"],
      ["Canela", "Natureza"]
    ],
    transporte: [
      ["Aeroporto de Porto Alegre", "Transporte aéreo"],
      ["Rodoviária", "Transporte"],
      ["Transporte urbano", "Mobilidade"]
    ],
    hoteis: [
      ["Hotéis em Porto Alegre", "Hospedagem"],
      ["Hotéis em Gramado", "Hospedagem"]
    ],
    entretenimento: [
      ["Centro histórico", "Cultura"],
      ["Serra Gaúcha", "Lazer"]
    ],
    restaurantes: [
      ["Restaurantes de Porto Alegre", "Gastronomia"],
      ["Churrasco gaúcho", "Gastronomia"]
    ]
  },

  RO: {
    nome: "Rondônia",
    capital: "Porto Velho",
    descricao: "Conheça Porto Velho e as paisagens de Rondônia.",
    atracoes: [
      ["Porto Velho", "Capital"],
      ["Estrada de Ferro Madeira-Mamoré", "História"],
      ["Rio Madeira", "Natureza"]
    ],
    transporte: [
      ["Aeroporto de Porto Velho", "Transporte aéreo"],
      ["Rodoviária", "Transporte"],
      ["Transporte urbano", "Mobilidade"]
    ],
    hoteis: [
      ["Hotéis em Porto Velho", "Hospedagem"],
      ["Pousadas", "Hospedagem"]
    ],
    entretenimento: [
      ["Centro histórico", "Cultura"],
      ["Orla do Madeira", "Lazer"]
    ],
    restaurantes: [
      ["Restaurantes de Porto Velho", "Gastronomia"],
      ["Comida regional", "Gastronomia"]
    ]
  },

  RR: {
    nome: "Roraima",
    capital: "Boa Vista",
    descricao: "Explore Boa Vista e as paisagens naturais de Roraima.",
    atracoes: [
      ["Boa Vista", "Capital"],
      ["Monte Roraima", "Natureza"],
      ["Orla Taumanan", "Passeio"]
    ],
    transporte: [
      ["Aeroporto de Boa Vista", "Transporte aéreo"],
      ["Rodoviária", "Transporte"],
      ["Transporte urbano", "Mobilidade"]
    ],
    hoteis: [
      ["Hotéis em Boa Vista", "Hospedagem"],
      ["Pousadas", "Hospedagem"]
    ],
    entretenimento: [
      ["Orla Taumanan", "Lazer"],
      ["Centro de Boa Vista", "Cultura"]
    ],
    restaurantes: [
      ["Restaurantes de Boa Vista", "Gastronomia"],
      ["Comida regional", "Gastronomia"]
    ]
  },

  SC: {
    nome: "Santa Catarina",
    capital: "Florianópolis",
    descricao: "Conheça praias, cidades e atrações de Santa Catarina.",
    atracoes: [
      ["Florianópolis", "Capital"],
      ["Balneário Camboriú", "Praias"],
      ["Blumenau", "Cultura"]
    ],
    transporte: [
      ["Aeroporto de Florianópolis", "Transporte aéreo"],
      ["Rodoviária", "Transporte"],
      ["Transporte urbano", "Mobilidade"]
    ],
    hoteis: [
      ["Hotéis em Florianópolis", "Hospedagem"],
      ["Hotéis em Balneário Camboriú", "Hospedagem"]
    ],
    entretenimento: [
      ["Centro de Florianópolis", "Cultura"],
      ["Praias", "Lazer"]
    ],
    restaurantes: [
      ["Restaurantes de Florianópolis", "Gastronomia"],
      ["Comida catarinense", "Gastronomia"]
    ]
  },

  SP: {
    nome: "São Paulo",
    capital: "São Paulo",
    descricao: "Explore cultura, gastronomia, entretenimento e atrações de São Paulo.",
    atracoes: [
      ["São Paulo", "Capital"],
      ["Avenida Paulista", "Turismo urbano"],
      ["Parque Ibirapuera", "Natureza e lazer"]
    ],
    transporte: [
      ["Aeroporto de Guarulhos", "Transporte aéreo"],
      ["Terminal Tietê", "Transporte rodoviário"],
      ["Metrô de São Paulo", "Mobilidade"]
    ],
    hoteis: [
      ["Hotéis na Avenida Paulista", "Hospedagem"],
      ["Hotéis no centro", "Hospedagem"]
    ],
    entretenimento: [
      ["MASP", "Cultura"],
      ["Avenida Paulista", "Lazer"],
      ["Liberdade", "Cultura"]
    ],
    restaurantes: [
      ["Restaurantes de São Paulo", "Gastronomia"],
      ["Mercado Municipal", "Gastronomia"]
    ]
  },

  SE: {
    nome: "Sergipe",
    capital: "Aracaju",
    descricao: "Conheça Aracaju, suas praias e a cultura de Sergipe.",
    atracoes: [
      ["Aracaju", "Capital"],
      ["Orla de Atalaia", "Praia"],
      ["Cânion do Xingó", "Natureza"]
    ],
    transporte: [
      ["Aeroporto de Aracaju", "Transporte aéreo"],
      ["Rodoviária", "Transporte"],
      ["Transporte urbano", "Mobilidade"]
    ],
    hoteis: [
      ["Hotéis em Aracaju", "Hospedagem"],
      ["Pousadas", "Hospedagem"]
    ],
    entretenimento: [
      ["Orla de Atalaia", "Lazer"],
      ["Centro histórico", "Cultura"]
    ],
    restaurantes: [
      ["Restaurantes de Aracaju", "Gastronomia"],
      ["Comida sergipana", "Gastronomia"]
    ]
  },

  TO: {
    nome: "Tocantins",
    capital: "Palmas",
    descricao: "Explore Palmas, Jalapão e as paisagens naturais do Tocantins.",
    atracoes: [
      ["Palmas", "Capital"],
      ["Jalapão", "Natureza"],
      ["Taquaruçu", "Cachoeiras"]
    ],
    transporte: [
      ["Aeroporto de Palmas", "Transporte aéreo"],
      ["Rodoviária", "Transporte"],
      ["Transporte urbano", "Mobilidade"]
    ],
    hoteis: [
      ["Hotéis em Palmas", "Hospedagem"],
      ["Pousadas no Jalapão", "Hospedagem"]
    ],
    entretenimento: [
      ["Praia da Graciosa", "Lazer"],
      ["Centro de Palmas", "Cultura"]
    ],
    restaurantes: [
      ["Restaurantes de Palmas", "Gastronomia"],
      ["Comida tocantinense", "Gastronomia"]
    ]
  }

};


/* =========================================================
   FOTOS DOS ESTADOS

   Pasta das fotos: img/estados/

   - FOTOS_ESTADOS: todos os 27 estados. Cada um tem 2 fotos:
     [foto do card "Conheça...", foto do card "Viaje pelo..."].
     Para trocar uma foto, coloque o arquivo na pasta
     img/estados/ com o nome indicado (ou mude o nome aqui).

   - Ordem de busca de cada foto:
       1) arquivo da pasta img/estados/ (se você colocar)
       2) foto real do lugar, buscada na Wikipédia
          (1º card = 1ª atração do estado, 2º card = 2ª)
       3) foto reserva (Picsum), caso as anteriores falhem
     Assim os dois cards da direita NUNCA somem.
========================================================= */

const BASE_IMG =
  "/site-de-corrida-wn-57-main/site-wn-57-corrida-main/img/estados/";

const FOTOS_ESTADOS = {
  AC: ["ac-1.jpg", "ac-2.jpg"],
  AL: ["al-1.jpg", "al-2.jpg"],
  AP: ["ap-1.jpg", "ap-2.jpg"],
  AM: ["am-1.jpg", "am-2.jpg"],
  BA: ["ba-1.jpg", "ba-2.jpg"],
  CE: ["ce-1.jpg", "ce-2.jpg"],
  DF: ["df-1.jpg", "df-2.jpg"],
  ES: ["es-1.jpg", "es-2.jpg"],
  GO: ["go-1.jpg", "go-2.jpg"],
  MA: ["ma-1.jpg", "ma-2.jpg"],
  MT: ["mt-1.jpg", "mt-2.jpg"],
  MS: ["ms-1.jpg", "ms-2.jpg"],
  MG: ["mg-1.jpg", "mg-2.jpg"],
  PA: ["pa-1.jpg", "pa-2.jpg"],
  PB: ["pb-1.jpg", "pb-2.jpg"],
  PR: ["pr-1.jpg", "pr-2.jpg"],
  PE: ["pe-1.jpg", "pe-2.jpg"],
  PI: ["pi-1.jpg", "pi-2.jpg"],
  RJ: ["rj-1.jpg", "rj-2.jpg"],
  RN: ["rn-1.jpg", "rn-2.jpg"],
  RS: ["rs-1.jpg", "rs-2.jpg"],
  RO: ["ro-1.jpg", "ro-2.jpg"],
  RR: ["rr-1.jpg", "rr-2.jpg"],
  SC: ["sc-1.jpg", "sc-2.jpg"],
  SP: ["sp-1.jpg", "sp-2.jpg"],
  SE: ["se-1.jpg", "se-2.jpg"],
  TO: ["to-1.jpg", "to-2.jpg"]
};

/* Foto principal: arquivo da pasta img/estados/ */
function getFotoEstado(codigo, indice) {

  const fotos = FOTOS_ESTADOS[codigo];

  const arquivo = fotos && fotos[indice - 1];

  return arquivo
    ? BASE_IMG + arquivo
    : getFotoReserva(codigo, indice);

}

/* Foto reserva: aparece se o arquivo acima não existir.
   É diferente para cada estado e sempre carrega. */
function getFotoReserva(codigo, indice) {

  return `https://picsum.photos/seed/wn57-${codigo}-${indice}/700/500`;

}

/* Foto real: procura na Wikipédia a foto principal do lugar
   (ex: "Cruzeiro do Sul Acre") e devolve o link da imagem. */
async function buscarFotoWikipedia(termo) {

  try {

    const url =
      "https://pt.wikipedia.org/w/api.php" +
      "?action=query&format=json&origin=*" +
      "&generator=search&gsrlimit=1" +
      "&prop=pageimages&piprop=thumbnail&pithumbsize=700" +
      "&gsrsearch=" + encodeURIComponent(termo);

    const resposta = await fetch(url);

    const dados = await resposta.json();

    const paginas = dados.query && dados.query.pages;

    if (!paginas) return null;

    const pagina = Object.values(paginas)[0];

    return pagina && pagina.thumbnail
      ? pagina.thumbnail.source
      : null;

  }

  catch (erro) {

    return null;

  }

}

/* Chamada quando o arquivo da pasta img/estados/ não existe:
   tenta a foto real da Wikipédia e, se falhar, usa a reserva. */
async function trocarPorFotoWiki(img, codigo, indice) {

  img.onerror = null;

  const estado = estadosBrasil[codigo];

  const lugar =
    estado.atracoes[indice - 1]
      ? estado.atracoes[indice - 1][0]
      : estado.capital;

  const foto =
    await buscarFotoWikipedia(`${lugar} ${estado.nome}`);

  img.onerror = function () {
    this.onerror = null;
    this.src = getFotoReserva(codigo, indice);
  };

  img.src = foto || getFotoReserva(codigo, indice);

}


/* =========================================================
   IDIOMA (PT-BR / EN)
========================================================= */

let idiomaAtual = localStorage.getItem("idioma") || "pt";

const TRADUCOES_EN = {
  /* menu */
  "Inicial": "Home",
  "Viajar": "Travel",
  "Atividade": "Activity",
  "Sobre-nós": "About us",
  "Ajuda": "Help",
  "Fazer login": "Log in",
  "Cadastre-se": "Sign up",

  /* hero */
  "Vá para qualquer": "Go to any",
  "lugar": "place",
  "com WN": "with WN",
  "Alterar cidade": "Change city",
  "Escolha o veículo perfeito, calcule sua rota e chegue com estilo.":
    "Choose the perfect vehicle, calculate your route and arrive in style.",

  /* modal */
  "Você está atualmente em": "You are currently in",
  "Explorar o estado": "Explore the state",
  "Pesquisar estado ou cidade": "Search state or city",
  "Estados do Brasil": "Brazilian states",

  /* card da corrida */
  "Sua localização": "Your location",
  "Para onde você vai?": "Where are you going?",
  "Solicitar corrida": "Request a ride",

  /* explore seu destino */
  "EXPLORE SEU DESTINO": "EXPLORE YOUR DESTINATION",
  "Explore seu destino": "Explore your destination",
  "Encontre lugares, veja sua rota e descubra opções de viagem.":
    "Find places, see your route and discover travel options.",
  "Atrações": "Attractions",
  "Transporte": "Transport",
  "Hotéis": "Hotels",
  "Entretenimento": "Entertainment",
  "Restaurantes": "Restaurants",
  "Iniciar": "Start",
  "Descubra atrações e experiências para aproveitar sua viagem.":
    "Discover attractions and experiences to enjoy your trip.",
  "Encontre destinos, transporte, hotéis e gastronomia.":
    "Find destinations, transport, hotels and food.",

  /* subtítulos dos itens */
  "Hospedagem": "Accommodation",
  "Gastronomia": "Gastronomy",
  "Gastronomia regional": "Regional cuisine",
  "Comida típica": "Typical food",
  "Cultura": "Culture",
  "Lazer": "Leisure",
  "Lazer e natureza": "Leisure and nature",
  "Mobilidade": "Mobility",
  "Mobilidade urbana": "Urban mobility",
  "Transporte aéreo": "Air transport",
  "Transporte rodoviário": "Road transport",
  "Transporte fluvial": "River transport",
  "Transporte urbano": "Urban transport",
  "Transporte público": "Public transport",
  "Natureza": "Nature",
  "História": "History",
  "Praia": "Beach",
  "Praias": "Beaches",
  "Paisagem": "Scenery",
  "Paisagens": "Landscapes",
  "Passeio": "Sightseeing",
  "Turismo": "Tourism",
  "Metrô": "Subway",
  "Rodoviária": "Bus station",
  "Centro histórico": "Historic center",
  "Eventos culturais": "Cultural events",
  "Experiência amazônica": "Amazon experience",

  /* sua viagem */
  "SUA VIAGEM, DO SEU JEITO": "YOUR TRIP, YOUR WAY",
  "Use o": "Use",
  "para": "to",
  "viajar do seu jeito": "travel your way",
  "Mais praticidade, segurança e conforto em todas as suas viagens.":
    "More convenience, safety and comfort on all your trips.",
  "Opções de viagem": "Travel options",
  "Escolha a opção ideal para o seu destino, com conforto e praticidade.":
    "Choose the ideal option for your destination, with comfort and convenience.",
  "Saiba mais": "Learn more",
  "Viaje com seu pet na WN57": "Travel with your pet on WN57",
  "Viaje com seu pet de forma confortável, segura e tranquila.":
    "Travel with your pet comfortably, safely and with peace of mind.",
  "Mais cidades": "More cities",
  "Encontre o WN57 em diferentes cidades e escolha seu destino.":
    "Find WN57 in different cities and choose your destination.",

  /* agendamento */
  "Planeje sua viagem": "Plan your trip",
  "Escolha a data e o horário para realizar sua viagem.":
    "Choose the date and time for your trip.",
  "Data": "Date",
  "Horário": "Time",
  "Avançar": "Next",
  "Por que agendar?": "Why schedule?",
  "Escolha seu horário": "Choose your time",
  "Defina quando deseja realizar sua viagem.":
    "Set when you want to take your trip.",
  "Mais praticidade": "More convenience",
  "Organize sua viagem com antecedência.": "Plan your trip in advance.",
  "Escolha sua categoria": "Choose your category",
  "WN, Black ou Pet para você escolher.": "WN, Black or Pet — your choice.",

  /* conheça */
  "Conheça o WN57": "Get to know WN57",
  "Descubra quem somos e o que estamos construindo para transformar a experiência de mobilidade.":
    "Find out who we are and what we are building to transform the mobility experience.",

  /* rodapé */
  "Acesse a Central de Ajuda": "Visit the Help Center",
  "Empresa": "Company",
  "Quem somos": "About us",
  "Investidores": "Investors",
  "Carreiras": "Careers",
  "Produtos": "Products",
  "Cidadania global": "Global citizenship",
  "Segurança": "Safety",
  "Sustentabilidade": "Sustainability",
  "Viagem": "Trip",
  "Reservar": "Book",
  "Aeroportos": "Airports",
  "Cidades": "Cities",
  "🌐 Português (Brasil)": "🌐 English",
  "Privacidade": "Privacy",
  "Termos": "Terms",
  "Acessibilidade": "Accessibility",

  /* título da aba e alertas */
  "Solicite sua viagem - WN57": "Request your trip - WN57",
  "Preencha sua localização e o destino.":
    "Please fill in your location and destination.",
  "Escolha a data e o horário da viagem.":
    "Please choose the date and time of your trip."
};

/* Frases com nome de lugar no meio (ex.: "Hotéis em Curitiba") */
const REGRAS_EN = [
  [/^Conheça (.+)$/, "Discover $1"],
  [/^Viaje pelo (.+)$/, "Travel around $1"],
  [/^Hotéis (?:em|de|do|da|no|na) (.+)$/, "Hotels in $1"],
  [/^Pousadas (?:em|de|do|da|no|na) (.+)$/, "Guesthouses in $1"],
  [/^Restaurantes (?:em|de|do|da) (.+)$/, "Restaurants in $1"],
  [/^Aeroporto (?:de|do|da) (.+)$/, "$1 Airport"],
  [/^Rodoviária (?:de|do|da) (.+)$/, "$1 Bus Station"],
  [/^Orla (?:de|do|da) (.+)$/, "$1 Waterfront"],
  [/^Parques (?:de|do|da) (.+)$/, "$1 Parks"],
  [/^Capital (?:de|do|da) (.+)$/, "Capital of $1"]
];

const textosOriginais = new WeakMap();

function normalizar(texto) {
  return texto.replace(/\s+/g, " ").trim();
}

/* devolve a tradução ou null se não houver */
function traduzirChave(texto) {

  const chave = normalizar(texto);

  if (TRADUCOES_EN[chave]) return TRADUCOES_EN[chave];

  for (const [regra, modelo] of REGRAS_EN) {
    if (regra.test(chave)) return chave.replace(regra, modelo);
  }

  return null;

}

/* para usar em alert() etc. */
function t(texto) {

  if (idiomaAtual !== "en") return texto;

  return traduzirChave(texto) || texto;

}

function processarNo(no) {

  if (!textosOriginais.has(no)) textosOriginais.set(no, no.nodeValue);

  const original = textosOriginais.get(no);

  const partes = original.match(/^(\s*)([\s\S]*?)(\s*)$/);

  if (!partes[2]) return;

  const traducao =
    idiomaAtual === "en" ? traduzirChave(partes[2]) : null;

  no.nodeValue = traducao
    ? partes[1] + traducao + partes[3]
    : original;

}

function aplicarIdioma() {

  /* textos */
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(no) {

        const pai = no.parentElement;

        if (
          !pai ||
          ["SCRIPT", "STYLE", "NOSCRIPT"].includes(pai.tagName) ||
          pai.closest("[data-no-i18n]")
        ) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;

      }
    }
  );

  const nos = [];

  while (walker.nextNode()) nos.push(walker.currentNode);

  nos.forEach(processarNo);


  /* placeholders */
  document.querySelectorAll("[placeholder]").forEach(function (el) {

    if (!el.dataset.phOriginal) {
      el.dataset.phOriginal = el.getAttribute("placeholder");
    }

    const original = el.dataset.phOriginal;

    const traducao =
      idiomaAtual === "en" ? traduzirChave(original) : null;

    el.setAttribute("placeholder", traducao || original);

  });


  /* título da aba */
  if (!document.documentElement.dataset.tituloOriginal) {
    document.documentElement.dataset.tituloOriginal = document.title;
  }

  const tituloOriginal = document.documentElement.dataset.tituloOriginal;

  document.title =
    (idiomaAtual === "en" && traduzirChave(tituloOriginal)) ||
    tituloOriginal;

}

function definirIdioma(idioma) {

  idiomaAtual = idioma;

  localStorage.setItem("idioma", idioma);

  document.documentElement.lang = idioma === "en" ? "en" : "pt-BR";

  const botao = document.getElementById("btnIdioma");

  if (botao) {
    botao.textContent = idioma === "en" ? "🌐 EN" : "🌐 PT-BR";
  }

  aplicarIdioma();

}

function iniciarIdioma() {

  const botao = document.getElementById("btnIdioma");

  if (botao) {
    botao.addEventListener("click", function () {
      definirIdioma(idiomaAtual === "pt" ? "en" : "pt");
    });
  }

  /* traduz também o que o JS criar depois (estados, login...) */
  let agendado = false;

  new MutationObserver(function () {

    if (idiomaAtual !== "en" || agendado) return;

    agendado = true;

    requestAnimationFrame(function () {
      agendado = false;
      aplicarIdioma();
    });

  }).observe(document.body, { childList: true, subtree: true });

  definirIdioma(idiomaAtual);

}


/* =========================================================
   MOSTRAR DESTINO
========================================================= */

function mostrarEstado(codigo) {

  const estado = estadosBrasil[codigo];

  const container =
    document.getElementById("destinoEstado");

  if (!estado || !container) return;


  container.dataset.estado = codigo;


  container.innerHTML = `

        <div class="destino-topo">

            <span class="destino-tag">
                EXPLORE SEU DESTINO
            </span>

            <h2>
                ${estado.nome}
            </h2>

            <p>
                ${estado.descricao}
            </p>

        </div>


        <div class="destino-capital">

            <small>
                Capital
            </small>

            <strong>
                ${estado.capital}
            </strong>

        </div>


        <div class="destino-abas">

            <button
                class="destino-aba ativa"
                data-categoria="atracoes"
                type="button">
                Atrações
            </button>

            <button
                class="destino-aba"
                data-categoria="transporte"
                type="button">
                Transporte
            </button>

            <button
                class="destino-aba"
                data-categoria="hoteis"
                type="button">
                Hotéis
            </button>

            <button
                class="destino-aba"
                data-categoria="entretenimento"
                type="button">
                Entretenimento
            </button>

            <button
                class="destino-aba"
                data-categoria="restaurantes"
                type="button">
                Restaurantes
            </button>

        </div>


        <div class="destino-conteudo">

            <div
                class="lista-destinos"
                id="listaDestinos">
            </div>


            <div class="mapa-estado">

               <iframe id="mapaEstado" title="Mapa do destino selecionado" loading="lazy"></iframe>
            </div>


            <div
                class="destino-destaques"
                id="destinoDestaques">

                <div class="destaque-card">

                    <img
                        class="destaque-imagem"
                        src="${getFotoEstado(codigo, 1)}"
                        alt="${estado.nome}"
                        onerror="trocarPorFotoWiki(this, '${codigo}', 1)"
                    >

                    <div class="destaque-card-conteudo">

                        <h3>
                            Conheça ${estado.capital}
                        </h3>

                        <p>
                            Descubra atrações e experiências
                            para aproveitar sua viagem.
                        </p>

                        <button
                            type="button"
                            onclick="irParaDestino('${estado.capital}')">
                            Saiba mais
                        </button>

                    </div>

                </div>


                <div class="destaque-card">

                    <img
                        class="destaque-imagem"
                        src="${getFotoEstado(codigo, 2)}"
                        alt="${estado.nome}"
                        onerror="trocarPorFotoWiki(this, '${codigo}', 2)"
                    >

                    <div class="destaque-card-conteudo">

                        <h3>
                            Viaje pelo ${estado.nome}
                        </h3>

                        <p>
                            Encontre destinos, transporte,
                            hotéis e gastronomia.
                        </p>

                        <button
                            type="button"
                            onclick="irParaDestino('${estado.nome}')">
                            Saiba mais
                        </button>

                    </div>

                </div>

            </div>

        </div>

    `;


  configurarAbas();

  mostrarCategoria("atracoes");

}


/* =========================================================
   CATEGORIA
========================================================= */

function mostrarMapa(local, estado) {
  const mapa = document.getElementById("mapaEstado");
  if (!mapa) return;

  const busca = `${local}, ${estado.nome}, Brasil`;
  mapa.src = `https://maps.google.com/maps?q=${encodeURIComponent(busca)}&z=12&output=embed`;
}

function mostrarCategoria(categoria) {
  const container = document.getElementById("destinoEstado");
  const lista = document.getElementById("listaDestinos");
  if (!container || !lista) return;

  const estado = estadosBrasil[container.dataset.estado || "PR"];
  if (!estado) return;

  lista.innerHTML = "";

  (estado[categoria] || []).forEach(function (item, indice) {
    const div = document.createElement("div");
    div.className = "destino-item";

    div.innerHTML = `
      <div class="destino-item-info">
        <div class="destino-icone">📍</div>
        <div>
          <h3>${item[0]}</h3>
          <p>${item[1]}</p>
        </div>
      </div>
      <button class="destino-iniciar" type="button">Iniciar</button>
    `;

    function selecionar() {
      lista.querySelectorAll(".destino-item")
        .forEach(function (el) { el.classList.remove("ativo"); });
      div.classList.add("ativo");
      mostrarMapa(item[0], estado);
    }

    div.addEventListener("click", selecionar);

    div.querySelector(".destino-iniciar").addEventListener("click", function (e) {
      e.stopPropagation();
      irParaDestino(item[0]);
    });

    lista.appendChild(div);
    if (indice === 0) selecionar();
  });
}


/* =========================================================
   ABAS
========================================================= */

function configurarAbas() {

  const abas =
    document.querySelectorAll(
      ".destino-aba"
    );


  abas.forEach(function (aba) {

    aba.addEventListener(
      "click",
      function () {

        abas.forEach(function (item) {

          item.classList.remove(
            "ativa"
          );

        });


        aba.classList.add(
          "ativa"
        );


        mostrarCategoria(
          aba.dataset.categoria
        );

      }
    );

  });

}


/* =========================================================
   IR PARA DESTINO
========================================================= */

function irParaDestino(destino) {

  const input =
    document.getElementById("destino");

  if (!input) return;


  input.value =
    destino;


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* =========================================================
   MODAL
========================================================= */

function abrirModalCidade() {

  const modal =
    document.getElementById("modalCidade");

  if (!modal) return;

  modal.classList.add("ativo");

}


function fecharModalCidade() {

  const modal =
    document.getElementById("modalCidade");

  if (!modal) return;

  modal.classList.remove("ativo");

}


/* =========================================================
   CIDADE / ESTADO SELECIONADO
========================================================= */

function selecionarEstado(codigo, nome) {

  const cidade =
    document.getElementById(
      "cidadeSelecionada"
    );

  const titulo =
    document.getElementById(
      "cidadeTitulo"
    );


  if (cidade) {
    cidade.textContent =
      `${nome}, BR`;
  }


  if (titulo) {
    titulo.textContent =
      nome;
  }


  localStorage.setItem(
    "estadoSelecionado",
    codigo
  );

  localStorage.setItem(
    "cidadeSelecionada",
    nome
  );


  mostrarEstado(codigo);

}


/* =========================================================
   GPS
========================================================= */

function pegarGPS() {

  const origem =
    document.getElementById("origem");

  if (!origem) return;


  if (!navigator.geolocation) {

    origem.value =
      "Pinhais - PR";

    return;

  }


  navigator.geolocation.getCurrentPosition(

    async function (pos) {

      const lat =
        pos.coords.latitude;

      const lon =
        pos.coords.longitude;


      try {

        const resposta =
          await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&addressdetails=1`
          );


        const data =
          await resposta.json();


        const endereco =
          data.address || {};


        const rua =
          endereco.road ||
          endereco.residential ||
          "";


        const bairro =
          endereco.suburb ||
          endereco.neighbourhood ||
          "";


        const cidade =
          endereco.city ||
          endereco.town ||
          "Pinhais";


        origem.value =
          rua
            ? `${rua}, ${bairro} - ${cidade}`
            : `${cidade}`;

      }

      catch (erro) {

        origem.value =
          "Pinhais - PR";

      }

    },

    function () {

      origem.value =
        "Pinhais - PR";

    }

  );

}


/* =========================================================
   SUGESTÕES
========================================================= */

async function buscarSugestoes(texto) {

  const lista =
    document.getElementById(
      "sugestoes"
    );

  if (!lista) return;


  lista.innerHTML = "";


  if (texto.length < 3) {
    return;
  }


  try {

    const resposta =
      await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(texto)}&limit=5&countrycodes=br`
      );


    const dados =
      await resposta.json();


    dados.forEach(function (item) {

      const li =
        document.createElement("li");


      li.textContent =
        item.display_name;


      li.addEventListener(
        "click",
        function () {

          document.getElementById(
            "destino"
          ).value =
            item.display_name;


          lista.innerHTML =
            "";

        }
      );


      lista.appendChild(li);

    });

  }

  catch (erro) {

    console.log(
      "Erro nas sugestões:",
      erro
    );

  }

}


/* =========================================================
   IR PARA CORRIDA
========================================================= */

function irMapa() {

  const origem =
    document.getElementById(
      "origem"
    ).value.trim();


  const destino =
    document.getElementById(
      "destino"
    ).value.trim();


  if (!origem || !destino) {

    alert(
      t("Preencha sua localização e o destino.")
    );

    return;

  }


  localStorage.setItem(
    "origemCorrida",
    origem
  );


  localStorage.setItem(
    "destinoCorrida",
    destino
  );


  window.location.href =
    "corrida.html";

}


/* =========================================================
   AGENDAMENTO
========================================================= */

function avancarAgendamento() {

  const data =
    document.getElementById(
      "data"
    ).value;


  const horario =
    document.getElementById(
      "horario"
    ).value;


  if (!data || !horario) {

    alert(
      t("Escolha a data e o horário da viagem.")
    );

    return;

  }


  const partes =
    data.split("-");


  const dataFormatada =
    `${partes[2]}/${partes[1]}/${partes[0]}`;


  localStorage.setItem(
    "agendamento",
    JSON.stringify({
      data: dataFormatada,
      horario: horario
    })
  );


  window.location.href =
    "corrida.html";

}


/* =========================================================
   FAQ
========================================================= */

function configurarFAQ() {

  const perguntas =
    document.querySelectorAll(
      ".faq-pergunta"
    );


  perguntas.forEach(function (botao) {

    botao.addEventListener(
      "click",
      function () {

        const item =
          botao.closest(
            ".faq-item"
          );


        if (!item) return;


        const estavaAberto =
          item.classList.contains(
            "ativo"
          );


        document
          .querySelectorAll(
            ".faq-item.ativo"
          )
          .forEach(function (outro) {

            outro.classList.remove(
              "ativo"
            );

          });


        if (!estavaAberto) {

          item.classList.add(
            "ativo"
          );

        }

      }
    );

  });

}


/* =========================================================
   USUÁRIO
========================================================= */

let usuarioLogado =
  JSON.parse(
    localStorage.getItem(
      "usuarioLogado"
    )
  );


function mostrarUsuario() {

  const area =
    document.getElementById(
      "usuarioArea"
    );


  if (!area) return;


  if (!usuarioLogado) {

    area.innerHTML = `
            <a href="login.html">
                Fazer login
            </a>
        `;

    return;

  }


  area.innerHTML = `

        <div class="usuario-resumo">

            <img
                src="${usuarioLogado.foto || 'img/perfil.png'}"
                alt="Usuário"
                style="
                    width:35px;
                    height:35px;
                    border-radius:50%;
                    object-fit:cover;
                "
            >

            <span>
                ${usuarioLogado.nome}
            </span>

        </div>

    `;

}


/* =========================================================
   INICIAR TUDO
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {


    /* MODAL */

    const abrir =
      document.getElementById(
        "abrirCidade"
      );


    const fechar =
      document.getElementById(
        "fecharCidade"
      );


    const modal =
      document.getElementById(
        "modalCidade"
      );


    if (abrir) {

      abrir.addEventListener(
        "click",
        abrirModalCidade
      );

    }


    if (fechar) {

      fechar.addEventListener(
        "click",
        fecharModalCidade
      );

    }


    if (modal) {

      modal.addEventListener(
        "click",
        function (event) {

          if (
            event.target === modal
          ) {

            fecharModalCidade();

          }

        }
      );

    }


    document.addEventListener(
      "keydown",
      function (event) {

        if (
          event.key === "Escape"
        ) {

          fecharModalCidade();

        }

      }
    );


    /* ESTADOS */

    const botoes =
      document.querySelectorAll(
        ".cidade-item"
      );


    botoes.forEach(function (botao) {

      botao.addEventListener(
        "click",
        function () {

          const partes =
            botao.dataset.cidade
              .split(",");


          const nome =
            partes[0].trim();


          const codigo =
            partes[1].trim();


          selecionarEstado(
            codigo,
            nome
          );


          fecharModalCidade();


          const destino =
            document.getElementById(
              "destinoEstado"
            );


          if (destino) {

            setTimeout(
              function () {

                destino.scrollIntoView({
                  behavior: "smooth",
                  block: "start"
                });

              },
              150
            );

          }

        }
      );

    });


    /* PESQUISA */

    const pesquisa =
      document.getElementById(
        "pesquisaCidade"
      );


    if (pesquisa) {

      pesquisa.addEventListener(
        "input",
        function () {

          const texto =
            pesquisa.value
              .toLowerCase();


          botoes.forEach(
            function (botao) {

              const nome =
                botao.textContent
                  .toLowerCase();


              botao.style.display =
                nome.includes(texto)
                  ? ""
                  : "none";

            }
          );

        }
      );

    }


    /* EXPLORAR */

    const explorar =
      document.getElementById(
        "explorarEstado"
      );


    if (explorar) {

      explorar.addEventListener(
        "click",
        function () {

          fecharModalCidade();


          const destino =
            document.getElementById(
              "destinoEstado"
            );


          if (destino) {

            destino.scrollIntoView({
              behavior: "smooth"
            });

          }

        }
      );

    }


    /* FAQ */

    configurarFAQ();


    /* USUÁRIO */

    mostrarUsuario();


    /* ESTADO SALVO */

    const estadoSalvo =
      localStorage.getItem(
        "estadoSelecionado"
      );


    if (
      estadoSalvo &&
      estadosBrasil[estadoSalvo]
    ) {

      const estado =
        estadosBrasil[
        estadoSalvo
        ];


      const cidade =
        document.getElementById(
          "cidadeSelecionada"
        );


      const titulo =
        document.getElementById(
          "cidadeTitulo"
        );


      if (cidade) {

        cidade.textContent =
          `${estado.nome}, BR`;

      }


      if (titulo) {

        titulo.textContent =
          estado.nome;

      }


      mostrarEstado(
        estadoSalvo
      );

    }

    else {

      /* MOSTRA PARANÁ INICIALMENTE */

      mostrarEstado("PR");

    }


    /* IDIOMA (PT-BR / EN) */

    iniciarIdioma();

  }
);

//login na tela inicial//

"use strict";

(function () {
  const LOGIN_URL = "/site-de-corrida-wn-57-main/site-de-corrida-wn-57-main/site-wn-57-corrida-main/html/login/login.html";

  let u = null;
  try {
    u = JSON.parse(localStorage.getItem("usuarioLogado") || localStorage.getItem("usuario") || "null");
  } catch (e) {}

  const perfil = document.getElementById("perfil");
  if (!perfil || !u || !u.nome) return;

  const inicial = u.nome.trim().charAt(0).toUpperCase();
  const primeiroNome = u.nome.trim().split(" ")[0];

  function colocarFoto(el) {
    if (u.foto) {
      el.style.backgroundImage = 'url("' + u.foto + '")';
      el.textContent = "";
    } else {
      el.textContent = inicial;
    }
  }

  colocarFoto(document.getElementById("avatarMini"));
  colocarFoto(document.getElementById("perfilFoto"));
  document.getElementById("perfilNomeCurto").textContent = primeiroNome;
  document.getElementById("perfilNome").textContent = u.nome;

  const btn = document.getElementById("perfilBtn");
  const menu = document.getElementById("perfilMenu");

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const aberto = menu.classList.toggle("aberto");
    btn.setAttribute("aria-expanded", aberto);
  });
  document.addEventListener("click", (e) => {
    if (!perfil.contains(e.target)) menu.classList.remove("aberto");
  });

  document.getElementById("perfilSair").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("usuario");
    window.location.href = LOGIN_URL;
  });
})();