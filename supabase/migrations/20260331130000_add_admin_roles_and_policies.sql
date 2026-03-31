-- Add roles column to profiles table if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS roles TEXT DEFAULT 'user';

-- Update RLS policies for proofs to allow admins to see all proofs
DROP POLICY IF EXISTS "Users can manage own proofs" ON public.proofs;

-- Policy for regular users (can only see/manage their own proofs)
CREATE POLICY "Users can manage own proofs" ON public.proofs
  FOR ALL TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND roles = 'admin'
    )
  )
  WITH CHECK (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND roles = 'admin'
    )
  );

-- Grant necessary permissions
GRANT SELECT, UPDATE ON public.profiles TO authenticated;