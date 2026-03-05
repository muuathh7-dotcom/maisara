-- Remove the dangerously permissive policy
DROP POLICY IF EXISTS "Anyone can view their own booking with reference" ON public.bookings;

-- Create a policy that explicitly denies all direct SELECT access
CREATE POLICY "No direct select access to bookings"
ON public.bookings
FOR SELECT
USING (false);

-- Ensure RLS is enabled
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Confirm the secure function still has proper permissions
GRANT EXECUTE ON FUNCTION public.get_booking_by_reference(text) TO anon, authenticated;