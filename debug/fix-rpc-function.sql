-- =====================================================
-- CORREÇÃO DA FUNÇÃO RPC - SE NECESSÁRIO
-- Execute apenas se o teste anterior falhar
-- =====================================================

-- 1. RECRIAR FUNÇÃO set_request_user (CORRIGIDA)
CREATE OR REPLACE FUNCTION set_request_user(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Log para debug
  RAISE NOTICE 'Setting request.user.id to: %', user_id;
  
  -- Configurar na sessão
  PERFORM set_config('request.user.id', user_id::text, true);
  
  -- Verificar se foi definido
  RAISE NOTICE 'Current request.user.id: %', current_setting('request.user.id', true);
END;
$$;

-- 2. TESTAR FUNÇÃO CORRIGIDA
SELECT set_request_user('9e96e010-d99e-44f2-8e27-ddedc6222a74'::uuid);

-- 3. VERIFICAR CONFIGURAÇÃO
SELECT current_setting('request.user.id', true) as user_configurado;

-- 4. TESTAR BUSCA
SELECT * FROM clients WHERE client ILIKE '%TONIOLO%';