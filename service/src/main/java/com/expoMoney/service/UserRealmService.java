package com.expoMoney.service;

import com.expoMoney.entities.UserRealm;
import com.expoMoney.repository.UserRealmRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserRealmService {

    private final UserRealmRepository repository;

    public UserRealm save(UserRealm userRealm){
        return repository.save(userRealm);
    }

    public String findRealmByUsername(String username){
        return repository.findByNameRealmByUsername(username);
    }
}
