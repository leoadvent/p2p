package com.expoMoney.tenancy.multitenancy;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class TenantContext {

    private static final ThreadLocal<String> CURRENT_TENANT = new ThreadLocal<>();

    public static void setCurrentTenant(String tenant) {
        log.info("TENANT SETANDO: {}", tenant);
        CURRENT_TENANT.set(tenant);
    }

    public static String getCurrentTenant() {
        log.info("TENANT SETADO: {}", CURRENT_TENANT.get());
        return CURRENT_TENANT.get() == null ? "public" : CURRENT_TENANT.get().toLowerCase();
    }

    public static void clear() {
        CURRENT_TENANT.remove();
    }
}
