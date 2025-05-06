package com.expoMoney.tenancy.liquibase;

import com.expoMoney.tenancy.multitenancy.TenantContext;
import liquibase.Contexts;
import liquibase.Liquibase;
import liquibase.database.Database;
import liquibase.database.DatabaseFactory;
import liquibase.exception.LiquibaseException;
import liquibase.integration.spring.SpringLiquibase;
import liquibase.resource.ClassLoaderResourceAccessor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ResourceLoader;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
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

    @Value("${spring.datasource.driver-class-name}")
    private String driverClassName;

    @Autowired
    private ResourceLoader resourceLoader;

    public void exec() {
        log.info("EXECUTE LIQUIBASE");

        try (Connection connection = DriverManager.getConnection(dbUrl, dbUser, dbPassword)) {
            List<String> schemas = new ArrayList<>();

            // Buscar schemas existentes no banco de dados
            log.info("Buscando schemas disponíveis...");
            try (Statement stmt = connection.createStatement();
                 ResultSet rs = stmt.executeQuery(
                         "SELECT schema_name " +
                                 "FROM information_schema.schemata " +
                                 "WHERE schema_name NOT IN ('service', 'keycloak', 'information_schema', 'pg_catalog', 'pg_toast', 'public') ")) {
                while (rs.next()) {
                    schemas.add(rs.getString("schema_name"));
                }
            }

            // Aplicar Liquibase para cada schema encontrado
            for (String schema : schemas) {
                log.info("Aplicando Liquibase no schema: {}", schema);
                TenantContext.setCurrentTenant(schema);
                runLiquibaseForSchema(schema);
            }

        } catch (Exception e) {
            log.error("Erro durante a execução do Liquibase: {}", e.getMessage(), e);
        }
    }

    public void runLiquibaseForSchema(String schema) {

        String context = schema.equals("public") ? "public-only" :"realm-only";
        try {
            SpringLiquibase liquibase = new SpringLiquibase();
            liquibase.setChangeLog(changeLogFile);
            liquibase.setDataSource(buildDataSourceForSchema(schema));
            liquibase.setDefaultSchema(schema);
            liquibase.setContexts(context);
            liquibase.setResourceLoader(resourceLoader);
            liquibase.setShouldRun(true); // importante!
            liquibase.afterPropertiesSet(); // executa Liquibase
            System.out.println("Liquibase executado com sucesso no schema: " + schema);
        } catch (Exception e) {
            System.err.println("Erro ao executar Liquibase no schema: " + schema);
            e.printStackTrace();
        }
    }

    private DataSource buildDataSourceForSchema(String schema) {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName(driverClassName);
        dataSource.setUrl(dbUrl+"?currentSchema=" + schema);
        dataSource.setUsername(dbUser);
        dataSource.setPassword(dbPassword);
        return dataSource;
    }
}
