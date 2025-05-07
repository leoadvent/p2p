package com.expoMoney.entities.dto;

import com.expoMoney.enums.ModalityFinancing;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class FinancialLoansCreateDTO {

    @NotNull(message = "Campo Obrigatório")
    private Double value;
    @NotNull(message = "Campo Obrigatório")
    private Float rate;
    @NotNull(message = "Campo Obrigatório")
    private Float lateInterest;
    @NotNull(message = "Campo Obrigatório")
    private LocalDate startDateDue;
    @NotNull(message = "Campo Obrigatório")
    private Integer cashInstallment;
    @NotNull(message = "Campo Obrigatório")
    private UUID customerId;
    @NotNull(message = "Campo Obrigatório")
    private Boolean simulator;
    @NotNull(message = "Campo Obrigatório")
    private Double additionForDaysOfDelay;
    @NotNull(message = "Campo Obrigatório")
    private ModalityFinancing modalityFinancing;
    private Double onerousLoanValue;
}
