package com.expoMoney.entities.dto;

import com.expoMoney.entities.Endereco;
import com.expoMoney.entities.FinancialLoans;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
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

    private List<FinancialLoans> financialLoans = new ArrayList<>();

    public Integer getAmountFinancialLoans(){
        return this.financialLoans == null ? 0 : this.financialLoans.size();
    }

    public Integer getAmountFinancialLoansOpen() {
        return (int) this.financialLoans.stream()
                .filter(loan -> loan.getLoansPaids().stream()
                        .anyMatch(paid -> paid.getAmountPaid() == null || paid.getAmountPaid() < paid.getInstallmentValue()))
                .count();
    }

    public Integer getAmountFinancialLoansPending(){
        return (int) this.financialLoans.stream()
                .filter(loan -> loan.getLoansPaids().stream()
                        .anyMatch(
                                paid -> (paid.getAmountPaid() == null || paid.getAmountPaid() < paid.getInstallmentValue())
                                && paid.getDueDate().isBefore(LocalDate.now())
                        ))
                .count();
    }
}
