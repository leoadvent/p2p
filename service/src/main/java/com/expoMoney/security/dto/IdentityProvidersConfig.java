package com.expoMoney.security.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IdentityProvidersConfig {

    private String apiUrl;
    private String baseUrl;
    private String clientId;
    private String clientSecret;
    private Integer guiOrder;
}
