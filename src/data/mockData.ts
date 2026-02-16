export interface Institute {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  services: string[];
  doctors: string[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  crm: string;
  bio: string;
  instituteId: string;
  photo?: string;
}

export const WHATSAPP_NUMBER = "5594992775857";

export const institutes: Institute[] = [
  {
    id: "cardiologia",
    name: "Instituto de Cardiologia",
    category: "Excelência em Cuidado",
    description: "Diagnóstico e tratamento de doenças cardiovasculares com tecnologia de ponta e equipe altamente qualificada.",
    icon: "Heart",
    services: ["Ecocardiograma", "Teste Ergométrico", "Holter 24h", "MAPA", "Cateterismo"],
    doctors: ["dr-carlos-mendes", "dra-ana-lima"],
  },
  {
    id: "ortopedia",
    name: "Instituto de Ortopedia",
    category: "Estrutura Completa",
    description: "Tratamento especializado em lesões musculoesqueléticas, coluna e medicina esportiva.",
    icon: "Bone",
    services: ["Artroscopia", "Prótese de Quadril", "Tratamento de Coluna", "Medicina Esportiva", "Fisioterapia"],
    doctors: ["dr-roberto-silva", "dra-marina-costa"],
  },
  {
    id: "dermatologia",
    name: "Instituto de Dermatologia",
    category: "Cuidados Especiais",
    description: "Cuidados completos com a saúde da pele, cabelos e unhas com abordagem personalizada.",
    icon: "Sparkles",
    services: ["Dermatoscopia", "Laser Dermatológico", "Peeling", "Biópsia de Pele", "Tricologia"],
    doctors: ["dra-juliana-santos"],
  },
  {
    id: "oftalmologia",
    name: "Instituto de Oftalmologia",
    category: "Alta Precisão",
    description: "Visão é nosso foco. Diagnóstico e cirurgias oculares com a mais alta precisão e tecnologia.",
    icon: "Eye",
    services: ["Cirurgia de Catarata", "Tratamento de Glaucoma", "Retina", "Refração", "Lentes de Contato"],
    doctors: ["dr-fernando-alves"],
  },
  {
    id: "laboratorio",
    name: "Exames Laboratoriais",
    category: "Agilidade para Você",
    description: "Resultados rápidos e precisos. Coleta de exames em ambiente confortável e acolhedor.",
    icon: "TestTube",
    services: ["Hemograma", "Glicemia", "Colesterol", "Função Renal", "Hormônios"],
    doctors: [],
  },
];

export const doctors: Doctor[] = [
  {
    id: "dr-carlos-mendes",
    name: "Dr. Carlos Mendes",
    specialty: "Cardiologista",
    crm: "CRM/SP 123456",
    bio: "Formado pela USP com residência no InCor. Mais de 20 anos de experiência em cardiologia clínica e intervencionista. Membro titular da Sociedade Brasileira de Cardiologia.",
    instituteId: "cardiologia",
  },
  {
    id: "dra-ana-lima",
    name: "Dra. Ana Lima",
    specialty: "Cardiologista Pediátrica",
    crm: "CRM/SP 234567",
    bio: "Especialista em cardiopatias congênitas pela Unicamp. Atua com ecocardiografia fetal e acompanhamento de crianças com doenças cardíacas.",
    instituteId: "cardiologia",
  },
  {
    id: "dr-roberto-silva",
    name: "Dr. Roberto Silva",
    specialty: "Ortopedista - Coluna",
    crm: "CRM/SP 345678",
    bio: "Fellow em cirurgia de coluna pela Cleveland Clinic (EUA). Referência em tratamentos minimamente invasivos para hérnia de disco e estenose.",
    instituteId: "ortopedia",
  },
  {
    id: "dra-marina-costa",
    name: "Dra. Marina Costa",
    specialty: "Ortopedista - Medicina Esportiva",
    crm: "CRM/SP 456789",
    bio: "Médica da Seleção Brasileira de Vôlei. Especialista em lesões esportivas e reabilitação de atletas de alto rendimento.",
    instituteId: "ortopedia",
  },
  {
    id: "dra-juliana-santos",
    name: "Dra. Juliana Santos",
    specialty: "Dermatologista",
    crm: "CRM/SP 567890",
    bio: "Mestre em Dermatologia pela UNIFESP. Especialista em dermatologia clínica e estética, com foco em tratamentos a laser e rejuvenescimento.",
    instituteId: "dermatologia",
  },
  {
    id: "dr-fernando-alves",
    name: "Dr. Fernando Alves",
    specialty: "Oftalmologista",
    crm: "CRM/SP 678901",
    bio: "PhD em Oftalmologia pela USP. Especialista em cirurgia refrativa e catarata. Pioneiro em técnicas de cirurgia a laser no Brasil.",
    instituteId: "oftalmologia",
  },
];

export const convenios = [
  "Bradesco Saúde", "Vale",
];

export function getWhatsAppLink(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}
