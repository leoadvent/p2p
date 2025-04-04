package com.expoMoney.security.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RefreshTokenLogin {

    @NotEmpty(message = "Campo Obrigatório")
    private String refreshToken;
}
