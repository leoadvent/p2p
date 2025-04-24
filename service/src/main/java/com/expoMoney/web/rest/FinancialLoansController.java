package com.expoMoney.web.rest;

import com.expoMoney.entities.FinancialLoansPaid;
import com.expoMoney.entities.dto.CustomerDueToday;
import com.expoMoney.entities.dto.FinancialLoansCreateDTO;
import com.expoMoney.entities.dto.FinancialLoansDTO;
import com.expoMoney.entities.dto.FinancialLoansPendingByCustumerDTO;
import com.expoMoney.service.FinancialLoansService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

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

    @GetMapping("/findByLoansPendingByCustomer/{idCustomer}")
    @Operation(tags = {"FINANCIAL LOANS"}, summary = "Recuperar Empréstimo Em Aberto por CLIENTE",
            description = "Requisicao GET para Recuperar Empréstimo Em Aberto por CLIENTE", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<FinancialLoansPendingByCustumerDTO> findLoansPendingByCustumer(@PathVariable("idCustomer")UUID idCustomer){
        log.info("REQUISICAO GET PARA RECUPERAR FINANCIAMENTO PENDENTE POR CLIENTE");
        return ResponseEntity.ok(service.findLoansPendingByCustomer(idCustomer));
    }

    @PostMapping("/loansPaid")
    @Operation(tags = {"FINANCIAL LOANS"}, summary = "Realizar pagamento de Parcela",
            description = "Requisicao POST para Realizar pagamento de Parcela", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<FinancialLoansPaid> loansPaid(@RequestBody FinancialLoansPaid paid){
        log.info("REQUISICAO POST PARA REALIZAR PAGAMENTO DE PARCELAS");
        return ResponseEntity.ok(service.loansPaid(paid));
    }

    @GetMapping("/dueToday/{days}")
    @Operation(tags = {"FINANCIAL LOANS"}, summary = "Buscar Clientes com o Vencimento para o Dia de Hoje",
            description = "Requisicao GET para Buscar Clientes com o Vencimento para o Dia de Hoje", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<List<CustomerDueToday>> findByCustomerDueToday(@PathVariable("days") Integer days){
        log.info("REQUSICAO GET PARA RECUPERAR LISTA DE CLIENTES COM VENCIMENTO EM {} DIAS", days);
        return ResponseEntity.ok(service.customerDueToday(days));
    }
}
