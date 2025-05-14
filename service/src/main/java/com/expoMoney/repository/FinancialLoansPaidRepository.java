package com.expoMoney.repository;

import com.expoMoney.entities.FinancialLoansPaid;
import com.expoMoney.entities.dto.CustomerDueToday;
import com.expoMoney.entities.dto.DelinquentCustomer;
import com.expoMoney.entities.dto.FundingReceived;
import com.expoMoney.entities.dto.InvestmentsDTO;
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
                ct.contact,
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
                    fl.value,
                    (SELECT SUM(lpSum.amountPaid) FROM FinancialLoansPaid lpSum WHERE lpSum.financialLoans.id = fl.id),
                    lp
                )
            FROM
                FinancialLoansPaid lp
                JOIN lp.financialLoans fl
                JOIN lp.customer ct
            WHERE
                lp.dueDate < CURRENT_DATE
                AND lp.amountPaid < lp.currencyValue
            ORDER BY
                ct.firsName, lp.dueDate
            """)
    List<DelinquentCustomer> findByDeliquentCustomer();

    @Query("""
            SELECT
                new com.expoMoney.entities.dto.InvestmentsDTO(
                    (SELECT SUM(fl.value) FROM FinancialLoans fl),
                    (SELECT SUM(flp.installmentValue) FROM FinancialLoansPaid flp WHERE flp.amountPaid < flp.currencyValue),
                    (SELECT SUM(flp.amountPaid - flp.installmentValue) FROM FinancialLoansPaid flp),
                    (SELECT SUM(flp.currencyValue) FROM  FinancialLoansPaid flp WHERE flp.amountPaid < flp.currencyValue AND flp.dueDate < CURRENT_DATE)
                )
            """)
    InvestmentsDTO findByValuesInvestments();

    @Query("""
            SELECT
                new com.expoMoney.entities.dto.FundingReceived(
                    flp.duePayment,
                    SUM(flp.amountPaid)
                )
            FROM
                FinancialLoansPaid flp
            WHERE
                flp.duePayment >= :date
            GROUP BY
                flp.duePayment
            ORDER BY
                flp.duePayment
            """)
    List<FundingReceived> findFundingReceivedByPeriod(LocalDate date);
}
