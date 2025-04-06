package com.expoMoney.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "TB_FINANCIAL_LOANS")
@EqualsAndHashCode(of = "id")
public class FinancialLoans {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @NotNull(message = "Campo Obrigatório")
    private Double value;
    @NotNull(message = "Campo Obrigatório")
    private Float rate;
    @NotNull(message = "Campo Obrigatório")
    @Column(name = "late_interest")
    private Float lateInterest;
    @NotNull(message = "Campo Obrigatório")
    @Column(name = "due_day")
    private Integer dueDay;
    @NotNull(message = "Campo Obrigatório")
    @Column(name = "start_month")
    private Integer startMonth;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "financialLoans")
    @NotNull(message = "Campo Obrigatório")
    private List<FinancialLoansPaid> loansPaids = new ArrayList<>();

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @NotNull(message = "Campo Obrigatório")
    private Customer customer;
}
