package com.expoMoney.service;

import com.expoMoney.entities.Customer;
import com.expoMoney.entities.CustomerCommitmentItem;
import com.expoMoney.entities.FinancialLoans;
import com.expoMoney.entities.FinancialLoansPaid;
import com.expoMoney.entities.dto.*;
import com.expoMoney.enums.ModalityFinancing;
import com.expoMoney.mapper.CustomerMapper;
import com.expoMoney.mapper.FinancialLoansMapper;
import com.expoMoney.repository.FinancialLoansPaidRepository;
import com.expoMoney.repository.FinancialLoansRepository;
import com.expoMoney.service.util.CalculateUtil;
import com.expoMoney.service.util.DateUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final CustomerCommitmentItemService commitmentItemService;

    @Transactional
    private FinancialLoans saveLoans(FinancialLoans loans){
        return repository.save(loans);
    }

    @Transactional
    public FinancialLoansPaid saveLoansPaid(FinancialLoansPaid loansPaid){
        loansPaid = loansPaidRepository.save(loansPaid);
        List<FinancialLoansPaid> pending = findLoansPaidByIdLoans(loansPaid.getFinancialLoans().getId()).stream().filter(f -> f.getAmountPaid() < f.getCurrencyValue()).toList();

        if(pending.isEmpty()){
            List<CustomerCommitmentItem> items = loansPaid.getFinancialLoans().getCommitmentItems();
            for(CustomerCommitmentItem x : items){
                x.setCommitted(false);
                x.setWarranty(false);
                commitmentItemService.save(x);
            }
        }
        return loansPaid;
    }

    private FinancialLoansPaid findLoansPaidById(UUID idLoansPaid){
        return loansPaidRepository.findById(idLoansPaid).orElseThrow(() -> new NoSuchElementException("Parcela não localizada"));
    }

    private FinancialLoans findById(UUID uuid){
        return repository.findById(uuid).orElseThrow(() -> new NoSuchElementException("Financiamento não localizado!"));
    }

    public List<FinancialLoansPaid> findLoansPaidByIdLoans(UUID idLoans){
        return loansPaidRepository.findAllByLoans(idLoans);
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
        loans.setDateEndFinancialOnerousLoans(create.getModalityFinancing() == ModalityFinancing.ONEROUS_LOAN ?
                create.getDateEndFinancialOnerousLoans() : null);


        double totalValue = create.getValue();
        double ratePercent = create.getRate();
        int totalInstallments = create.getModalityFinancing() == ModalityFinancing.ONEROUS_LOAN ? 1 : create.getCashInstallment();

        double interest = (totalValue * ratePercent) / 100;
        double totalWithInterest = totalValue + interest;
        double valueInstallment = create.getModalityFinancing() == ModalityFinancing.FINANCING ?
                totalWithInterest / totalInstallments
                : CalculateUtil.calculateValueInstallmentDiary(totalValue, create.getRate());

        for(int i = 0; i < totalInstallments; i++){

            if(create.getModalityFinancing() == ModalityFinancing.ONEROUS_LOAN && i == totalInstallments -1 ){
                valueInstallment = totalWithInterest;
            }

            FinancialLoansPaid paid = new FinancialLoansPaid();
            paid.setPortion(i+1);
            paid.setCustomer(customer);
            paid.setFinancialLoans(loans);
            paid.setRate(create.getRate());
            paid.setDueDate(create.getStartDateDue().plusMonths(loans.getModalityFinancing() == ModalityFinancing.FINANCING ? i : i+1));
            paid.setInstallmentValue(valueInstallment);
            paid.setInterestDelay(create.getLateInterest());
            paid.setAdditionForDaysOfDelay(create.getAdditionForDaysOfDelay());
            paid.setAmountPaid((double) 0);
            paid.setCurrencyValue(valueInstallment);
            paid.setValueDiary(create.getModalityFinancing() == ModalityFinancing.ONEROUS_LOAN ? CalculateUtil.calculateValueInstallmentDiary(totalValue, create.getRate()) : 0);
            paid.setAmountPaidOnerous(create.getModalityFinancing() == ModalityFinancing.ONEROUS_LOAN ? (double) 0 : null);
            loans.getLoansPaids().add(paid);
        }

        if(!create.getSimulator()){ saveLoans(loans); }

        if(loans.getId() != null){
            for (CustomerCommitmentItem x : loans.getCommitmentItems()){
                x.setWarranty(true);
                x.setCustomer(customer);
                commitmentItemService.save(x);
            }
        }

        return mapper.toDto(loans);
    }

    public FinancialLoansPendingByCustumerDTO findLoansPendingByCustomer(UUID idCustumer){

        Customer customer = customerService.findById(idCustumer);
        customer.setFinancialLoans(null);
        List<FinancialLoans> financialLoans = repository.paimentsPending(idCustumer);

       for(FinancialLoans x:
        financialLoans.stream().filter(f-> f.getModalityFinancing() == ModalityFinancing.ONEROUS_LOAN).toList()){
           for(FinancialLoansPaid y: x.getLoansPaids()){
               CalculateUtil.calculateValueTotalDiaryOnerousLoans(y);
           }
       }

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

                saveLoansPaid(loansPaid);
            }
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }

        return true;
    }

    public FinancialLoansPaid loansPaid (FinancialLoansPaid paid){
        FinancialLoansPaid paidAux = findLoansPaidById(paid.getId());

        Double valuePaid = paidAux.getAmountPaid() + paid.getAmountPaid();

        if(paidAux.getFinancialLoans().getModalityFinancing() != ModalityFinancing.ONEROUS_LOAN) {
            valuePaid = valuePaid >= paidAux.getCurrencyValue() ? paidAux.getCurrencyValue() : valuePaid;
        }

        paidAux.setAmountPaid(valuePaid);

        if(paidAux.getFinancialLoans().getModalityFinancing() == ModalityFinancing.ONEROUS_LOAN){
            paidAux.setAmountPaidOnerous(paidAux.getAmountPaidOnerous() + paid.getAmountPaid());
            paidAux.setAmountPaid(paid.getAmountPaid());
            if(Objects.equals(paidAux.getAmountPaid(), (DateUtil.CalculateTheDifferenceInDaysBetweenTwoDates(
                    paidAux.getFinancialLoans().getDateCreateFinancial(),
                    LocalDate.now()
                ) * paidAux.getValueDiary()) - paidAux.getAmountPaidOnerous()
            )){
                paidAux.setDueDate(LocalDate.now().plusMonths(1));
                paidAux.setAmountPaid((double) 0);
            }
            if(Objects.equals(paidAux.getCurrencyValue(), paid.getAmountPaid())){
                paidAux.setDueDate(LocalDate.now());
                paidAux.setAmountPaid(paid.getAmountPaid());
            }
        }

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
        return saveLoansPaid(paidAux);
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

    public List<FinancialLoansPaid> addSingleInstallments(UUID idLoansPaid) {

        FinancialLoansPaid original = loansPaidRepository.findById(idLoansPaid)
                .orElseThrow(() -> new NoSuchElementException("Parcela não localizada"));

        FinancialLoans loan = findById(original.getFinancialLoans().getId());

        if (loan.getModalityFinancing() != ModalityFinancing.ONEROUS_LOAN) {
            throw new IllegalArgumentException("O Financiamento não permite a criação de parcela avulsa");
        }

        // Obter e atualizar a última parcela
        FinancialLoansPaid last = loan.getLoansPaids().get(loan.getLoansPaids().size() - 1);
        last.setDueDate(last.getDueDate().plusMonths(1));
        last.setPortion(last.getPortion() + 1);

        // Criar nova parcela avulsa
        FinancialLoansPaid newInstallment = new FinancialLoansPaid();
        newInstallment.setInstallmentValue(original.getInstallmentValue());
        newInstallment.setCurrencyValue(original.getCurrencyValue());
        newInstallment.setDueDate(last.getDueDate().minusMonths(1));
        newInstallment.setFinancialLoans(loan);
        newInstallment.setRate(original.getRate());
        newInstallment.setInterestDelay(original.getInterestDelay());
        newInstallment.setPortion(last.getPortion()-1); // Agora sim: próximo número da sequência
        newInstallment.setAdditionForDaysOfDelay(original.getAdditionForDaysOfDelay());
        newInstallment.setCustomer(original.getCustomer());
        // outros campos como status, timestamps, etc.

        loan.getLoansPaids().add(newInstallment);

        saveLoans(loan);

        return loan.getLoansPaids();
    }

    @Transactional
    public void executedPledge (UUID idLoans){
        FinancialLoans loans = findById(idLoans);

        List<FinancialLoansPaid> pendents = loans.getLoansPaids().stream().filter(f-> f.getDueDate().isBefore(LocalDate.now()) && f.getAmountPaid() < f.getInstallmentValue()).toList();

        if(pendents.isEmpty()){ throw new IllegalArgumentException("O Financiamento não pode ter a execução da penhora");}

        loans.setExecutedPledge(true);
        saveLoans(loans);

        for(FinancialLoansPaid x : pendents){
            x.setExecutedPledge(true);
            saveLoansPaid(x);
        }

        List<CustomerCommitmentItem> items = loans.getCommitmentItems();

        for(CustomerCommitmentItem x : items){
            x.setCommitted(true);
            commitmentItemService.save(x);
        }
    }

}
