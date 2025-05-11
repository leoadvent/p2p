package com.expoMoney.repository;

import com.expoMoney.entities.CustomerCommitmentItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CustomerCommitmentItemRepository extends JpaRepository<CustomerCommitmentItem, UUID> {

    @Query("""
            SELECT
                cci
            FROM
                CustomerCommitmentItem cci
            WHERE
                cci.customer.id = :idCustomer
            """)
    List<CustomerCommitmentItem> findByIdCustomer(UUID idCustomer);
}
