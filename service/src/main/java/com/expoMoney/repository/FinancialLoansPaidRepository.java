package com.expoMoney.repository;

import com.expoMoney.entities.FinancialLoansPaid;
import com.expoMoney.entities.dto.CustomerDueToday;
import com.expoMoney.entities.dto.DelinquentCustomer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface FinancialLoansPaidRepository extends JpaRepository<FinancialLoansPaid, UUID> {

    @Query("""
            SELECT
                fp
           FROM
                FinancialLoansPaid fp
           WHERE
                fp.dueDate < CURRENT_DATE
                AND fp.amountPaid < fp.installmentValue
           """)
    List<FinancialLoansPaid> findByOverdueInstallments();

    @Query("""
            SELECT
             new com.expoMoney.entities.dto.CustomerDueToday(
                ct.id,
                ct.firsName,
                ct.lastName,
                lp
             )
            FROM
                FinancialLoansPaid lp
                JOIN lp.financialLoans fl
                JOIN fl.customer ct
            WHERE
                lp.dueDate <= :date
                AND lp.dueDate >= CURRENT_DATE
                AND lp.amountPaid < lp.currencyValue
            """)
    List<CustomerDueToday> customerDuaToday(LocalDate date);

    @Query("""
            SELECT
                new com.expoMoney.entities.dto.DelinquentCustomer(
                    ct.id,
                    ct.firsName,
                    ct.lastName,
                    ct.contact,
                    lp.dueDate,
                    lp
                )
            FROM
                FinancialLoansPaid lp
                JOIN lp.customer ct
            WHERE
                lp.dueDate < CURRENT_DATE
                AND lp.amountPaid < lp.currencyValue
            ORDER BY
                ct.firsName, lp.dueDate
            """)
    List<DelinquentCustomer> findByDeliquentCustomer();
}
