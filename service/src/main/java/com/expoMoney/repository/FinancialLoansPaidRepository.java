package com.expoMoney.repository;

import com.expoMoney.entities.FinancialLoansPaid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

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
}
