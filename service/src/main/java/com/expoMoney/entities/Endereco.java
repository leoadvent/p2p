package com.expoMoney.entities;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "TB_ENDERECO")
@EqualsAndHashCode(of = "id")
public class Endereco {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String cep;
    private String logradouro;
    private String numero;
    private String complemento;
    private String unidade;
    private String bairro;
    private String localidade;
    private String uf;
    private String regiao;
    private String ibge;
    private String ddd;
    private String gia;
    private String siaf;
}
