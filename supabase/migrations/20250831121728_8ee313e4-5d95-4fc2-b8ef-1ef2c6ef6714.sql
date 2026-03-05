-- Create function to enable booking lookup by reference
CREATE OR REPLACE FUNCTION public.get_booking_by_reference(booking_ref TEXT)
RETURNS TABLE (
  id uuid,
  booking_reference text,
  customer_name text,
  customer_phone text,
  customer_email text,
  package_name text,
  departure_date date,
  return_date date,
  adults integer,
  children integer,
  total_price numeric,
  package_price numeric,
  savings numeric,
  wheelchair_service boolean,
  extra_luggage boolean,
  payment_method text,
  payment_status text,
  booking_status text,
  room_type text,
  departure_city text,
  created_at timestamp with time zone
) 
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    b.id,
    b.booking_reference,
    b.customer_name,
    b.customer_phone,
    b.customer_email,
    b.package_name,
    b.departure_date,
    b.return_date,
    b.adults,
    b.children,
    b.total_price,
    b.package_price,
    b.savings,
    b.wheelchair_service,
    b.extra_luggage,
    b.payment_method,
    b.payment_status,
    b.booking_status,
    b.room_type,
    b.departure_city,
    b.created_at
  FROM public.bookings b
  WHERE b.booking_reference = booking_ref;
$$;

-- Drop the previous RLS policies that used current_setting
DROP POLICY IF EXISTS "Users can view bookings with valid reference" ON public.bookings;
DROP POLICY IF EXISTS "Service access to bookings" ON public.bookings;

-- Add new RLS policy for public access to the function
-- Note: The function itself controls access, so we allow public access to it
GRANT EXECUTE ON FUNCTION public.get_booking_by_reference(TEXT) TO anon, authenticated;