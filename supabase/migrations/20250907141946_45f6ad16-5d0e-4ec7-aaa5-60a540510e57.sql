-- Create pre_bookings table to track customer interest before final booking
CREATE TABLE public.pre_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id TEXT NOT NULL,
  package_name TEXT NOT NULL,
  departure_date DATE,
  adults INTEGER DEFAULT 1,
  children INTEGER DEFAULT 0,
  wheelchair_service BOOLEAN DEFAULT false,
  extra_luggage BOOLEAN DEFAULT false,
  customer_fingerprint TEXT,
  customer_ip TEXT,
  customer_user_agent TEXT,
  customer_screen_resolution TEXT,
  customer_timezone TEXT,
  customer_language TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pre_bookings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow insertions (for tracking customer interest)
CREATE POLICY "Allow pre-booking insertions" 
ON public.pre_bookings 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow reading pre-bookings (for analytics)
CREATE POLICY "Allow pre-booking lookup" 
ON public.pre_bookings 
FOR SELECT 
USING (true);

-- Add indexes for performance
CREATE INDEX idx_pre_bookings_customer_fingerprint ON public.pre_bookings(customer_fingerprint);
CREATE INDEX idx_pre_bookings_package_id ON public.pre_bookings(package_id);
CREATE INDEX idx_pre_bookings_created_at ON public.pre_bookings(created_at);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_pre_bookings_updated_at
BEFORE UPDATE ON public.pre_bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add pre_booking_id to main bookings table to link completed bookings with pre-bookings
ALTER TABLE public.bookings 
ADD COLUMN pre_booking_id UUID REFERENCES public.pre_bookings(id);