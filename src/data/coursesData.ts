export interface CourseInfo {
  id: number;
  title: string;
  description: string;
  points: number;
  progress: number;
  completed: boolean;
  requiredLevel: number;
  totalLessons: number;
  completedLessons: number;
  locked: boolean;
  lockReason?: string;
  category: string;
  videoUrl?: string;
}

export const COURSES: CourseInfo[] = [
  { id: 1, title: "Como adicionar contas e boletos", description: "Aprenda a organizar e registrar suas contas e boletos de forma prática.", points: 45, progress: 0, completed: false, requiredLevel: 1, totalLessons: 5, completedLessons: 0, locked: false, category: "Básico", videoUrl: "https://youtu.be/dQw4w9WgXcQ?si=QzmfJ4v62nAcxv6j" },
  { id: 2, title: "Acompanhamento de renda", description: "Monitore suas fontes de renda e entenda seu fluxo financeiro mensal.", points: 45, progress: 0, completed: false, requiredLevel: 1, totalLessons: 4, completedLessons: 0, locked: false, category: "Básico", videoUrl: "https://youtu.be/3LNafnShdxE?si=yHpneS-xpMEFMso6" },
  { id: 3, title: "Gestão Financeira", description: "Curso completo de gestão financeira pessoal e familiar.", points: 45, progress: 0, completed: false, requiredLevel: 2, totalLessons: 6, completedLessons: 0, locked: false, category: "Intermediário", videoUrl: "https://youtu.be/PfsO9apQy-w?si=8aww5rwLFwxXnKB2" },
  { id: 4, title: "Empreendedorismo", description: "Inicie seu negócio com bases sólidas e planejamento estratégico.", points: 45, progress: 0, completed: false, requiredLevel: 3, totalLessons: 7, completedLessons: 0, locked: false, category: "Avançado", videoUrl: "https://youtu.be/kIFCyGkjEh4?si=NX8q3IUJj3nI9s1v" },
  { id: 5, title: "Planejamento Familiar", description: "Renegociação de dívidas, redução de despesas e orçamento familiar.", points: 45, progress: 0, completed: false, requiredLevel: 3, totalLessons: 6, completedLessons: 0, locked: false, category: "Intermediário", videoUrl: "https://youtu.be/Wyi4sPBPiCQ?si=PgbO183C-3_PsQtq" },
  { id: 6, title: "Uso Consciente de Crédito", description: "Entenda como usar crédito de forma inteligente e responsável.", points: 45, progress: 0, completed: false, requiredLevel: 1, totalLessons: 5, completedLessons: 0, locked: false, category: "Básico", videoUrl: "https://youtu.be/A4M9X1HIFoE?si=aPuEiyMUAxU1rbHm" },
  { id: 7, title: "Valor da Sua Hora", description: "Calcule quanto vale a sua hora de trabalho e negocie melhor.", points: 45, progress: 0, completed: false, requiredLevel: 1, totalLessons: 4, completedLessons: 0, locked: false, category: "Básico", videoUrl: "https://youtu.be/zbHNXLaDXco?si=GwO1AGsYjyXQVi6e" },
  { id: 8, title: "Valor da Sua Mão de Obra", description: "Aprenda a precificar seus serviços e trabalho corretamente.", points: 45, progress: 0, completed: false, requiredLevel: 2, totalLessons: 5, completedLessons: 0, locked: false, category: "Intermediário", videoUrl: "https://youtu.be/cxHmqMCn6bA?si=GxTOoxv6ONoWi_oi" },
  { id: 9, title: "Cálculos de Juros e Investimentos", description: "Capacitação básica para entender juros compostos e investimentos.", points: 45, progress: 0, completed: false, requiredLevel: 2, totalLessons: 6, completedLessons: 0, locked: false, category: "Intermediário", videoUrl: "https://youtu.be/dGU6yREVWyM?si=7HdTSSOfcvd29QiA" },
  { id: 10, title: "Direitos do Consumidor", description: "Conheça seus direitos e saiba como se proteger nas relações de consumo.", points: 45, progress: 0, completed: false, requiredLevel: 1, totalLessons: 4, completedLessons: 0, locked: false, category: "Básico", videoUrl: "https://youtu.be/pZBDVklQT-g?si=fY6M2J1nm2XwQmvu" },
  { id: 11, title: "Como Entender o Mercado", description: "Bolsa de valores, produtos financeiros e como o mercado funciona.", points: 45, progress: 0, completed: false, requiredLevel: 3, totalLessons: 6, completedLessons: 0, locked: false, category: "Avançado", videoUrl: "https://youtu.be/zE3MhwFUpnA?si=ZNnysyqhTlMBfij0" },
  { id: 12, title: "Investimentos para Iniciantes", description: "Aprenda a investir do zero. Ao concluir, você receberá crédito gradual!", points: 45, progress: 0, completed: false, requiredLevel: 4, totalLessons: 8, completedLessons: 0, locked: true, lockReason: "Requisitos: Score mínimo de 500 pontos + concluir 'Como Entender o Mercado' e 'Uso Consciente de Crédito' + 75% do curso de Gestão Financeira.", category: "Avançado", videoUrl: "https://youtu.be/dGU6yREVWyM" },
];
