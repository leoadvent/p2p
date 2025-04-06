package com.expoMoney.tenancy.multitenancy;

import jakarta.servlet.Filter;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

//import javax.servlet.Filter;

//@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Bean
    public Filter tenantInterceptor() {
        return new TenantInterceptor();
    }
}
