package com.expoMoney.web.rest;

import com.expoMoney.entities.dto.CustomerCommitmentItemDTO;
import com.expoMoney.service.CustomerCommitmentItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
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
@RequestMapping("/customerCommitment")
public class CustomerCommitmentItemController {

    private final CustomerCommitmentItemService service;

    @PostMapping("/addItemOrUpdate/{idCustomer}")
    @Operation(tags = {"CUSTOMER COMMITMENT"}, summary = "Criar ou Item Empenho",
            description = "Requisicao POST para Criar ou Item Empenho", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<CustomerCommitmentItemDTO> addItemOrUpdate(@RequestBody CustomerCommitmentItemDTO dto, @PathVariable("idCustomer") UUID idCustomer){
        log.info("REQUISICAO POST PARA CRIAR NOVO ITEM EMEPNHO");
        dto = service.addItemOrUpdate(dto, idCustomer);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(dto.getId()).toUri();
        return ResponseEntity.created(uri).body(dto);
    }

    @GetMapping("/findByCustomer/{idCustomer}")
    @Operation(tags = {"CUSTOMER COMMITMENT"}, summary = "Buscar Itens Empenho por Cliente",
            description = "Requisicao GET para Buscar Itens Empenho por Cliente", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<List<CustomerCommitmentItemDTO>> findItemsByCustomer(@PathVariable("idCustomer") UUID idCustomer){
        log.info("REQUISICAO GET PARA RECUPERAR ITENS EMPENHO POR CLIENTE");
        return ResponseEntity.ok(service.findAllByCustomer(idCustomer));
    }


}
