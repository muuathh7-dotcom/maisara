-- Remove the overly permissive policy that allows public viewing of all bookings
DROP POLICY IF EXISTS "Allow viewing bookings" ON public.bookings;

-- Keep the policy that allows anyone to create bookings (needed for the booking form)
-- This policy already exists: "Anyone can create bookings" for INSERT

-- Add a comment to document the security decision
COMMENT ON TABLE public.bookings IS 'Bookings table - INSERT allowed for public booking submissions, SELECT restricted for privacy';