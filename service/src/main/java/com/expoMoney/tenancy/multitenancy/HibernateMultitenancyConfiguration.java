package com.expoMoney.tenancy.multitenancy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class HibernateMultitenancyConfiguration {

    @Autowired
    private CurrentTenantIdentifierResolverImpl tenantIdentifierResolver;

    @Autowired
    private SchemaMultiTenantConnectionProvider multiTenantConnectionProvider;

    @Autowired
    private DataSource dataSource;

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
        Map<String, Object> properties = new HashMap<>();

        // Usando strings diretamente para configurar o multi-tenancy
        properties.put("hibernate.multiTenancy", "SCHEMA"); // Use a string diretamente
        properties.put("hibernate.multi_tenant_connection_provider", multiTenantConnectionProvider);
        properties.put("hibernate.tenant_identifier_resolver", tenantIdentifierResolver);

        // Configuração do Hibernate
        properties.put("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");
        properties.put("hibernate.show_sql", true);
        properties.put("hibernate.format_sql", true);
        properties.put("hibernate.hbm2ddl.auto", "none"); // Evitar mudanças automáticas no esquema

        // Criação do EntityManagerFactory
        LocalContainerEntityManagerFactoryBean factoryBean = new LocalContainerEntityManagerFactoryBean();
        factoryBean.setDataSource(dataSource);
        factoryBean.setJpaVendorAdapter(new HibernateJpaVendorAdapter());
        factoryBean.setPackagesToScan("{packageScanEntities}"); // Ajuste para seu pacote de entidades
        factoryBean.setJpaPropertyMap(properties);

        return factoryBean;
    }
}



