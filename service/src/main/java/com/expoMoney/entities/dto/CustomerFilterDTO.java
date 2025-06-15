package com.expoMoney.entities.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class CustomerFilterDTO {

    private UUID id;
    private String firsName;
    private String lastName;
    private String contact;
    private String photo;
    private String urlPhoto;
    private Integer amountFinancialLoans;
    private Integer amountFinancialLoansOpen;
    private Integer amountFinancialLoansPending;
    private Integer amountFinancialLoansExecutedPledge;
}
