package com.expoMoney.web.rest;

import com.expoMoney.entities.Endereco;
import com.expoMoney.service.EnderecoService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/endereco")
public class EnderecoController {

    private final EnderecoService service;

    @GetMapping("/viacep/{cep}")
    @Operation(tags = {"ENDERECO"}, summary = "Recuperar endereco via CEP",
            description = "Requisicao GET para Recuperar endereco via CEP"
    )
    public ResponseEntity<Endereco> findByCep(@PathVariable("cep") String cep){
        log.info("REQUISICAO GET PARA RECUPERAR ENDERECO VIA CEP");
        return ResponseEntity.ok(service.buscaPorCEP(cep));
    }
}
