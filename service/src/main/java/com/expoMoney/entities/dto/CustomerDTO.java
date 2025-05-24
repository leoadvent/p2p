package com.expoMoney.entities.dto;

import com.expoMoney.entities.Endereco;
import com.expoMoney.entities.FinancialLoans;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

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
    private String photo;

    private MultipartFile photoFile;

    private Endereco endereco;

    private List<FinancialLoans> financialLoans = new ArrayList<>();

    public String getUrlPhoto(){
        return this.photo;
    }

    public Integer getAmountFinancialLoans(){
        return this.financialLoans == null ? 0 : this.financialLoans.size();
    }

    public Integer getAmountFinancialLoansOpen() {
        return (int) this.financialLoans.stream()
                .filter(loan -> loan.getLoansPaids().stream()
                        .anyMatch(paid -> paid.getDuePayment() == null && !paid.getExecutedPledge()))
                .count();
    }

    public Integer getAmountFinancialLoansPending(){
        return (int) this.financialLoans.stream()
                .filter(loan -> loan.getLoansPaids().stream()
                        .anyMatch(
                                paid -> (paid.getAmountPaid() == 0 || paid.getAmountPaid() < paid.getCurrencyValue() || paid.getDueDate() == null)
                                && paid.getDueDate().isBefore(LocalDate.now())
                        ) && !loan.getExecutedPledge())
                .count();
    }

    public Integer getAmountFinancialLoansExecutedPledge(){
        return (int) this.financialLoans.stream().filter(FinancialLoans::getExecutedPledge).toList().size();
    }
}
