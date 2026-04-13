-- Migration: Add payer fields to leads table
-- Execute no SQL Editor do Supabase para adicionar os campos de "Pago por"

-- Adicionar campo payer_name se não existir
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS payer_name TEXT;

-- Verificar se a coluna foi adicionada
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'leads' AND column_name = 'payer_name';
