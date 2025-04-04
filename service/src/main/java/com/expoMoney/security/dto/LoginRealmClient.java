package com.expoMoney.security.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRealmClient {

    @NotEmpty(message = "Campo Obrigatório")
    private String realm;
    @NotEmpty(message = "Campo Obrigatório")
    private String username;
    @NotEmpty(message = "Campo Obrigatório")
    private String password;
}
