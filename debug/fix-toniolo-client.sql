-- =====================================================
-- CORREÇÃO RÁPIDA - ATRIBUIR CLIENTE TONIOLO AO JOELSON
-- Execute no SQL Editor do Supabase
-- =====================================================

-- 1. VERIFICAR SITUAÇÃO ATUAL
SELECT 
    'ANTES DA CORREÇÃO' as momento,
    c.code,
    c.client,
    c.user_id,
    u.name as dono_atual
FROM clients c
LEFT JOIN custom_users u ON c.user_id = u.id
WHERE c.client ILIKE '%TONIOLO%';

-- 2. OBTER ID DO JOELSON
SELECT 
    'ID DO JOELSON:' as info,
    id, 
    name 
FROM custom_users 
WHERE name = 'Joelson';

-- 3. ATRIBUIR CLIENTE TONIOLO AO JOELSON
UPDATE clients 
SET user_id = (
    SELECT id 
    FROM custom_users 
    WHERE name = 'Joelson' 
    LIMIT 1
)
WHERE client ILIKE '%TONIOLO%';

-- 4. VERIFICAR RESULTADO
SELECT 
    'APÓS CORREÇÃO' as momento,
    c.code,
    c.client,
    c.user_id,
    u.name as novo_dono
FROM clients c
LEFT JOIN custom_users u ON c.user_id = u.id
WHERE c.client ILIKE '%TONIOLO%';

-- 5. TESTAR BUSCA COM RLS (simular login do Joelson)
SELECT set_request_user((SELECT id FROM custom_users WHERE name = 'Joelson' LIMIT 1));
SELECT 'TESTE COM RLS:' as info, * FROM clients WHERE client ILIKE '%TONIOLO%';