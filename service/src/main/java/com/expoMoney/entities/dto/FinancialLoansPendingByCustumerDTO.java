package com.expoMoney.entities.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class FinancialLoansPendingByCustumerDTO {

    private CustomerDTO customer;
    private List<FinancialLoansDTO> loansPendingDTOS = new ArrayList<>();
}
