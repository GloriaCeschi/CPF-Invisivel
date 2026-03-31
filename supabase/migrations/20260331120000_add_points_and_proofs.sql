-- Add points column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;

-- Create proofs table (unified table for incomes and bills)
CREATE TABLE IF NOT EXISTS public.proofs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'bill')),
  title TEXT NOT NULL,
  description TEXT,
  amount NUMERIC NOT NULL DEFAULT 0,
  receipt_type TEXT, -- for incomes
  total_installments INTEGER DEFAULT 1, -- for bills
  current_installment INTEGER DEFAULT 1, -- for bills
  next_due_date DATE, -- for bills
  proof TEXT, -- URL of uploaded file
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado')),
  feedback TEXT,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  update_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS for proofs
ALTER TABLE public.proofs ENABLE ROW LEVEL SECURITY;

-- RLS policy for proofs
CREATE POLICY "Users can manage own proofs" ON public.proofs
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Function to add points for income approval
CREATE OR REPLACE FUNCTION add_income_points(income_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  proof_record RECORD;
  points_to_add INTEGER := 0;
BEGIN
  -- Get the proof record
  SELECT * INTO proof_record FROM proofs WHERE id = income_id AND type = 'income';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Income proof not found';
  END IF;

  -- Calculate points based on amount (example: 1 point per R$10)
  points_to_add := GREATEST(1, FLOOR(proof_record.amount / 10));

  -- Update the proof with points
  UPDATE proofs SET points = points_to_add WHERE id = income_id;

  -- Add points to user profile
  UPDATE profiles SET points = COALESCE(points, 0) + points_to_add WHERE user_id = proof_record.user_id;

  -- Log the points addition (optional)
  RAISE NOTICE 'Added % points to user % for income proof %', points_to_add, proof_record.user_id, income_id;
END;
$$;

-- Function to add points for bill approval
CREATE OR REPLACE FUNCTION add_bill_points(bill_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  proof_record RECORD;
  points_to_add INTEGER := 0;
BEGIN
  -- Get the proof record
  SELECT * INTO proof_record FROM proofs WHERE id = bill_id AND type = 'bill';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Bill proof not found';
  END IF;

  -- Calculate points based on amount (example: 2 points per R$10 for bills)
  points_to_add := GREATEST(1, FLOOR(proof_record.amount / 10) * 2);

  -- Update the proof with points
  UPDATE proofs SET points = points_to_add WHERE id = bill_id;

  -- Add points to user profile
  UPDATE profiles SET points = COALESCE(points, 0) + points_to_add WHERE user_id = proof_record.user_id;

  -- Log the points addition (optional)
  RAISE NOTICE 'Added % points to user % for bill proof %', points_to_add, proof_record.user_id, bill_id;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION add_income_points(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION add_bill_points(UUID) TO authenticated;