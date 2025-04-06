package com.expoMoney.repository;

import com.expoMoney.entities.FinancialLoans;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface FinancialLoansRepository extends JpaRepository<FinancialLoans, UUID> {
}
