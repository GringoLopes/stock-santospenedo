-- =====================================================
-- DIAGNÓSTICO RLS - INVESTIGAÇÃO DO PROBLEMA
-- Execute estes comandos no SQL Editor do Supabase
-- =====================================================

-- 1. VERIFICAR USUÁRIOS EXISTENTES
SELECT id, name, is_admin, active 
FROM custom_users 
ORDER BY name;

-- 2. VERIFICAR CLIENTES E SEUS DONOS
SELECT 
    c.code,
    c.client,
    c.user_id,
    u.name as dono_usuario,
    u.is_admin
FROM clients c
LEFT JOIN custom_users u ON c.user_id = u.id
WHERE c.client ILIKE '%TONIOLO%'
ORDER BY c.client;

-- 3. VERIFICAR TODOS OS CLIENTES E SEUS DONOS
SELECT 
    u.name as usuario,
    u.is_admin,
    COUNT(c.id) as total_clientes,
    STRING_AGG(c.client, ', ' ORDER BY c.client LIMIT 5) as exemplos
FROM custom_users u
LEFT JOIN clients c ON u.id = c.user_id
WHERE u.active = true
GROUP BY u.id, u.name, u.is_admin
ORDER BY u.name;

-- 4. VERIFICAR CLIENTES SEM DONO (PROBLEMA COMUM)
SELECT 
    code,
    client,
    user_id,
    CASE 
        WHEN user_id IS NULL THEN '⚠️ SEM DONO - PROBLEMA!'
        ELSE '✅ OK'
    END as status
FROM clients 
WHERE user_id IS NULL;

-- 5. TESTAR CONFIGURAÇÃO RLS ATUAL
-- (Execute como teste após fazer login)
SELECT current_setting('request.user.id', true) as user_id_configurado;

-- 6. VERIFICAR POLÍTICAS RLS ATIVAS
SELECT 
    schemaname,
    tablename, 
    policyname,
    cmd,
    roles,
    qual as condicao
FROM pg_policies 
WHERE tablename = 'clients'
ORDER BY cmd;
