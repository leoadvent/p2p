package com.expoMoney.web.rest;

import com.expoMoney.entities.dto.CustomerDTO;
import com.expoMoney.service.CustomerService;
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
@RequestMapping("/customer")
public class CustomerController {

    private final CustomerService service;

    @PostMapping
    @Operation(tags = {"CUSTOMER"}, summary = "Criar ou Atualizar Clientes",
            description = "Requisicao POST para Criar ou Atualizar Clientes", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<CustomerDTO> createOrUpdate(@RequestBody @Valid CustomerDTO dto){
        log.info("REQUISICAO POST PARA CRIAR OU ATUALIZAR CLIENTE");
        dto = service.createOrUpdate(dto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(dto.getId()).toUri();
        return ResponseEntity.created(uri).body(dto);
    }
}
