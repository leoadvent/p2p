package com.expoMoney.security.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.keycloak.representations.idm.UserRepresentation;

@Getter
@Setter
public class NewRealmDTO {

    @NotEmpty(message = "Campo Obrigatório")
    private String realmName;
    @NotEmpty(message = "Campo Obrigatório")
    private String clientId;
    @NotEmpty(message = "Campo Obrigatório")
    private String description;
    @NotNull(message = "Campo Obrigatório")
    private UserRepresentation user;
    @NotEmpty(message = "Campo Obrigatório")
    private String password;
}
