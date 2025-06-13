-- =====================================================
-- SOLUÇÃO: DESABILITAR RLS E USAR FILTROS DO CÓDIGO
-- Execute no SQL Editor do Supabase
-- =====================================================

-- 1. DESABILITAR RLS NA TABELA CLIENTS
ALTER TABLE public.clients DISABLE ROW LEVEL SECURITY;

-- 2. VERIFICAR SE RLS FOI DESABILITADA
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    CASE 
        WHEN rowsecurity THEN '❌ RLS ATIVA'
        ELSE '✅ RLS DESABILITADA'
    END as status
FROM pg_tables 
WHERE tablename = 'clients';

-- 3. REMOVER POLÍTICAS RLS (OPCIONAL - PARA LIMPEZA)
DROP POLICY IF EXISTS "Usuários veem apenas seus próprios clientes" ON public.clients;
DROP POLICY IF EXISTS "Usuários inserem clientes apenas para si" ON public.clients;
DROP POLICY IF EXISTS "Usuários atualizam apenas seus próprios clientes" ON public.clients;
DROP POLICY IF EXISTS "Usuários deletam apenas seus próprios clientes" ON public.clients;

-- 4. TESTAR BUSCA APÓS DESABILITAR RLS
SELECT 
    'TESTE APÓS DESABILITAR RLS' as momento,
    code,
    client,
    user_id
FROM clients 
WHERE client ILIKE '%TONIOLO%';

-- 5. VERIFICAR QUE AGORA MOSTRA TODOS OS CLIENTES (SEM FILTRO RLS)
SELECT 
    'TODOS OS CLIENTES VISÍVEIS' as info,
    COUNT(*) as total_clientes
FROM clients;