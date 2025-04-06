package com.expoMoney.tenancy;

import com.expoMoney.tenancy.liquibase.LiquibaseDynamicSchemas;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

@Slf4j
@Service
@RequiredArgsConstructor
public class SchemaCreator {

    // Configurações do banco de dados
    @Value("${spring.datasource.url}")
    private String dbUrl;
    @Value("${spring.datasource.username}")
    private String dbUser;
    @Value("${spring.datasource.password}")
    private String dbPassword;

    private final LiquibaseDynamicSchemas liquibaseDynamicSchemas;

    public void createSchema(String schemaName) {

        String sql = "CREATE SCHEMA IF NOT EXISTS " + schemaName;

        String createChangeLogTableSQL = "CREATE TABLE IF NOT EXISTS " + schemaName + ".databasechangelog (" +
                "id varchar(255) NOT NULL," +
                "author varchar(255) NOT NULL," +
                "filename varchar(255) NOT NULL," +
                "dateexecuted timestamp NOT NULL," +
                "orderexecuted int4 NOT NULL," +
                "exectype varchar(10) NOT NULL," +
                "md5sum varchar(35) NULL," +
                "description varchar(255) NULL," +
                "comments varchar(255) NULL," +
                "tag varchar(255) NULL," +
                "liquibase varchar(20) NULL," +
                "contexts varchar(255) NULL," +
                "labels varchar(255) NULL," +
                "deployment_id varchar(10) NULL" +
                ");";

        String createChangeLogLockTableSQL = "CREATE TABLE IF NOT EXISTS " + schemaName + ".databasechangeloglock (" +
                "id int4 NOT NULL," +
                "locked bool NOT NULL," +
                "lockgranted timestamp NULL," +
                "lockedby varchar(255) NULL," +
                "CONSTRAINT databasechangeloglock_pkey PRIMARY KEY (id)" +
                ");";

        try (Connection connection = DriverManager.getConnection(dbUrl, dbUser, dbPassword);
             Statement statement = connection.createStatement()) {

            log.info("SCHEMA {} CREATE SUCESS", schemaName);
            statement.executeUpdate(sql);

            log.info("CREATING TRACKING TABLE LIQUIBASE");
            statement.executeUpdate(createChangeLogTableSQL);
            statement.executeUpdate(createChangeLogLockTableSQL);

            liquibaseDynamicSchemas.exec();

        } catch (SQLException e) {
            log.error("Erro ao criar o schema: " + e.getMessage());
        }
    }
}
