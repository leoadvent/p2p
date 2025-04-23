package com.expoMoney.entities.dto;

import com.expoMoney.entities.FinancialLoansPaid;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class CustomerDueToday {

    private UUID idCustomer;
    private String firstname;
    private String lastName;
    private FinancialLoansPaid paid;
}
