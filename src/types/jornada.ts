export interface Bill {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  amount: number;
  total_installments: number;
  current_installment: number;
  next_due_date: string | null;
  status: string;
  receipt_url: string | null;
  payment_date: string;
  created_at: string;
}

export interface Income {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  amount: number;
  receipt_type: string;
  receipt_url: string | null;
  recorded_at: string;
  created_at: string;
}
