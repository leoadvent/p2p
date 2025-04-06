package com.expoMoney.entities.dto;

import com.expoMoney.entities.Endereco;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class CustomerDTO {

    private UUID id;
    @NotEmpty(message = "Campo Obrigatório")
    private String firsName;
    @NotEmpty(message = "Campo Obrigatório")
    private String lastName;
    @NotEmpty(message = "Campo Obrigatório")
    private String contact;

    private Endereco endereco;
}
