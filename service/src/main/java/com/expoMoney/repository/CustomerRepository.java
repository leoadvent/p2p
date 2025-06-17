package com.expoMoney.repository;

import com.expoMoney.entities.Customer;
import com.expoMoney.entities.dto.CustomerFilterDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
        AND fl.settled = false
        AND fl.executedPledge = false
    """)
    List<Customer> findByDefaulting();

    @Query("""
    SELECT
        DISTINCT c
    FROM
        Customer c
        JOIN c.financialLoans fl
        JOIN fl.loansPaids lp
    WHERE
        lp.amountPaid < lp.currencyValue
        AND lp.dueDate = CURRENT_DATE
    """)
    List<Customer> findDueToday();

    @Query("""
    SELECT NEW com.expoMoney.entities.dto.CustomerFilterDTO(
        c.id,
        c.firsName,
        c.lastName,
        c.contact,
        c.photo,
        c.photo,
        CAST((SELECT COUNT(*) FROM FinancialLoans fl WHERE fl.customer.id = c.id) AS int),
        CAST((SELECT COUNT(*) FROM FinancialLoans fl WHERE fl.settled = false AND fl.hasADelay = false AND fl.executedPledge = false AND fl.customer.id = c.id ) AS int),
        CAST((SELECT COUNT(*) FROM FinancialLoans fl WHERE fl.settled = false AND fl.hasADelay = true  AND fl.executedPledge = false AND fl.customer.id = c.id) AS int),
        CAST((SELECT COUNT(*) FROM FinancialLoans fl WHERE fl.executedPledge = true AND fl.customer.id = c.id) AS int)
    )
    FROM
        Customer c
    """)
    Page<CustomerFilterDTO> filterCustomer(Pageable pageable);
}
