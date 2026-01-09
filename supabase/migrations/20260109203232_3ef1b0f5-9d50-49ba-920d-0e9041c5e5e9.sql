
-- Fix the permissive RLS policy for journal_activite
DROP POLICY IF EXISTS "System can insert activity" ON public.journal_activite;

-- Create a more secure policy that allows authenticated users to insert their own activity
CREATE POLICY "Users can insert their own activity" ON public.journal_activite 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Also allow service role / edge functions to insert via security definer function
CREATE OR REPLACE FUNCTION public.log_activity(
  _user_id UUID,
  _type_action activity_type,
  _details JSONB DEFAULT '{}',
  _visible_candidat BOOLEAN DEFAULT true
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _id UUID;
BEGIN
  INSERT INTO public.journal_activite (user_id, type_action, details, visible_candidat)
  VALUES (_user_id, _type_action, _details, _visible_candidat)
  RETURNING id INTO _id;
  RETURN _id;
END;
$$;
