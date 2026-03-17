-- Script completo para corrigir schema
-- Execute no SQL Editor do Supabase

-- 1. Adicionar colunas na tabela leads se não existirem
ALTER TABLE leads ADD COLUMN IF NOT EXISTS emitted_by TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS emission_date TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS coupon_code TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS time TEXT;

-- 2. Adicionar colunas na tabela checkouts
ALTER TABLE checkouts ADD COLUMN IF NOT EXISTS event_date TEXT;
ALTER TABLE checkouts ADD COLUMN IF NOT EXISTS event_start_time TEXT;
ALTER TABLE checkouts ADD COLUMN IF NOT EXISTS event_end_time TEXT;
ALTER TABLE checkouts ADD COLUMN IF NOT EXISTS event_location TEXT;

-- 3. Criar tabela expenses se não existir
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  category TEXT DEFAULT 'material',
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Criar tabela coupons se não existir
CREATE TABLE IF NOT EXISTS coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT DEFAULT 'percentage',
  discount_value NUMERIC NOT NULL,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  product_id TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Verificar resultado
SELECT 'leads' as table_name, COUNT(*) as row_count FROM leads
UNION ALL
SELECT 'checkouts', COUNT(*) FROM checkouts
UNION ALL
SELECT 'expenses', COUNT(*) FROM expenses
UNION ALL
SELECT 'coupons', COUNT(*) FROM coupons;
