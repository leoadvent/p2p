package com.expoMoney.tenancy.multitenancy;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class MultitenantConfiguration {

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.username}")
    private String dbUsername;

    @Value("${spring.datasource.password}")
    private String dbPassword;

    @Value("${spring.datasource.driver-class-name}")
    private String dbDriverName;

    @Value("${defaultTenant}")
    private String defaultTenant;

    @Bean
    public DataSource dataSource() {
        Map<Object, Object> resolvedDataSources = new HashMap<>();

        // Configuração padrão
        DataSourceBuilder<?> defaultDataSourceBuilder = DataSourceBuilder.create();
        defaultDataSourceBuilder.url(dbUrl);
        defaultDataSourceBuilder.username(dbUsername);
        defaultDataSourceBuilder.password(dbPassword);
        defaultDataSourceBuilder.driverClassName(dbDriverName);

        resolvedDataSources.put(defaultTenant, defaultDataSourceBuilder.build());

        // DataSource dinâmico
        AbstractRoutingDataSource dataSource = new MultitenantDataSource();
        dataSource.setDefaultTargetDataSource(resolvedDataSources.get(defaultTenant));
        dataSource.setTargetDataSources(resolvedDataSources);
        dataSource.afterPropertiesSet();

        return dataSource;
    }
}
