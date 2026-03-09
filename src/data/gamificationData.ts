export interface Level {
  level: number;
  name: string;
  minPoints: number;
  icon: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  requiredLevel: number;
  totalLessons: number;
  completedLessons: number;
}

export interface Activity {
  id: string;
  description: string;
  points: number;
  date: string;
  type: "aula" | "comprovante" | "quiz" | "meta";
}

export const LEVELS: Level[] = [
  { level: 1, name: "Iniciante", minPoints: 0, icon: "🌱" },
  { level: 2, name: "Curioso", minPoints: 100, icon: "🔍" },
  { level: 3, name: "Explorador", minPoints: 300, icon: "🧭" },
  { level: 4, name: "Aprendiz", minPoints: 600, icon: "📚" },
  { level: 5, name: "Estrategista", minPoints: 1000, icon: "♟️" },
  { level: 6, name: "Planejador", minPoints: 1500, icon: "📋" },
  { level: 7, name: "Construtor", minPoints: 2200, icon: "🏗️" },
  { level: 8, name: "Guardião", minPoints: 3000, icon: "🛡️" },
  { level: 9, name: "Mestre", minPoints: 4000, icon: "🎓" },
  { level: 10, name: "Protagonista", minPoints: 5500, icon: "⭐" },
];

export const COURSES: Course[] = [
  { id: "1", title: "Orçamento Pessoal", description: "Aprenda a controlar suas receitas e despesas", points: 15, completed: true, requiredLevel: 1, totalLessons: 5, completedLessons: 5 },
  { id: "2", title: "Poupança Inteligente", description: "Estratégias para guardar dinheiro todo mês", points: 20, completed: true, requiredLevel: 1, totalLessons: 4, completedLessons: 4 },
  { id: "3", title: "Crédito Consciente", description: "Use o crédito a seu favor sem se endividar", points: 25, completed: false, requiredLevel: 2, totalLessons: 6, completedLessons: 3 },
  { id: "4", title: "Investimentos Básicos", description: "Primeiros passos no mundo dos investimentos", points: 30, completed: false, requiredLevel: 3, totalLessons: 8, completedLessons: 0 },
  { id: "5", title: "Empreendedorismo", description: "Transforme suas habilidades em renda", points: 35, completed: false, requiredLevel: 4, totalLessons: 7, completedLessons: 0 },
  { id: "6", title: "Planejamento Financeiro", description: "Monte seu plano financeiro de longo prazo", points: 40, completed: false, requiredLevel: 5, totalLessons: 6, completedLessons: 0 },
  { id: "7", title: "Proteção Financeira", description: "Seguros e reserva de emergência", points: 30, completed: false, requiredLevel: 6, totalLessons: 5, completedLessons: 0 },
  { id: "8", title: "Renda Extra", description: "Descubra formas de aumentar sua renda", points: 35, completed: false, requiredLevel: 7, totalLessons: 6, completedLessons: 0 },
];

export const ACTIVITIES: Activity[] = [
  { id: "1", description: "Assistiu aula: Crédito Consciente — Módulo 3", points: 25, date: "2026-03-06", type: "aula" },
  { id: "2", description: "Enviou comprovante de renda — Março", points: 20, date: "2026-03-05", type: "comprovante" },
  { id: "3", description: "Completou quiz: Poupança Inteligente", points: 10, date: "2026-03-04", type: "quiz" },
  { id: "4", description: "Meta semanal atingida: 3 aulas concluídas", points: 15, date: "2026-03-03", type: "meta" },
  { id: "5", description: "Assistiu aula: Crédito Consciente — Módulo 2", points: 25, date: "2026-03-02", type: "aula" },
  { id: "6", description: "Enviou comprovante de pagamento — Aluguel", points: 20, date: "2026-02-28", type: "comprovante" },
  { id: "7", description: "Assistiu aula: Crédito Consciente — Módulo 1", points: 25, date: "2026-02-27", type: "aula" },
  { id: "8", description: "Completou curso: Poupança Inteligente", points: 50, date: "2026-02-25", type: "aula" },
  { id: "9", description: "Enviou extrato PIX — Fevereiro", points: 15, date: "2026-02-20", type: "comprovante" },
  { id: "10", description: "Meta quinzenal atingida: score +5", points: 20, date: "2026-02-15", type: "meta" },
];

export const USER_MOCK = {
  name: "Maria Silva",
  totalPoints: 385,
  currentLevel: 3,
  scoreContribution: 12,
  scoreTotal: 48,
};
