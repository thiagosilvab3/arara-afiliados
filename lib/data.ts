import { Product } from "./types";

const link = (slug: string) => `https://example.com/afiliado/${slug}?ref=arara`;

export const baseProducts: Product[] = [
  {
    id: "m1",
    slug: "formula-trafego-inteligente",
    title: "Fórmula do Tráfego Inteligente",
    niche: "Marketing Digital",
    description: "Tráfego pago, criativos e escala de campanhas.",
    longDescription:
      "Curso prático para estruturar campanhas, analisar métricas, ajustar criativos e aumentar conversão com mais previsibilidade.",
    price: 197,
    originalPrice: 497,
    popularity: 96,
    rating: 4.9,
    platform: "Hotmart",
    affiliateUrl: link("formula-trafego-inteligente"),
    type: "affiliate",
    highlights: ["Facebook Ads", "Google Ads", "Escala"],
    featured: true
  },
  {
    id: "m2",
    slug: "copy-que-converte-360",
    title: "Copy que Converte 360",
    niche: "Marketing Digital",
    description: "Copywriting para páginas, anúncios e e-mails.",
    longDescription:
      "Treinamento para quem quer melhorar ofertas, headlines, promessas e estrutura de vendas com foco em conversão.",
    price: 147,
    originalPrice: 297,
    popularity: 91,
    rating: 4.8,
    platform: "Kiwify",
    affiliateUrl: link("copy-que-converte-360"),
    type: "affiliate",
    highlights: ["Landing pages", "E-mail", "Oferta"]
  },
  {
    id: "m3",
    slug: "social-media-pro-do-zero",
    title: "Social Media Pro do Zero",
    niche: "Marketing Digital",
    description: "Conteúdo, calendário editorial e crescimento orgânico.",
    longDescription:
      "Aprenda posicionamento, criação de conteúdo, calendário editorial e rotina de gestão de redes sociais.",
    price: 97,
    originalPrice: 197,
    popularity: 86,
    rating: 4.7,
    platform: "Eduzz",
    affiliateUrl: link("social-media-pro-do-zero"),
    type: "affiliate",
    highlights: ["Instagram", "Conteúdo", "Reels"]
  },
  {
    id: "m4",
    slug: "funis-e-automacao-express",
    title: "Funis e Automação Express",
    niche: "Marketing Digital",
    description: "Funis de venda, CRM e automações.",
    longDescription:
      "Curso direto para criar jornadas automatizadas, nutrição de leads e recuperação de oportunidades perdidas.",
    price: 267,
    originalPrice: 597,
    popularity: 88,
    rating: 4.8,
    platform: "Hotmart",
    affiliateUrl: link("funis-e-automacao-express"),
    type: "affiliate",
    highlights: ["Funis", "CRM", "Automação"]
  },
  {
    id: "m5",
    slug: "seo-para-negocios-digitais",
    title: "SEO para Negócios Digitais",
    niche: "Marketing Digital",
    description: "SEO para ranquear páginas e blogs.",
    longDescription:
      "Pesquisa de palavras-chave, SEO on-page, conteúdo evergreen e autoridade para tráfego orgânico.",
    price: 187,
    originalPrice: 397,
    popularity: 84,
    rating: 4.7,
    platform: "Kiwify",
    affiliateUrl: link("seo-para-negocios-digitais"),
    type: "affiliate",
    highlights: ["SEO", "Conteúdo", "Google"]
  },

  {
    id: "f1",
    slug: "financas-pessoais-sem-caos",
    title: "Finanças Pessoais sem Caos",
    niche: "Finanças",
    description: "Orçamento, dívida, reserva e metas pessoais.",
    longDescription:
      "Programa simples para sair do descontrole financeiro, montar reserva e organizar o dinheiro de forma sustentável.",
    price: 87,
    originalPrice: 197,
    popularity: 94,
    rating: 4.9,
    platform: "Hotmart",
    affiliateUrl: link("financas-pessoais-sem-caos"),
    type: "affiliate",
    highlights: ["Orçamento", "Reserva", "Planejamento"],
    featured: true
  },
  {
    id: "f2",
    slug: "investidor-de-renda-extra",
    title: "Investidor de Renda Extra",
    niche: "Finanças",
    description: "Investimentos para renda passiva e diversificação.",
    longDescription:
      "Introdução a renda fixa, dividendos e organização de carteira para quem quer começar com mais clareza.",
    price: 197,
    originalPrice: 497,
    popularity: 92,
    rating: 4.8,
    platform: "Kiwify",
    affiliateUrl: link("investidor-de-renda-extra"),
    type: "affiliate",
    highlights: ["Renda fixa", "Dividendos", "Carteira"]
  },
  {
    id: "f3",
    slug: "excel-para-controle-financeiro",
    title: "Excel para Controle Financeiro",
    niche: "Finanças",
    description: "Planilhas, dashboards e automações financeiras.",
    longDescription:
      "Curso para criar planilhas úteis, acompanhar indicadores e organizar dados pessoais ou de pequenos negócios.",
    price: 67,
    originalPrice: 147,
    popularity: 79,
    rating: 4.6,
    platform: "Eduzz",
    affiliateUrl: link("excel-para-controle-financeiro"),
    type: "affiliate",
    highlights: ["Excel", "Dashboards", "KPIs"]
  },
  {
    id: "f4",
    slug: "planejamento-financeiro-familiar",
    title: "Planejamento Financeiro Familiar",
    niche: "Finanças",
    description: "Método para orçamento e metas da família.",
    longDescription:
      "Ferramentas práticas para alinhar despesas, objetivos e segurança financeira em casal ou família.",
    price: 127,
    originalPrice: 297,
    popularity: 83,
    rating: 4.7,
    platform: "Hotmart",
    affiliateUrl: link("planejamento-financeiro-familiar"),
    type: "affiliate",
    highlights: ["Família", "Metas", "Controle"]
  },
  {
    id: "f5",
    slug: "cripto-com-gestao-de-risco",
    title: "Cripto com Gestão de Risco",
    niche: "Finanças",
    description: "Introdução ao mercado cripto com foco em segurança.",
    longDescription:
      "Treinamento introdutório sobre custódia, volatilidade e exposição responsável ao mercado cripto.",
    price: 297,
    originalPrice: 697,
    popularity: 77,
    rating: 4.5,
    platform: "Kiwify",
    affiliateUrl: link("cripto-com-gestao-de-risco"),
    type: "affiliate",
    highlights: ["Cripto", "Segurança", "Risco"]
  },

  {
    id: "fit1",
    slug: "projeto-corpo-em-90-dias",
    title: "Projeto Corpo em 90 Dias",
    niche: "Fitness",
    description: "Treino e alimentação para recomposição corporal.",
    longDescription:
      "Plano de 12 semanas com foco em treino, disciplina, nutrição base e acompanhamento de metas.",
    price: 197,
    originalPrice: 397,
    popularity: 95,
    rating: 4.9,
    platform: "Hotmart",
    affiliateUrl: link("projeto-corpo-em-90-dias"),
    type: "affiliate",
    highlights: ["Treino", "Nutrição", "Resultados"],
    featured: true
  },
  {
    id: "fit2",
    slug: "treino-em-casa-definitivo",
    title: "Treino em Casa Definitivo",
    niche: "Fitness",
    description: "Rotinas de treino sem academia.",
    longDescription:
      "Programa prático para diferentes níveis, com treinos curtos, progressão e poucos equipamentos.",
    price: 97,
    originalPrice: 197,
    popularity: 90,
    rating: 4.8,
    platform: "Kiwify",
    affiliateUrl: link("treino-em-casa-definitivo"),
    type: "affiliate",
    highlights: ["Casa", "Sem equipamentos", "Prático"]
  },
  {
    id: "fit3",
    slug: "nutricao-descomplicada",
    title: "Nutrição Descomplicada",
    niche: "Fitness",
    description: "Composição de refeições e constância alimentar.",
    longDescription:
      "Aprenda como montar refeições, controlar déficit calórico e criar hábitos alimentares mais sustentáveis.",
    price: 117,
    originalPrice: 247,
    popularity: 87,
    rating: 4.7,
    platform: "Eduzz",
    affiliateUrl: link("nutricao-descomplicada"),
    type: "affiliate",
    highlights: ["Dieta", "Hábitos", "Constância"]
  },
  {
    id: "fit4",
    slug: "mobilidade-e-postura-pro",
    title: "Mobilidade e Postura Pro",
    niche: "Fitness",
    description: "Programa para postura, dores e mobilidade.",
    longDescription:
      "Aulas progressivas para coluna, ombros, quadril e tornozelos com aplicação para rotina sedentária ou esportiva.",
    price: 147,
    originalPrice: 297,
    popularity: 81,
    rating: 4.6,
    platform: "Hotmart",
    affiliateUrl: link("mobilidade-e-postura-pro"),
    type: "affiliate",
    highlights: ["Postura", "Alongamento", "Mobilidade"]
  },
  {
    id: "fit5",
    slug: "emagrecimento-com-habitos",
    title: "Emagrecimento com Hábitos",
    niche: "Fitness",
    description: "Emagrecimento sem dietas extremas.",
    longDescription:
      "Estratégia comportamental para perda de peso com foco em rotina, sono, alimentação e aderência.",
    price: 127,
    originalPrice: 277,
    popularity: 89,
    rating: 4.8,
    platform: "Kiwify",
    affiliateUrl: link("emagrecimento-com-habitos"),
    type: "affiliate",
    highlights: ["Emagrecimento", "Hábitos", "Rotina"]
  },

  {
    id: "i1",
    slug: "ingles-fluente-na-pratica",
    title: "Inglês Fluente na Prática",
    niche: "Idiomas",
    description: "Método focado em speaking e listening.",
    longDescription:
      "Curso para destravar conversação, ampliar vocabulário e melhorar compreensão com rotina diária.",
    price: 247,
    originalPrice: 497,
    popularity: 97,
    rating: 4.9,
    platform: "Hotmart",
    affiliateUrl: link("ingles-fluente-na-pratica"),
    type: "affiliate",
    highlights: ["Speaking", "Listening", "Fluência"],
    featured: true
  },
  {
    id: "i2",
    slug: "espanhol-para-viagens-e-trabalho",
    title: "Espanhol para Viagens e Trabalho",
    niche: "Idiomas",
    description: "Vocabulário útil para contextos reais.",
    longDescription:
      "Material prático para quem quer usar espanhol em viagens, atendimento, vendas e trabalho.",
    price: 137,
    originalPrice: 297,
    popularity: 85,
    rating: 4.7,
    platform: "Eduzz",
    affiliateUrl: link("espanhol-para-viagens-e-trabalho"),
    type: "affiliate",
    highlights: ["Espanhol", "Prática", "Viagem"]
  },
  {
    id: "i3",
    slug: "ingles-para-entrevistas",
    title: "Inglês para Entrevistas",
    niche: "Idiomas",
    description: "Preparação para entrevistas e reuniões.",
    longDescription:
      "Foco em respostas estratégicas, vocabulário corporativo e segurança para processos seletivos.",
    price: 167,
    originalPrice: 347,
    popularity: 88,
    rating: 4.8,
    platform: "Kiwify",
    affiliateUrl: link("ingles-para-entrevistas"),
    type: "affiliate",
    highlights: ["Carreira", "Entrevistas", "Business"]
  },
  {
    id: "i4",
    slug: "frances-essencial-do-zero",
    title: "Francês Essencial do Zero",
    niche: "Idiomas",
    description: "Base de francês para iniciantes.",
    longDescription:
      "Curso introdutório com gramática essencial, leitura, escuta e prática oral progressiva.",
    price: 187,
    originalPrice: 397,
    popularity: 78,
    rating: 4.6,
    platform: "Hotmart",
    affiliateUrl: link("frances-essencial-do-zero"),
    type: "affiliate",
    highlights: ["Francês", "Iniciante", "Pronúncia"]
  },
  {
    id: "i5",
    slug: "conversacao-rapida-30-min-dia",
    title: "Conversação Rápida 30 Min/Dia",
    niche: "Idiomas",
    description: "Microaulas para prática oral diária.",
    longDescription:
      "Plano enxuto para manter consistência, aumentar repertório e destravar fala mesmo com pouco tempo.",
    price: 97,
    originalPrice: 197,
    popularity: 82,
    rating: 4.6,
    platform: "Kiwify",
    affiliateUrl: link("conversacao-rapida-30-min-dia"),
    type: "affiliate",
    highlights: ["Rotina", "Conversação", "Consistência"]
  }
];