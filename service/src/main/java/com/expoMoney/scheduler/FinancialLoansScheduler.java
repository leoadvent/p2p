package com.expoMoney.scheduler;

import com.expoMoney.entities.FinancialLoansPaid;
import com.expoMoney.entities.UserRealm;
import com.expoMoney.repository.UserRealmRepository;
import com.expoMoney.service.FinancialLoansService;
import com.expoMoney.tenancy.multitenancy.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FinancialLoansScheduler {

    private final FinancialLoansService service;
    private final UserRealmRepository userRealmRepository;

    @Scheduled(cron = "0 0 0 * * *")
    public void applyingAlateInstallmentFine(){

        log.info("SCHEDULER APLICANDO MULTA EM PARCELA ATRASADA");

        List<UserRealm> realms = userRealmRepository.findAll();

        for(UserRealm x : realms){
            log.info("APLICANDO SCHEDULER MULTA PARCELA ATRASA NO REALM {}", x.getNameRealm());
            TenantContext.setCurrentTenant(x.getNameRealm());

            List<FinancialLoansPaid> loansPaidsOverDue = service.findByOverdueInstallments();

            for (FinancialLoansPaid loansPaid : loansPaidsOverDue) {

                double valueLoansInterestDelay = ((loansPaid.getInstallmentValue() * loansPaid.getInterestDelay()) / 100) + loansPaid.getInstallmentValue();

                Long differenceDays = ChronoUnit.DAYS.between(loansPaid.getDueDate(), LocalDate.now());

                double currencyValue = valueLoansInterestDelay + (differenceDays * loansPaid.getAdditionForDaysOfDelay());

                loansPaid.setCurrencyValue(currencyValue);

                service.saveLoansPaid(loansPaid);

                log.info("MULTA APLICADA PARCELA {} DIAS ATRASADO: {}, JUROS ATRASO: {}, ADICIONAL DIARIO: {}, VALOR TOTAL: {}",
                        loansPaid.getId(),
                        differenceDays, loansPaid.getInterestDelay(),
                        loansPaid.getInterestDelay(),currencyValue );
            }

            TenantContext.clear();
        }




    }
}
