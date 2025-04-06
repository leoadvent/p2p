package com.expoMoney.tenancy.multitenancy;

import lombok.extern.slf4j.Slf4j;
import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class CurrentTenantIdentifierResolverImpl implements CurrentTenantIdentifierResolver {

    @Override
    public String resolveCurrentTenantIdentifier() {
        String tenantId = TenantContext.getCurrentTenant();
        log.info("Resolvendo Tenant : {}", tenantId);
        log.info("Resolvendo Tenant no Hibernate: {}", tenantId);
        return tenantId != null ? tenantId : "public"; // Retorna 'public' como padrão
    }

    @Override
    public boolean validateExistingCurrentSessions() {
        return true;
    }
}

