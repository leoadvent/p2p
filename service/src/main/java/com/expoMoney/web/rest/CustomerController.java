package com.expoMoney.web.rest;

import com.expoMoney.entities.dto.CustomerDTO;
import com.expoMoney.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/customer")
public class CustomerController {

    private final CustomerService service;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(tags = {"CUSTOMER"}, summary = "Criar ou Atualizar Clientes",
            description = "Requisicao POST para Criar ou Atualizar Clientes", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<CustomerDTO> createOrUpdate(@ModelAttribute @Valid CustomerDTO dto) throws IOException {
        log.info("REQUISICAO POST PARA CRIAR OU ATUALIZAR CLIENTE");
        dto = service.createOrUpdate(dto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(dto.getId()).toUri();
        return ResponseEntity.created(uri).body(dto);
    }

    @GetMapping("/findById/{idCustomer}")
    @Operation(tags = {"CUSTOMER"}, summary = "Buscar Usuário por ID",
            description = "Requisicao GET para Buscar Usuário por ID", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<CustomerDTO> findById(@PathVariable("idCustomer") UUID idCustomer){
        log.info("REQUISICAO GET PARA RECUPERA CLIENTE POR ID");
        return ResponseEntity.ok(service.findByIdDTO(idCustomer));
    }

    @PostMapping("/filter")
    @Operation(tags = {"CUSTOMER"}, summary = "Recuperar lista de clientes por Filtro",
            description = "Requisicao POST para Recuperar lista de clientes por Filtro", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<Page<CustomerDTO>> findByFilter(@RequestBody CustomerDTO dto, Pageable pageable){
        log.info("REQUISICAO POST PARA RECUPERAR LISTA DE CLIENTES");
        return ResponseEntity.ok(service.fildByFilter(dto, pageable));
    }

    @PostMapping("/filterByNome")
    @Operation(tags = {"CUSTOMER"}, summary = "Recuperar lista de clientes por Filtro Somente pelo Nome",
            description = "Requisicao POST para Recuperar lista de clientes por Filtro Somente pelo Nome", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<List<CustomerDTO>> filterByName(@RequestBody String name){
        log.info("rREQUISICAO POST PARA RECUPERAR LISTA DE USUARIO FILTRADO POR NOME");
        return ResponseEntity.ok(service.findLikeByNome(name.replaceAll("\"", "")));
    }

    @GetMapping("/defaulting")
    @Operation(tags = {"CUSTOMER"}, summary = "Recuperar lista de clientes Inadimplentes",
            description = "Requisicao GET para Recuperar lista de clientes Inadimplentes", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<List<CustomerDTO>> findByDefaulting(){
        log.info("REQUISICAO GET PARA RECUPERAR USUARIOS INADIMPLENTE");
        return ResponseEntity.ok(service.findByDefaulting());
    }

    @GetMapping("/dueToday")
    @Operation(tags = {"CUSTOMER"}, summary = "Recuperar lista de clientes Com Vencimento no dia de Hoje",
            description = "Requisicao GET para Recuperar lista de clientes Com Vencimento no dia de Hoje", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<List<CustomerDTO>> findByDueToday(){
        log.info("REQUISICAO GET PARA RECUPERAR CLIENTES COM PARCELA VENCENDO NO DIA DE HOJE");
        return ResponseEntity.ok(service.findByDueToday());
    }
}
