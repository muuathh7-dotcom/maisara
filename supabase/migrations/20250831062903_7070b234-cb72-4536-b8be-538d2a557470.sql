-- Create bookings table to store booking information
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  package_name TEXT NOT NULL,
  departure_date DATE NOT NULL,
  return_date DATE NOT NULL,
  adults INTEGER NOT NULL DEFAULT 1,
  children INTEGER NOT NULL DEFAULT 0,
  room_type TEXT NOT NULL,
  departure_city TEXT NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  package_price DECIMAL(10,2) NOT NULL,
  savings DECIMAL(10,2) DEFAULT 0,
  wheelchair_service BOOLEAN DEFAULT false,
  extra_luggage BOOLEAN DEFAULT false,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  booking_status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all users to insert bookings (public booking system)
CREATE POLICY "Anyone can create bookings" 
ON public.bookings 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Create policy to allow viewing of bookings (for admins to view all bookings)
CREATE POLICY "Allow viewing bookings" 
ON public.bookings 
FOR SELECT 
TO authenticated
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();