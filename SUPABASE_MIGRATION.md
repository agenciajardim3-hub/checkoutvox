# Migrações Supabase

## Como Executar as Migrações

### 1. Acessar o SQL Editor do Supabase

1. Abra o [Supabase Dashboard](https://supabase.com)
2. Selecione seu projeto
3. Vá para **SQL Editor** (barra lateral esquerda)
4. Clique em **New Query**

### 2. Copiar e Executar o Script

#### Para adicionar campo "Pago por" (payer_name):

```sql
-- Migration: Add payer fields to leads table
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS payer_name TEXT;
```

**Passos:**
1. Copie o script acima
2. Cole no SQL Editor
3. Clique em **Run** (Ctrl+Enter)
4. Você verá a mensagem "Success" quando concluir

#### Scripts Adicionais (conforme necessário):

Para usar as migrations prontas no projeto:

```bash
# Ver todas as migrations disponíveis
ls -la sql/migrations/

# Cada arquivo .sql na pasta migrations/ pode ser copiado e executado no Supabase
```

## Campos da Tabela `leads`

A tabela `leads` agora deve ter:
- `id` (UUID) - Identificador único
- `name` (TEXT) - Nome do leads
- `email` (TEXT) - Email
- `phone` (TEXT) - Telefone
- `city` (TEXT) - Cidade
- `cpf` (TEXT) - CPF
- `product_id` (TEXT) - ID do Produto
- `product_name` (TEXT) - Nome do Produto
- `turma` (TEXT) - Turma
- `status` (TEXT) - Status (Novo, Pago, Pendente, etc)
- `paid_amount` (NUMERIC) - Valor Pago
- `payment_method` (TEXT) - Método de Pagamento (Pix, Cartão, etc)
- `payer_name` (TEXT) - **Nome de quem pagou** ✅
- `payer_email` (TEXT) - Email de quem pagou
- `payer_phone` (TEXT) - Telefone de quem pagou
- `payer_document` (TEXT) - Documento de quem pagou
- `checked_in` (BOOLEAN) - Se fez check-in
- `created_at` (TIMESTAMPTZ) - Data de criação
- ... e outros campos

## Verificar se o Campo foi Adicionado

Execute no SQL Editor:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'leads' AND column_name = 'payer_name';
```

Se retornar uma linha, o campo existe ✅
