package com.expoMoney.web.rest;

import com.expoMoney.entities.FinancialLoansPaid;
import com.expoMoney.entities.dto.*;
import com.expoMoney.service.FinancialLoansService;
import com.expoMoney.service.util.CalculateUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
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

    @PostMapping("/loansPaid/renegotiation")
    @Operation(tags = {"FINANCIAL LOANS"}, summary = "Realizar pagamento de Parcela Renegociacao",
            description = "Requisicao POST para Realizar pagamento de Parcela Renegociacao", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<FinancialLoansPaid> loansPaidRenegotiation(@RequestBody FinancialLoansPaid paid){
        log.info("REQUISICAO POST PARA REALIZAR PAGAMENTO DE PARCELAS RENEGOCIACAO");
        return ResponseEntity.ok(service.loansPaidRenegotiation(paid));
    }

    @GetMapping("/dueToday/{days}")
    @Operation(tags = {"FINANCIAL LOANS"}, summary = "Buscar Clientes com o Vencimento para o Dia de Hoje",
            description = "Requisicao GET para Buscar Clientes com o Vencimento para o Dia de Hoje", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<List<CustomerDueToday>> findByCustomerDueToday(@PathVariable("days") Integer days){
        log.info("REQUSICAO GET PARA RECUPERAR LISTA DE CLIENTES COM VENCIMENTO EM {} DIAS", days);
        return ResponseEntity.ok(service.customerDueToday(days));
    }

    @GetMapping("/deliquentCustomer")
    @Operation(tags = {"FINANCIAL LOANS"}, summary = "Buscar Parcela de cliente Atrasadas",
            description = "Requisicao GET para Buscar Parcela de cliente Atrasadas", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<List<DelinquentCustomer>> findByDeliquentCustomer(){
        log.info("REQUISICAO GET PARA RECUPERAR PARCELAS DE CLIENTE ATRASADAS");
        return ResponseEntity.ok(service.delinquentCustomers());
    }

    @GetMapping("/investments")
    @Operation(tags = {"FINANCIAL LOANS"}, summary = "Buscar Investimentos Realizados",
            description = "Requisicao GET para Buscar Investimentos Realizados", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<InvestmentsDTO> findInvestments(){
        log.info("REQUISICAO GET PARA RECUPERAR VALORES DE INVESTIMENTOS");
        return ResponseEntity.ok(service.findInvestments());
    }

    @GetMapping("/fundingReceivedByPeriod/{quantDays}")
    @Operation(tags = {"FINANCIAL LOANS"}, summary = "Buscar Recebimento por periodo",
            description = "Requisicao GET para Buscar Recebimento por periodo", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<List<FundingReceived>> findFundingReceivedByPeriod(@PathVariable("quantDays") Integer quantDays){
        log.info("REQUISICAO GET PARA RECUPERAR RECEBIMENTOS NOS ULTIMOS {} DIAS", quantDays);
        return ResponseEntity.ok(service.findByFundingReceivedByPeriod(quantDays));
    }

    @PatchMapping("/applyingAlateInstallmentFine")
    @Operation(tags = {"FINANCIAL LOANS"}, summary = "Aplicando multas e juros sobre parcelas atrasadas",
            description = "Requisicao PATCH para Aplicando multas e juros sobre parcelas atrasadas", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<Boolean> applyingAlateInstallmentFine(HttpServletRequest request){
        log.info("APLICANDO JUROS EM PARCELAS ATRASADAS EM {}", request.getHeader("X-Tenant-ID"));
        return ResponseEntity.ok(service.applyingAlateInstallmentFine(request.getHeader("X-Tenant-ID")));
    }

    @PatchMapping("/addSingleInstallments/{idLoansPaid}")
    @Operation(tags = {"FINANCIAL LOANS"}, summary = "Adicionar parcelas em Financiamento Mutuo Oneroso",
            description = "Requisicao PATCH para Adicionar parcelas em Financiamento Mutuo Oneroso", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<List<FinancialLoansPaid>> addSingleInstallments(@PathVariable("idLoansPaid") UUID idLoansPaid){
        log.info("REQUSICAO PATCH PARA ADICIONAR PARCELAS AVULSA EM FINANCIAMENTO MUTUO ONEROSO");
        return ResponseEntity.ok(service.addSingleInstallments(idLoansPaid));
    }

    @PostMapping("/calculateValueInstallmentDiary")
    @Operation(tags = {"FINANCIAL LOANS"}, summary = "Adicionar parcelas em Financiamento Mutuo Oneroso",
            description = "Requisicao PATCH para Adicionar parcelas em Financiamento Mutuo Oneroso", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<Double> calculateValueInstallmentDiary(@RequestBody CalculationUtilDTO obj){
        log.info("REQUISICAO POST PARA CALCULAR VALOR PRESTACAO DIARIA");
        return ResponseEntity.ok(CalculateUtil.calculateValueInstallmentDiary(obj.getCapital(), obj.getRate()));
    }

    @PatchMapping("/executedPledge/{idLoans}")
    @Operation(tags = {"FINANCIAL LOANS"}, summary = "Executando a penhora",
            description = "Requisicao PATCH para Executando a penhora", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<Void> executedPledge(@PathVariable("idLoans") UUID idLoans){
        log.info("REQUISICAO PATCH PARA EXECUTAR A PENHORA DO FINANCIAMENTO");
        service.executedPledge(idLoans);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/findExecutedPledgeByCustomer/{idCustomer}")
    @Operation(tags = {"FINANCIAL LOANS"}, summary = "Recuperando Lista de Fiananciamento Com Garantia Executada por Cliente",
            description = "Requisicao GET Recuperando Lista de Fiananciamento Com Garantia Executada por Cliente", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<List<FinancialLoansDTO>> findExecutedPledgeByCustomer(@PathVariable("idCustomer") UUID idCustomer){
        log.info("REQUSICAO GET PARA RECUPERAR FINANCIAMENTO COM EXECUCAO GARANTIA POR CLIENTE");
        return ResponseEntity.ok(service.findExecutedPledgeByCustomer(idCustomer));
    }
}
