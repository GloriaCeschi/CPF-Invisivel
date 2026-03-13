export const currentScore = 620;

export const scoreHistory = [
  { month: "Abr/25", score: 320 },
  { month: "Mai/25", score: 350 },
  { month: "Jun/25", score: 380 },
  { month: "Jul/25", score: 420 },
  { month: "Ago/25", score: 410 },
  { month: "Set/25", score: 460 },
  { month: "Out/25", score: 500 },
  { month: "Nov/25", score: 530 },
  { month: "Dez/25", score: 560 },
  { month: "Jan/26", score: 580 },
  { month: "Fev/26", score: 600 },
  { month: "Mar/26", score: 620 },
];

export type ScoreLevel = {
  label: string;
  min: number;
  max: number;
  color: string;
  bgColor: string;
};

export const scoreLevels: ScoreLevel[] = [
  { label: "Crítico", min: 0, max: 200, color: "hsl(0, 84%, 60%)", bgColor: "hsl(0, 84%, 95%)" },
  { label: "Baixo", min: 201, max: 400, color: "hsl(45, 93%, 56%)", bgColor: "hsl(45, 93%, 94%)" },
  { label: "Regular", min: 401, max: 600, color: "hsl(217, 91%, 60%)", bgColor: "hsl(217, 91%, 95%)" },
  { label: "Bom", min: 601, max: 800, color: "hsl(160, 84%, 39%)", bgColor: "hsl(160, 84%, 94%)" },
  { label: "Excelente", min: 801, max: 1000, color: "hsl(330, 82%, 60%)", bgColor: "hsl(330, 82%, 95%)" },
];

export function getScoreLevel(score: number): ScoreLevel {
  return scoreLevels.find((l) => score >= l.min && score <= l.max) || scoreLevels[0];
}

export interface ScoreFactor {
  id: string;
  type: "positive" | "negative" | "tip";
  title: string;
  description: string;
  impact?: string;
}

export const scoreFactors: ScoreFactor[] = [
  {
    id: "1",
    type: "positive",
    title: "Conta de internet em dia",
    description: "Você enviou o comprovante de pagamento da internet nos últimos 3 meses consecutivos.",
    impact: "+15 pontos",
  },
  {
    id: "2",
    type: "positive",
    title: "Renda atualizada",
    description: "Sua renda foi atualizada este mês. Continue mantendo os dados atualizados!",
    impact: "+10 pontos",
  },
  {
    id: "3",
    type: "positive",
    title: "Curso de educação financeira concluído",
    description: "Parabéns! Completar cursos na plataforma melhora seu score.",
    impact: "+20 pontos",
  },
  {
    id: "4",
    type: "negative",
    title: "Conta de água pendente",
    description: "O comprovante de pagamento da conta de água de Fev/2026 ainda não foi enviado.",
    impact: "-25 pontos",
  },
  {
    id: "5",
    type: "negative",
    title: "Conta de energia pendente",
    description: "O comprovante de Fev/2026 da conta de energia não foi enviado até a data esperada.",
    impact: "-20 pontos",
  },
  {
    id: "6",
    type: "tip",
    title: "Adicione mais contas recorrentes",
    description: "Cadastrar contas como aluguel, gás ou celular aumenta sua visibilidade financeira.",
  },
  {
    id: "7",
    type: "tip",
    title: "Complete seu perfil",
    description: "Adicione comprovante de endereço e dados profissionais para ganhar mais pontos.",
  },
];

export const achievements = [
  { label: "3 meses consecutivos em dia", achieved: true },
  { label: "Primeiro curso concluído", achieved: true },
  { label: "5 contas cadastradas", achieved: false },
  { label: "Score acima de 600", achieved: true },
];
