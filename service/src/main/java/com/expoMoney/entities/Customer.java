package com.expoMoney.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "TB_CUSTOMER")
@EqualsAndHashCode(of = "id")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @NotEmpty(message = "Campo Obrigatório")
    @Column(name = "first_name")
    private String firsName;
    @NotEmpty(message = "Campo Obrigatório")
    @Column(name = "last_name")
    private String lastName;
    @NotEmpty(message = "Campo Obrigatório")
    private String contact;

    @OneToOne(cascade = CascadeType.ALL)
    private Endereco endereco;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "customer")
    private List<FinancialLoans> financialLoans = new ArrayList<>();

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "customer")
    private List<CustomerCommitmentItem> commitmentItems = new ArrayList<>();
}
