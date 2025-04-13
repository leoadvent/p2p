package com.expoMoney.repository;

import com.expoMoney.entities.UserRealm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRealmRepository extends JpaRepository<UserRealm, Long> {
   @Query("SELECT ur.nameRealm FROM UserRealm ur WHERE ur.username = :username")
    String findByNameRealmByUsername(String username);
}
