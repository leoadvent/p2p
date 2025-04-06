package com.expoMoney.tenancy.multitenancy;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

public class MultitenantDataSource extends AbstractRoutingDataSource {
    @Override
    protected Object determineCurrentLookupKey() {
        Object o = TenantContext.getCurrentTenant();
        return TenantContext.getCurrentTenant();
    }
}
