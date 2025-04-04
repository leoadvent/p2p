package com.expoMoney.tenancy.liquibase;

import liquibase.Contexts;
import liquibase.Liquibase;
import liquibase.database.Database;
import liquibase.database.DatabaseFactory;
import liquibase.exception.LiquibaseException;
import liquibase.resource.ClassLoaderResourceAccessor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class LiquibaseDynamicSchemas {

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.username}")
    private String dbUser;

    @Value("${spring.datasource.password}")
    private String dbPassword;

    @Value("${spring.liquibase.change-log}")
    private String changeLogFile;

    private void applyLiquibase(Connection connection, String schemaName, List<String> scriptFiles) {
        log.info("EXECUTANDO LIQUIBASE NO SCHEMA {}", schemaName);
        try {
            // Configurar o Liquibase para usar o schema especificado
            Database database = DatabaseFactory.getInstance()
                    .findCorrectDatabaseImplementation(new liquibase.database.jvm.JdbcConnection(connection));
            database.setDefaultSchemaName(schemaName);

            ClassLoaderResourceAccessor resourceAccessor = new ClassLoaderResourceAccessor();

            for (String changelog : scriptFiles) {
                log.info("Executando changelog: {}", changelog);
                Liquibase liquibase = new Liquibase(changelog, resourceAccessor, database);
                liquibase.update(new Contexts());
            }

        } catch (LiquibaseException  e) {
            log.error("Erro ao aplicar Liquibase no schema {}: {}", schemaName, e.getMessage(), e);
        }
    }

    public void exec() {
        log.info("EXECUTE LIQUIBASE");

        try (Connection connection = DriverManager.getConnection(dbUrl, dbUser, dbPassword)) {
            List<String> schemas = new ArrayList<>();
            List<String> scriptFiles = new ArrayList<>();

            // Buscar schemas existentes no banco de dados
            log.info("Buscando schemas disponíveis...");
            try (Statement stmt = connection.createStatement();
                 ResultSet rs = stmt.executeQuery(
                         "SELECT schema_name FROM information_schema.schemata " +
                                 "WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')")) {
                while (rs.next()) {
                    schemas.add(rs.getString("schema_name"));
                }
            }

            // Buscar scripts do Liquibase
            log.info("Localizando scripts Liquibase...");
            try (Statement stmt = connection.createStatement();
                 ResultSet scripts = stmt.executeQuery("SELECT DISTINCT(filename), dateexecuted  FROM public.databasechangelog order by dateexecuted asc")) {
                while (scripts.next()) {
                    scriptFiles.add(scripts.getString("filename"));
                }
            }

            // Aplicar Liquibase para cada schema encontrado
            for (String schema : schemas) {
                log.info("Aplicando Liquibase no schema: {}", schema);
                applyLiquibase(connection, schema, scriptFiles);
            }

        } catch (Exception e) {
            log.error("Erro durante a execução do Liquibase: {}", e.getMessage(), e);
        }
    }
}
