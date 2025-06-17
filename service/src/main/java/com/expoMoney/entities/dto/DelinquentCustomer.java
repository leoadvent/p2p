package com.expoMoney.entities.dto;

import com.expoMoney.entities.FinancialLoansPaid;
import com.expoMoney.security.utils.StringUtils;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class DelinquentCustomer {

    private UUID idClient;
    private String firstName;
    private String lastName;
    private String contact;
    private String urlPhoto;
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dueDate;
    private Double value;
    private Double valueAmountPaid;
    private FinancialLoansPaid loansPaid;

    public long getDaysOverdue() {
        return ChronoUnit.DAYS.between(dueDate, LocalDate.now());
    }

    public String getValueFinancialFormat(){
        return StringUtils.formatCurrency(this.value);
    }

    public String getValueAmountPaidFormat(){
        return StringUtils.formatCurrency(this.valueAmountPaid);
    }

    public String getModalityFinancingDescription(){
        String t = this.loansPaid.getFinancialLoans().getModalityFinancing().getDescription();
        return this.loansPaid.getFinancialLoans().getModalityFinancing().getDescription();
    }
}
