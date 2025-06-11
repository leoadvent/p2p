package com.expoMoney.security;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfig {

    @Value("${keycloak.client.server.url}")
    private String keycloakServerUrl;


    private static final String[] PUBLIC_MATCHERS_POST = {
            "/keycloak",
            "/keycloak/login",
            "/keycloak/refreshToken",
            "/userRealm/recoveryRealm"
    };

    private static final String[] PUBLIC_MATCHERS_GET = {
            "/actuator/info",
            "/v3/api-docs/**",
            "/swagger-ui.html",
            "/swagger-ui/**",
            "/keycloak/identityProviderLoginLinks/*",
            "/keycloak/code/sso**",
            "/endereco/viacep/*",
            "/customer/photo/**",
            "/minio/**"
    };

    public static final String [] PUBLIC_MATCHERS_PUT = {};

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth->{
                    auth.requestMatchers(HttpMethod.POST, PUBLIC_MATCHERS_POST).permitAll();
                    auth.requestMatchers(HttpMethod.GET, PUBLIC_MATCHERS_GET).permitAll();
                    auth.requestMatchers(HttpMethod.PUT, PUBLIC_MATCHERS_PUT).permitAll();
                    auth.anyRequest().authenticated();
                })
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.decoder(jwtDecoderForMultiTenant())));
        return http.build();
    }

    /**
     * Configuração do JwtDecoder para multi-tenancy.
     * O tenant é extraído do cabeçalho "X-Tenant-ID".
     */
    @Bean
    public JwtDecoder jwtDecoderForMultiTenant() {
        return token -> {
            String tenant = extractTenantFromRequest(); // Extrai o tenant
            String jwkSetUri = keycloakServerUrl + "/realms/" + tenant + "/protocol/openid-connect/certs";
            log.debug("Using JWK URI: {}", jwkSetUri);
            try {
                return NimbusJwtDecoder.withJwkSetUri(jwkSetUri).build().decode(token);
            } catch (Exception e) {
                log.error("Error decoding JWT: {}", e.getMessage());
                throw e;
            }
        };
    }

    /**
     * Extrai o tenant do cabeçalho "X-Tenant-ID" da requisição.
     * Você pode adaptar essa lógica para usar subdomínios ou outros métodos.
     */
    public String extractTenantFromRequest() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String tenant = request.getHeader("X-Tenant-ID");
        if (tenant == null || tenant.isEmpty()) {
            throw new IllegalArgumentException("Tenant ID is missing in the request headers.");
        }
        log.info("Extracted Tenant: {}", tenant);
        return tenant;
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverterForKeyCloak(){
        Converter<Jwt, Collection<GrantedAuthority>> jwtGrantedAuthoritiesConverter = jwt ->{
            Map<String, Object> resourcesAccess = jwt.getClaim("realm_access");
            if (resourcesAccess != null) {
                Object rolesObject = resourcesAccess.get("roles");
                if (rolesObject instanceof Collection) {
                    Collection<String> roles = (Collection<String>) rolesObject;
                    return roles.stream()
                            .map(SimpleGrantedAuthority::new)
                            .collect(Collectors.toList());
                }
            }
            return Collections.emptyList();
        };
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }

    @Bean
    CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        //String tenant = extractTenantFromRequest();
        List<String> allowedOrigins = Arrays.asList("http://localhost:3001", "http://localhost:5173", "*"); // Busca do DB ou Keycloak
        config.setAllowedOrigins(allowedOrigins);
        config.setAllowedMethods(Arrays.asList("HEAD", "GET", "POST", "PUT", "DELETE", "OPTIONS","PATCH"));
        config.setAllowedHeaders(Arrays.asList("authorization", "content-type", "X-Auth-Token","x-auth-token", "x-requested-with","X-XSRF-TOKEN"));
        config.setAllowCredentials(false);
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

}
