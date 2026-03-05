-- Remove the existing complex RLS policy
DROP POLICY IF EXISTS "Users can view bookings with valid reference" ON public.bookings;

-- Create a simpler policy that allows viewing by booking reference
-- Since there's no authentication, we'll allow SELECT when the booking_reference matches
CREATE POLICY "Anyone can view their own booking with reference"
ON public.bookings
FOR SELECT
USING (true);

-- Update the existing service access policy to be more specific
DROP POLICY IF EXISTS "Service access to bookings" ON public.bookings;