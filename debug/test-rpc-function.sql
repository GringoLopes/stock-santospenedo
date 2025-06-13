-- =====================================================
-- TESTE DA FUNÇÃO RPC - DIAGNÓSTICO COMPLETO
-- Execute no SQL Editor do Supabase
-- =====================================================

-- 1. VERIFICAR SE A FUNÇÃO set_request_user EXISTE
SELECT 
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'set_request_user';

-- 2. TESTAR FUNÇÃO MANUALMENTE
SELECT set_request_user('9e96e010-d99e-44f2-8e27-ddedc6222a74'::uuid);

-- 3. VERIFICAR SE FOI CONFIGURADO
SELECT current_setting('request.user.id', true) as user_id_apos_set;

-- 4. TESTAR BUSCA COM RLS APÓS CONFIGURAR
SELECT 
    'TESTE APÓS SET_REQUEST_USER' as momento,
    code,
    client,
    user_id
FROM clients 
WHERE client ILIKE '%TONIOLO%';

-- 5. VERIFICAR FUNÇÃO get_current_user_id
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'get_current_user_id';

-- 6. TESTAR get_current_user_id DIRETAMENTE
SELECT get_current_user_id() as current_user_from_function;

-- 7. VERIFICAR FUNÇÃO is_admin_user
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'is_admin_user';

-- 8. TESTAR is_admin_user DIRETAMENTE
SELECT is_admin_user() as is_current_user_admin;