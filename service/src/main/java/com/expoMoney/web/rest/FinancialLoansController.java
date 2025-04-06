package com.expoMoney.web.rest;

import com.expoMoney.entities.dto.FinancialLoansCreateDTO;
import com.expoMoney.entities.dto.FinancialLoansDTO;
import com.expoMoney.service.FinancialLoansService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/financial")
public class FinancialLoansController {

    private final FinancialLoansService service;

    @PostMapping
    @Operation(tags = {"FINANCIAL LOANS"}, summary = "Criar ou Simular Empréstimo",
            description = "Requisicao POST para Criar ou Simular Empréstimo", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<FinancialLoansDTO> create(@RequestBody @Valid FinancialLoansCreateDTO createDTO){
        log.info("REQUISICAO POST PARA CRIAR NOVO EMPRESTIMO");
        FinancialLoansDTO loansDTO = service.create(createDTO);
        if(createDTO.getSimulator()){
            return ResponseEntity.ok().body(loansDTO);
        }
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(loansDTO.getId()).toUri();
        return ResponseEntity.created(uri).body(loansDTO);
    }
}
