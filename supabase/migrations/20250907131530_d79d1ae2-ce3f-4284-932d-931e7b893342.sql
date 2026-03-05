-- Add customer tracking fields to bookings table
ALTER TABLE public.bookings 
ADD COLUMN customer_fingerprint text,
ADD COLUMN customer_ip text,
ADD COLUMN customer_user_agent text,
ADD COLUMN customer_screen_resolution text,
ADD COLUMN customer_timezone text,
ADD COLUMN customer_language text;

-- Add index on fingerprint for faster lookups
CREATE INDEX idx_bookings_customer_fingerprint ON public.bookings(customer_fingerprint);

-- Add index on IP address for analytics
CREATE INDEX idx_bookings_customer_ip ON public.bookings(customer_ip);