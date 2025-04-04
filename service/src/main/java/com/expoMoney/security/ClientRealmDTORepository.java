package com.expoMoney.security;

import com.expoMoney.security.dto.ClientRealmDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientRealmDTORepository extends JpaRepository<ClientRealmDTO, String> {

    @Query(value =
            "SELECT " +
                    "c.id, " +
                    "c.enabled, " +
                    "c.client_id, " +
                    "c.secret, " +
                    "c.base_url, " +
                    "c.realm_id " +
            " FROM " +
                    " client c " +
            " WHERE " +
                    " c.client_id = :clientId", nativeQuery = true)
    Optional<Object> findByClientName(String clientId);

    @Query(value = """
                SELECT
                    c.client_id , c.secret
                FROM
                    realm r
                    inner join client c on c.realm_id = r.id and r.enabled = true and c.secret is not null
                    where
                r.name = :nameRealm
            """, nativeQuery = true)
    Optional<Object> findClientByRealm(String nameRealm);
}
