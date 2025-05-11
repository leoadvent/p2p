package com.expoMoney.entities.dto;

import com.expoMoney.entities.Customer;
import com.expoMoney.security.utils.StringUtils;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class CustomerCommitmentItemDTO {

    private UUID id;
    @NotEmpty(message = "Campo Obrigatório")
    private String nameItem;
    @NotEmpty(message = "Campo Obrigatório")
    private String descriptionItem;
    @NotNull(message = "Campo Obrigatório")
    private Double valueItem;
    private Boolean warranty;
    private Boolean committed;

    @JsonIgnore
    private Customer customer;

    public String getValueItemFormated(){
        return StringUtils.formatCurrency(this.valueItem);
    }
}
