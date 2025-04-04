package com.expoMoney.security.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IdentityProviders {

    private String alias;
    private String providerId;
    private IdentityProvidersConfig config;

}
