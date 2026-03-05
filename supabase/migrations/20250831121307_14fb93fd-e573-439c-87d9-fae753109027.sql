-- Add booking reference for secure access to bookings
ALTER TABLE public.bookings ADD COLUMN booking_reference TEXT;

-- Generate a function to create unique booking references
CREATE OR REPLACE FUNCTION public.generate_booking_reference()
RETURNS TEXT AS $$
BEGIN
  RETURN 'BK-' || UPPER(substring(gen_random_uuid()::text from 1 for 8));
END;
$$ LANGUAGE plpgsql;

-- Set default value for booking_reference column
ALTER TABLE public.bookings ALTER COLUMN booking_reference SET DEFAULT public.generate_booking_reference();

-- Update existing records with booking references
UPDATE public.bookings SET booking_reference = public.generate_booking_reference() WHERE booking_reference IS NULL;

-- Make booking_reference NOT NULL after updating existing records
ALTER TABLE public.bookings ALTER COLUMN booking_reference SET NOT NULL;

-- Create unique index on booking_reference
CREATE UNIQUE INDEX idx_bookings_reference ON public.bookings(booking_reference);

-- Add RLS policy for reading bookings with booking reference
CREATE POLICY "Users can view bookings with valid reference"
ON public.bookings
FOR SELECT
USING (
  booking_reference = current_setting('request.booking_reference', true)
);

-- Add RLS policy for admin access (if needed in future)
CREATE POLICY "Service access to bookings"
ON public.bookings
FOR SELECT
USING (
  current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
);