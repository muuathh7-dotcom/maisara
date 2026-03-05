-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.generate_booking_reference()
RETURNS TEXT 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN 'BK-' || UPPER(substring(gen_random_uuid()::text from 1 for 8));
END;
$$;