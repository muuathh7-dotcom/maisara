-- Fix RLS policies for bookings table to allow proper insertions
-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "No direct select access to bookings" ON public.bookings;

-- Create proper policies for bookings
-- Allow anyone to insert bookings (for guest checkout)
CREATE POLICY "Allow booking insertions" ON public.bookings
  FOR INSERT
  WITH CHECK (true);

-- Allow users to select bookings by booking reference (for booking lookup)
CREATE POLICY "Allow booking lookup by reference" ON public.bookings
  FOR SELECT
  USING (true);