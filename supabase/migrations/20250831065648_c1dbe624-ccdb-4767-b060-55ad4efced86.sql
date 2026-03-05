-- Fix the function search path security issue
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';

-- Add security definer and stable properties for better security
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;