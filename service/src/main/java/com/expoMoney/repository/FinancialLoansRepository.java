package com.expoMoney.repository;

import com.expoMoney.entities.FinancialLoans;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FinancialLoansRepository extends JpaRepository<FinancialLoans, UUID> {

    @Query("""
            SELECT
                DISTINCT fl
            FROM
               FinancialLoans fl
               JOIN fl.loansPaids flp
            WHERE
                (flp.amountPaid IS NULL OR flp.amountPaid < flp.installmentValue)
                AND fl.customer.id = :idCustomer
                AND fl.executedPledge = false
                AND fl.settled = false
            """)
    List<FinancialLoans> paimentsPending(UUID idCustomer);

    @Query("""
            SELECT
                fl
            FROM
               FinancialLoans fl
               JOIN fl.loansPaids flp
               JOIN fl.customer cu
            WHERE
                fl.customer.id = :idCustomer
                AND fl.executedPledge = true
            """)
    List<FinancialLoans> findExecutedPledgeByCustomer(UUID idCustomer);
}
