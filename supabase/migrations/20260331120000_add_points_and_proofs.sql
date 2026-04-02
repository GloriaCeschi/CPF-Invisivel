-- Add points column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;

-- Create notifications table (integração de curso/comprovante)
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'system',
  viewed BOOLEAN NOT NULL DEFAULT FALSE,
  archived BOOLEAN NOT NULL DEFAULT FALSE,
  key_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON public.notifications
  FOR DELETE
  USING (auth.uid() = user_id);

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

-- Create courses_progress table to track course completion por usuário
CREATE TABLE IF NOT EXISTS public.courses_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id INTEGER NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);

ALTER TABLE public.courses_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own course progress" ON public.courses_progress
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Funcção para finalizar curso + adicionar pontos uma única vez
CREATE OR REPLACE FUNCTION complete_course(uid UUID, p_course_id INTEGER, pts INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  progress_record RECORD;
  course_title TEXT;
BEGIN
  SELECT title INTO course_title FROM public.courses WHERE id = p_course_id;

  SELECT * INTO progress_record
  FROM public.courses_progress
  WHERE user_id = uid AND course_id = p_course_id
  FOR UPDATE;

  IF NOT FOUND THEN
    INSERT INTO public.courses_progress (user_id, course_id, progress, completed_at, updated_at)
    VALUES (uid, p_course_id, 100, now(), now());
    UPDATE public.profiles SET points = COALESCE(points, 0) + pts WHERE user_id = uid;

    INSERT INTO public.notifications (user_id, message, "type", viewed, archived, key_id, created_at)
    SELECT uid,
      COALESCE(format('🎉 Curso concluído: %s — +%s pontos', course_title, pts),
               format('🎉 Curso #%s concluído — +%s pontos', p_course_id, pts)),
      'course',
      FALSE,
      FALSE,
      p_course_id::text,
      now()
    WHERE NOT EXISTS (
      SELECT 1 FROM public.notifications
      WHERE user_id = uid AND key_id = p_course_id::text AND "type" = 'course'
    );
  ELSIF progress_record.progress < 100 THEN
    UPDATE public.courses_progress
    SET progress = 100,
        completed_at = now(),
        updated_at = now()
    WHERE user_id = uid AND course_id = p_course_id;

    UPDATE public.profiles SET points = COALESCE(points, 0) + pts WHERE user_id = uid;

    INSERT INTO public.notifications (user_id, message, "type", viewed, archived, key_id, created_at)
    SELECT uid,
      COALESCE(format('🎉 Curso concluído: %s — +%s pontos', course_title, pts),
               format('🎉 Curso #%s concluído — +%s pontos', p_course_id, pts)),
      'course',
      FALSE,
      FALSE,
      p_course_id::text,
      now()
    WHERE NOT EXISTS (
      SELECT 1 FROM public.notifications
      WHERE user_id = uid AND key_id = p_course_id::text AND "type" = 'course'
    );
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION complete_course(UUID, INTEGER, INTEGER) TO authenticated;

-- Função para enviar notificação quando comprovante é analisado (aprovado/rejeitado)
CREATE OR REPLACE FUNCTION notify_proof_status(proof_id UUID, new_status TEXT, p_points INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  pf RECORD;
  msg TEXT;
BEGIN
  SELECT * INTO pf FROM public.proofs WHERE id = proof_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Proof not found';
  END IF;

  IF new_status = 'aprovado' THEN
    UPDATE public.profiles
      SET points = COALESCE(points, 0) + p_points,
          updated_at = now()
      WHERE user_id = pf.user_id;

    IF pf.type = 'income' THEN
      msg := format('✅ Comprovante de renda "%s" foi aprovado! Parabéns! , +%s pontos adicionados à sua gamificação.', pf.title, p_points);
    ELSIF pf.type = 'bill' THEN
      msg := format('✅ Comprovante de conta "%s" foi aprovado! Parabéns! , +%s pontos adicionados à sua gamificação.', pf.title, p_points);
    ELSE
      msg := format('✅ Comprovante "%s" foi aprovado! +%s pontos adicionados.', pf.title, p_points);
    END IF;
  ELSIF new_status = 'rejeitado' THEN
    IF pf.type = 'income' THEN
      msg := format('❌ Comprovante de renda "%s" não foi aceito. Por favor, revise as informações e reenvie.', pf.title);
    ELSIF pf.type = 'bill' THEN
      msg := format('❌ Comprovante de conta "%s" não foi aceito. Por favor, revise as informações e reenvie.', pf.title);
    ELSE
      msg := format('❌ Comprovante "%s" não foi aceito. Por favor, revise as informações e reenvie.', pf.title);
    END IF;
  END IF;

  INSERT INTO public.notifications (user_id, message, "type", viewed, archived, key_id, created_at)
  SELECT pf.user_id, msg, 'proof', FALSE, FALSE, proof_id::text, now()
  WHERE NOT EXISTS (
    SELECT 1 FROM public.notifications
    WHERE user_id = pf.user_id AND key_id = proof_id::text AND "type" = 'proof' AND message = msg
  );
END;
$$;

GRANT EXECUTE ON FUNCTION notify_proof_status(UUID, TEXT, INTEGER) TO authenticated;