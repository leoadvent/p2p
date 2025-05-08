package com.expoMoney.service;

import com.expoMoney.entities.Customer;
import com.expoMoney.entities.FinancialLoans;
import com.expoMoney.entities.FinancialLoansPaid;
import com.expoMoney.entities.dto.*;
import com.expoMoney.enums.ModalityFinancing;
import com.expoMoney.mapper.CustomerMapper;
import com.expoMoney.mapper.FinancialLoansMapper;
import com.expoMoney.repository.FinancialLoansPaidRepository;
import com.expoMoney.repository.FinancialLoansRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FinancialLoansService {

    private final FinancialLoansMapper mapper;
    private final CustomerMapper customerMapper;
    private final CustomerService customerService;
    private final FinancialLoansRepository repository;
    private final FinancialLoansPaidRepository loansPaidRepository;

    private FinancialLoans saveLoans(FinancialLoans loans){
        return repository.save(loans);
    }

    public FinancialLoansPaid saveLoansPaid(FinancialLoansPaid loansPaid){
        return loansPaidRepository.save(loansPaid);
    }

    private FinancialLoansPaid findLoansPaidById(UUID idLoansPaid){
        return loansPaidRepository.findById(idLoansPaid).orElseThrow(() -> new NoSuchElementException("Parcela não localizada"));
    }

    private FinancialLoans findById(UUID uuid){
        return repository.findById(uuid).orElseThrow(() -> new NoSuchElementException("Financiamento não localizado!"));
    }

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
        double valueInstallment = create.getModalityFinancing() == ModalityFinancing.FINANCING ?
                totalWithInterest / totalInstallments
                : create.getOnerousLoanValue();

        for(int i = 0; i < create.getCashInstallment(); i++){

            if(create.getModalityFinancing() == ModalityFinancing.ONEROUS_LOAN && i == create.getCashInstallment() -1 ){
                valueInstallment = totalWithInterest + valueInstallment;
            }

            FinancialLoansPaid paid = new FinancialLoansPaid();
            paid.setPortion(i+1);
            paid.setCustomer(customer);
            paid.setFinancialLoans(loans);
            paid.setRate(create.getRate());
            paid.setDueDate(create.getStartDateDue().plusMonths(i));
            paid.setInstallmentValue(valueInstallment);
            paid.setInterestDelay(create.getLateInterest());
            paid.setAdditionForDaysOfDelay(create.getAdditionForDaysOfDelay());
            paid.setAmountPaid((double) 0);
            paid.setCurrencyValue(valueInstallment);
            loans.getLoansPaids().add(paid);
        }

        if(!create.getSimulator()){ saveLoans(loans); }

        return mapper.toDto(loans);
    }

    public FinancialLoansPendingByCustumerDTO findLoansPendingByCustomer(UUID idCustumer){

        Customer customer = customerService.findById(idCustumer);
        customer.setFinancialLoans(null);
        List<FinancialLoans> financialLoans = repository.paimentsPending(idCustumer);

        FinancialLoansPendingByCustumerDTO dto = new FinancialLoansPendingByCustumerDTO();
        dto.setCustomer(customerMapper.toDto(customer));
        dto.setLoansPendingDTOS(financialLoans.stream().map(mapper::toDto).toList());

        return dto;
    }

    public List<FinancialLoansPaid> findByOverdueInstallments(){
        return loansPaidRepository.findByOverdueInstallments();
    }

    public Boolean applyingAlateInstallmentFine(String realmName){
        List<FinancialLoansPaid> loansPaidsOverDue = findByOverdueInstallments();
        try {
            for (FinancialLoansPaid loansPaid : loansPaidsOverDue) {

                double valueLoansInterestDelay = ((loansPaid.getInstallmentValue() * loansPaid.getInterestDelay()) / 100) + loansPaid.getInstallmentValue();

                Long differenceDays = ChronoUnit.DAYS.between(loansPaid.getDueDate(), LocalDate.now());

                double currencyValue = valueLoansInterestDelay + (differenceDays * loansPaid.getAdditionForDaysOfDelay());

                loansPaid.setCurrencyValue(currencyValue);

                loansPaidRepository.save(loansPaid);
            }
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }

        return true;
    }

    public FinancialLoansPaid loansPaid (FinancialLoansPaid paid){
        FinancialLoansPaid paidAux = findLoansPaidById(paid.getId());

        Double valuePaid = paidAux.getAmountPaid() + paid.getAmountPaid();

        valuePaid = valuePaid >= paidAux.getCurrencyValue() ? paidAux.getCurrencyValue() : valuePaid;

        paidAux.setAmountPaid(valuePaid);
        paidAux.setDuePayment(Objects.equals(paidAux.getAmountPaid(), paidAux.getCurrencyValue()) ? LocalDate.now() : null);

        return saveLoansPaid(paidAux);
    }

    public FinancialLoansPaid loansPaidRenegotiation (FinancialLoansPaid paid){
        FinancialLoansPaid paidAux = findLoansPaidById(paid.getId());

        if(paid.getRenegotiation() == null || !paid.getRenegotiation()) {
            throw new IllegalArgumentException("A parcela tem que ser do tipo renegociação");
        }
        paidAux.setRenegotiation(true);
        paidAux.setRenegotiationDate(LocalDate.now());
        paidAux.setAmountPaid(paid.getAmountPaid() + paid.getAmountPaid());
        paidAux.setCurrencyValue(paid.getAmountPaid());
        return loansPaidRepository.save(paidAux);
    }

    public List<CustomerDueToday> customerDueToday(Integer days){
        LocalDate date =  LocalDate.now().plusDays(days);

        return loansPaidRepository.customerDuaToday(date);
    }

    public List<DelinquentCustomer> delinquentCustomers () {
        return loansPaidRepository.findByDeliquentCustomer();
    }

    public InvestmentsDTO findInvestments(){
        return loansPaidRepository.findByValuesInvestments();
    }

    public List<FundingReceived> findByFundingReceivedByPeriod(Integer quantDays){
        LocalDate date = LocalDate.now().minusDays(quantDays);
        return loansPaidRepository.findFundingReceivedByPeriod(date);
    }

    public void addSingleInstallments(UUID idFinancialLoas) {
        FinancialLoans loans = findById(idFinancialLoas);

        if (loans.getModalityFinancing() != ModalityFinancing.ONEROUS_LOAN) {
            throw new IllegalArgumentException("O Financiamento não permite a criação de parcela avulsa");
        }

        FinancialLoansPaid paid1 = loans.getLoansPaids().stream().findFirst().get();

        loans.getLoansPaids().get(loans.getLoansPaids().size()).setDuePayment(null);
        loans.getLoansPaids().get(loans.getLoansPaids().size()).setInstallmentValue(paid1.getInstallmentValue());
        loans.getLoansPaids().get(loans.getLoansPaids().size()).setAmountPaid(Double.parseDouble("0"));
        loans.getLoansPaids().get(loans.getLoansPaids().size()).setCurrencyValue(paid1.getCurrencyValue());

        paid1.setId(null);
        paid1.setPortion(paid1.getPortion() + 1);

        loans.getLoansPaids().add(paid1);

        saveLoans(loans);

    }
}
