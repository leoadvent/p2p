package com.expoMoney.tenancy.multitenancy;

import lombok.extern.slf4j.Slf4j;
import org.hibernate.engine.jdbc.connections.spi.MultiTenantConnectionProvider;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@Slf4j
@Component
public class SchemaMultiTenantConnectionProvider implements MultiTenantConnectionProvider {

    private final DataSource dataSource;

    public SchemaMultiTenantConnectionProvider(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Connection getConnection(Object tenantIdentifier) throws SQLException {
        Connection connection = dataSource.getConnection();
        String tenant = (String) tenantIdentifier;
        log.info("Setando o schema para: {}", tenant);
        connection.setSchema(tenant); // Define o esquema dinamicamente
        log.info("Conectando ao tenant: {}", tenant);
        log.info("Setando schema no banco para Tenant: {}", tenant);
        log.info("Valor connection.setSchema: {}", connection.getSchema());
        return connection;
    }

    @Override
    public void releaseConnection(Object tenantIdentifier, Connection connection) throws SQLException {
        log.info("Liberando conexão para Tenant: {}", tenantIdentifier);
        connection.close();
    }


    @Override
    public Connection getAnyConnection() throws SQLException {
        log.info("Obtendo uma conexão genérica");
        return dataSource.getConnection();
    }

    @Override
    public void releaseAnyConnection(Connection connection) throws SQLException {
        log.info("Liberando conexão genérica");
        connection.close();
    }

    @Override
    public boolean supportsAggressiveRelease() {
        return true;
    }

    // Métodos adicionais exigidos pela interface
    @Override
    public boolean isUnwrappableAs(Class unwrapType) {
        return unwrapType.isInstance(this);
    }

    @Override
    public <T> T unwrap(Class<T> unwrapType) {
        if (isUnwrappableAs(unwrapType)) {
            return (T) this;
        }
        throw new IllegalArgumentException("Não é possível desempacotar como: " + unwrapType);
    }

}

