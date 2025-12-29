-- Create portfolio_settings table for profile data
CREATE TABLE public.portfolio_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Your Name',
  title TEXT NOT NULL DEFAULT 'Video Editor & Graphic Designer',
  bio TEXT NOT NULL DEFAULT 'Welcome to my portfolio!',
  discord_username TEXT NOT NULL DEFAULT 'username#0000',
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create portfolio_items table for videos and designs
CREATE TABLE public.portfolio_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('video', 'design')),
  youtube_url TEXT,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public read access (portfolio is public)
ALTER TABLE public.portfolio_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

-- Public read access for portfolio
CREATE POLICY "Anyone can view portfolio settings" 
ON public.portfolio_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view portfolio items" 
ON public.portfolio_items 
FOR SELECT 
USING (true);

-- Admin can modify (using password-based admin, no auth required)
CREATE POLICY "Anyone can insert portfolio settings" 
ON public.portfolio_settings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update portfolio settings" 
ON public.portfolio_settings 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can insert portfolio items" 
ON public.portfolio_items 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update portfolio items" 
ON public.portfolio_items 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete portfolio items" 
ON public.portfolio_items 
FOR DELETE 
USING (true);

-- Insert default settings row
INSERT INTO public.portfolio_settings (name, title, bio, discord_username)
VALUES ('Your Name', 'Video Editor & Graphic Designer', 'Welcome to my portfolio! I specialize in creating stunning video content and eye-catching graphic designs.', 'username#0000');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_portfolio_settings_updated_at
BEFORE UPDATE ON public.portfolio_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_items_updated_at
BEFORE UPDATE ON public.portfolio_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();