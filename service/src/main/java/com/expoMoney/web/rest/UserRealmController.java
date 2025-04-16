package com.expoMoney.web.rest;

import com.expoMoney.entities.dto.UserRealmFindNameDTO;
import com.expoMoney.service.UserRealmService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.NoSuchElementException;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/userRealm")
public class UserRealmController {

    private final UserRealmService service;

    @PostMapping("/recoveryRealm")
    @Operation(tags = {"USER REALM"}, summary = "Buscar realm por login do usuário",
            description = "Requisicao POST para Buscar realm por login do usuário"
    )
    public ResponseEntity<String> recoverRealm(@RequestBody @Valid UserRealmFindNameDTO dto){
        log.info("REQUISICAO POST PARA RECUPERAR REALM DO USUÁRIO");
        String realmName = service.findRealmByUsername(dto.getUsername());

        if(realmName.isEmpty()){
            throw new NoSuchElementException("Realm não localizado!");
        }
        return ResponseEntity.ok(service.findRealmByUsername(dto.getUsername()));
    }
}
