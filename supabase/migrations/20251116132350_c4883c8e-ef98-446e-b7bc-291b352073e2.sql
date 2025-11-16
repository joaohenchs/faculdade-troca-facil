-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create items table
CREATE TABLE public.items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'traded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on items
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Items policies
CREATE POLICY "Anyone can view available items"
  ON public.items FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own items"
  ON public.items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own items"
  ON public.items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own items"
  ON public.items FOR DELETE
  USING (auth.uid() = user_id);

-- Create trade_requests table
CREATE TABLE public.trade_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  offered_item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  requested_item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'finished')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on trade_requests
ALTER TABLE public.trade_requests ENABLE ROW LEVEL SECURITY;

-- Trade requests policies
CREATE POLICY "Users can view their trade requests"
  ON public.trade_requests FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.items WHERE id = offered_item_id
      UNION
      SELECT user_id FROM public.items WHERE id = requested_item_id
    )
  );

CREATE POLICY "Users can create trade requests"
  ON public.trade_requests FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM public.items WHERE id = offered_item_id)
  );

CREATE POLICY "Item owners can update trade requests"
  ON public.trade_requests FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.items WHERE id = requested_item_id
    )
  );

-- Create trigger function for new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create index for better performance
CREATE INDEX idx_items_user_id ON public.items(user_id);
CREATE INDEX idx_items_status ON public.items(status);
CREATE INDEX idx_trade_requests_offered_item ON public.trade_requests(offered_item_id);
CREATE INDEX idx_trade_requests_requested_item ON public.trade_requests(requested_item_id);
CREATE INDEX idx_trade_requests_status ON public.trade_requests(status);