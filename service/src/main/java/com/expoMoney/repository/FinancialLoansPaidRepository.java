package com.expoMoney.repository;

import com.expoMoney.entities.FinancialLoansPaid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface FinancialLoansPaidRepository extends JpaRepository<FinancialLoansPaid, UUID> {
}
