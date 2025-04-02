-- CRIANDO SCHEMA PARA O BANCO EXPO MONEY
DO $$
BEGIN
    IF NOT EXISTS(
        SELECT schema_name
        FROM information_schema.schemata
        WHERE schema_name = 'KEYCLOAK'
    ) THEN
        EXECUTE 'CREATE SCHEMA KEYCLOAK';
    END IF;

    IF NOT EXISTS(
        SELECT schema_name
        FROM information_schema.schemata
        WHERE schema_name = 'SERVICE'
    ) THEN
        EXECUTE 'CREATE SCHEMA SERVICE';
    END IF;
END
$$;

-- 🔥 IMPORTANTE: Definir o schema padrão para o usuário do Keycloak
ALTER ROLE userexpormoney SET search_path TO KEYCLOAK;
