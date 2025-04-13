package com.expoMoney.entities.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRealmFindNameDTO {

    @NotEmpty(message = "Campo Obrigatório")
    private String username;
}
