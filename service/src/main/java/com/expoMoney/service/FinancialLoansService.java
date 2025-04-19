package com.expoMoney.service;

import com.expoMoney.entities.Customer;
import com.expoMoney.entities.FinancialLoans;
import com.expoMoney.entities.FinancialLoansPaid;
import com.expoMoney.entities.dto.FinancialLoansCreateDTO;
import com.expoMoney.entities.dto.FinancialLoansDTO;
import com.expoMoney.mapper.FinancialLoansMapper;
import com.expoMoney.repository.FinancialLoansRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class FinancialLoansService {

    private final FinancialLoansMapper mapper;
    private final CustomerService customerService;
    private final FinancialLoansRepository repository;


    public FinancialLoansDTO create (FinancialLoansCreateDTO create){

        Customer customer = customerService.findById(create.getCustomerId());

        FinancialLoans loans = mapper.fromCreate(create);
        loans.setCustomer(customer);
        loans.setDueDay(create.getStartDateDue().getDayOfMonth());
        loans.setStartMonth(create.getStartDateDue().getMonthValue());
        loans.setStartYear(create.getStartDateDue().getYear());
        loans.setAdditionForDaysOfDelay(create.getAdditionForDaysOfDelay());
        loans.setRate(create.getRate());

        double totalValue = create.getValue();
        double ratePercent = create.getRate();
        int totalInstallments = create.getCashInstallment();

        double interest = (totalValue * ratePercent) / 100;
        double totalWithInterest = totalValue + interest;
        double valueInstallment = totalWithInterest / totalInstallments;

        for(int i = 0; i < create.getCashInstallment(); i++){
            FinancialLoansPaid paid = new FinancialLoansPaid();
            paid.setPortion(i+1);
            paid.setCustomer(customer);
            paid.setFinancialLoans(loans);
            paid.setRate(create.getRate());
            paid.setDueDate(create.getStartDateDue().plusMonths(i));
            paid.setInstallmentValue(valueInstallment);
            paid.setInterestDelay(create.getLateInterest());
            paid.setAdditionForDaysOfDelay(create.getAdditionForDaysOfDelay());
            loans.getLoansPaids().add(paid);
        }

        if(!create.getSimulator()){ repository.save(loans); }

        return mapper.toDto(loans);
    }
}
