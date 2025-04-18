package com.expoMoney.entities;

import com.expoMoney.security.utils.StringUtils;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @Column(name = "add_for_day_delay")
    private Double additionForDaysOfDelay;
    @NotNull(message = "Campo Obrigatório")
    private Float rate;
    @NotNull(message = "Campo Obrigatório")
    @Column(name = "interest_delay")
    private Float interestDelay;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "financial_loans_id")
    private FinancialLoans financialLoans;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    public String getInstallmentValueFormat(){
        return StringUtils.formatCurrency(this.installmentValue == null ? 0 : this.installmentValue);
    }

    public String getAmountPaidFormat(){
        return StringUtils.formatCurrency(this.amountPaid == null ? 0 : this.amountPaid);
    }
}
