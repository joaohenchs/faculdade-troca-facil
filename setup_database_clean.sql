-- ==========================================
-- TROCA CERTA - Setup COMPLETO (Limpa e Recria)
-- Execute este SQL no Supabase SQL Editor
-- ==========================================

-- ==========================================
-- PASSO 1: LIMPAR TUDO
-- ==========================================
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.trade_requests CASCADE;
DROP TABLE IF EXISTS public.items CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- ==========================================
-- PASSO 2: EXTENSÕES
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- PASSO 3: TABELA profiles
-- ==========================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ==========================================
-- PASSO 4: TABELA items
-- ==========================================
CREATE TABLE public.items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  image_url TEXT,
  type TEXT NOT NULL DEFAULT 'trade',
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'traded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available items"
  ON public.items FOR SELECT USING (true);

CREATE POLICY "Users can insert own items"
  ON public.items FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own items"
  ON public.items FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own items"
  ON public.items FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- PASSO 5: TABELA trade_requests
-- ==========================================
CREATE TABLE public.trade_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  offered_item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  requested_item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'finished')),
  confirmed_by_requester BOOLEAN NOT NULL DEFAULT false,
  confirmed_by_offerer BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.trade_requests ENABLE ROW LEVEL SECURITY;

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
  WITH CHECK (auth.uid() IN (SELECT user_id FROM public.items WHERE id = offered_item_id));

CREATE POLICY "Item owners can update trade requests"
  ON public.trade_requests FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.items WHERE id = offered_item_id
      UNION
      SELECT user_id FROM public.items WHERE id = requested_item_id
    )
  );

-- ==========================================
-- PASSO 6: TABELA messages
-- ==========================================
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trade_id UUID NOT NULL REFERENCES public.trade_requests(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages from their trades"
  ON public.messages FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.items WHERE id IN (
        SELECT offered_item_id FROM public.trade_requests WHERE id = trade_id
        UNION
        SELECT requested_item_id FROM public.trade_requests WHERE id = trade_id
      )
    )
  );

CREATE POLICY "Users can send messages to their trades"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    auth.uid() IN (
      SELECT user_id FROM public.items WHERE id IN (
        SELECT offered_item_id FROM public.trade_requests WHERE id = trade_id
        UNION
        SELECT requested_item_id FROM public.trade_requests WHERE id = trade_id
      )
    )
  );

-- ==========================================
-- PASSO 7: TRIGGER auto-create profile
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'User'));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- PASSO 8: ÍNDICES
-- ==========================================
CREATE INDEX idx_items_user_id ON public.items(user_id);
CREATE INDEX idx_items_status ON public.items(status);
CREATE INDEX idx_items_type ON public.items(type);
CREATE INDEX idx_trade_requests_offered_item ON public.trade_requests(offered_item_id);
CREATE INDEX idx_trade_requests_requested_item ON public.trade_requests(requested_item_id);
CREATE INDEX idx_trade_requests_status ON public.trade_requests(status);
CREATE INDEX idx_messages_trade_id ON public.messages(trade_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);

-- ==========================================
-- PRONTO! Banco configurado com sucesso!
-- ==========================================
