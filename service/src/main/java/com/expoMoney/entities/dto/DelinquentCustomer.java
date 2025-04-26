package com.expoMoney.entities.dto;

import com.expoMoney.entities.FinancialLoansPaid;
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
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dueDate;
    private FinancialLoansPaid loansPaid;

    public long getDaysOverdue() {
        return ChronoUnit.DAYS.between(dueDate, LocalDate.now());
    }
}
