package com.expoMoney.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "TB_FINANCIAL_LOANS_PAID")
@EqualsAndHashCode(of = "id")
public class FinancialLoansPaid {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @NotNull(message = "Campo Obrigatório")
    @Column(name = "due_date")
    private LocalDate dueDate;
    @Column(name = "due_payment")
    private LocalDate duePayment;
    @NotNull(message = "Campo Obrigatório")
    @Column(name = "install_meant_value")
    private Double installmentValue;
    @Column(name = "amount_paid")
    private Double amountPaid;
    @NotNull(message = "Campo Obrigatório")
    private Float rate;
    @NotNull(message = "Campo Obrigatório")
    @Column(name = "interest_delay")
    private Float interestDelay;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private FinancialLoans financialLoans;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Customer customer;
}
