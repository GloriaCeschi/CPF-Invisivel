export interface Proof {
  id: string;
  user_id: string;
  type: "income" | "bill"; // identifica se é renda ou conta
  title: string;
  description: string | null;
  amount: number;
  receipt_type?: string; // usado em incomes
  total_installments?: number; // usado em bills
  current_installment?: number; // usado em bills
  next_due_date?: string | null; // usado em bills
  proof?: string; // URL do arquivo enviado
  status: "pendente" | "aprovado" | "rejeitado";
  feedback?: string | null;
  points?: number;
  created_at: string;
  update_at?: string | null;
}

