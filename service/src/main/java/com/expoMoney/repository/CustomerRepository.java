package com.expoMoney.repository;

import com.expoMoney.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, UUID> {

    @Query("SELECT c FROM Customer c WHERE LOWER(c.firsName) LIKE LOWER(CONCAT('%',:firsName,'%'))")
    List<Customer> findByNomeLike(@Param("firsName") String firsName);

    @Query("""
    SELECT
        DISTINCT c
    FROM
        Customer c
        JOIN c.financialLoans fl
        JOIN fl.loansPaids lp
    WHERE
        lp.amountPaid < lp.currencyValue
        AND lp.dueDate < CURRENT_DATE
    """)
    List<Customer> findByDefaulting();
}
