Aqui está o resultado do script executado abaixo.

SELECT 
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'set_request_user';

| routine_name     | routine_type | routine_definition                                                                     |
| ---------------- | ------------ | -------------------------------------------------------------------------------------- |
| set_request_user | FUNCTION     | 
  BEGIN
    PERFORM set_config('request.user.id', user_id::text, true);
  END;
   |
-----------------------------------------------------

SELECT set_request_user('9e96e010-d99e-44f2-8e27-ddedc6222a74'::uuid);

| set_request_user |
| ---------------- |
|                  |

----------------------------------------------

SELECT current_setting('request.user.id', true) as user_id_apos_set;

| user_id_apos_set |
| ---------------- |
| null             |

-----------------------------------------

SELECT 
    'TESTE APÓS SET_REQUEST_USER' as momento,
    code,
    client,
    user_id
FROM clients 
WHERE client ILIKE '%TONIOLO%';

| momento                     | code | client               | user_id                              |
| --------------------------- | ---- | -------------------- | ------------------------------------ |
| TESTE APÓS SET_REQUEST_USER | 754  | TONIOLO BUSNELLO S.A | 9e96e010-d99e-44f2-8e27-ddedc6222a74 |

------------------------------------------

SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'get_current_user_id';

| routine_name        | routine_type |
| ------------------- | ------------ |
| get_current_user_id | FUNCTION     |

--------------------------------------------

SELECT get_current_user_id() as current_user_from_function;

| current_user_from_function |
| -------------------------- |
| null                       |

-------------------------------------------

SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'is_admin_user';

| routine_name  | routine_type |
| ------------- | ------------ |
| is_admin_user | FUNCTION     |

--------------------------------------

SELECT is_admin_user() as is_current_user_admin;

| is_current_user_admin |
| --------------------- |
| false                 |

----------------------

A RLS está ativada... abaixo segue o resultado que aparece no console do navegador.

Setting user in RLS session: 9e96e010-d99e-44f2-8e27-ddedc6222a74
C:\Projects\stock-santospenedo\src\modules\clients\infrastructure\repositories\supabase-client.repository.ts:36 RLS user set successfully: null