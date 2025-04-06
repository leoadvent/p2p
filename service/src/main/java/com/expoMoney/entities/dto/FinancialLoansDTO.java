package com.expoMoney.entities.dto;

import com.expoMoney.entities.Customer;
import com.expoMoney.entities.FinancialLoansPaid;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class FinancialLoansDTO {

    private UUID id;
    @NotNull(message = "Campo Obrigatório")
    private Double value;
    @NotNull(message = "Campo Obrigatório")
    private Float rate;
    @NotNull(message = "Campo Obrigatório")
    private Float lateInterest;
    @NotNull(message = "Campo Obrigatório")
    private Integer dueDay;
    @NotNull(message = "Campo Obrigatório")
    private Integer startMonth;
    @NotNull(message = "Campo Obrigatório")
    private Integer startYear;
    @NotNull(message = "Campo Obrigatório")
    private Double additionForDaysOfDelay;

    @NotNull(message = "Campo Obrigatório")
    private List<FinancialLoansPaid> loansPaids = new ArrayList<>();

    @NotNull(message = "Campo Obrigatório")
    private Customer customer;
}
