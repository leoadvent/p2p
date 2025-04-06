package com.expoMoney.service;

import com.expoMoney.entities.Endereco;
import com.expoMoney.feign.EnderecoCliente;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class EnderecoService {

    private final EnderecoCliente enderecoCliente;

    public Endereco buscaPorCEP(String cep) throws NoSuchElementException {
        return enderecoCliente.getEndereco(cep);
    }
}
