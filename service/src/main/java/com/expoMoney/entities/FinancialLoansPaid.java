package com.expoMoney.entities;

import com.expoMoney.security.utils.StringUtils;
import com.expoMoney.service.util.CalculateUtil;
import com.expoMoney.service.util.DateUtil;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.math.RoundingMode;
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
    @JsonFormat(pattern = "dd/MM/yyyy")
    @NotNull(message = "Campo Obrigatório")
    @Column(name = "due_date")
    private LocalDate dueDate;
    @JsonFormat(pattern = "dd/MM/yyyy")
    @Column(name = "due_payment")
    private LocalDate duePayment;
    @NotNull(message = "Campo Obrigatório")
    @Column(name = "install_meant_value")
    private Double installmentValue;
    @NotNull(message = "Campo Obrigatório")
    @Column(name = "currency_value")
    private Double currencyValue;
    @Column(name = "amount_paid")
    private Double amountPaid;
    @Column(name = "amount_paid_onerous")
    private Double amountPaidOnerous;
    @NotNull(message = "Campo Obrigatório")
    @Column(name = "add_for_day_delay")
    private Double additionForDaysOfDelay;
    @NotNull(message = "Campo Obrigatório")
    private Float rate;
    @NotNull(message = "Campo Obrigatório")
    @Column(name = "interest_delay")
    private Float interestDelay;
    @NotNull(message = "Campo Obrigatório")
    private Integer portion;
    private Boolean renegotiation;
    @JsonFormat(pattern = "dd/MM/yyyy")
    @Column(name = "renegotiation_date")
    private LocalDate renegotiationDate;
    @Column(name = "value_diary")
    private Double valueDiary;
    @Column(name = "executed_pledge")
    private Boolean executedPledge;

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

    public String getValueDiaryFormat(){
        return StringUtils.formatCurrency(this.valueDiary != null ? this.valueDiary : 0);
    }

    public String getValuePaidOnerousFormat(){
        return StringUtils.formatCurrency(this.amountPaidOnerous != null ? this.amountPaidOnerous : 0);
    }

    public String getCurrencyValueFormat(){
        return StringUtils.formatCurrency(this.currencyValue > 0 ? this.currencyValue : 0);
    }

    public Double getAmortizedValue(){
        return Math.abs(this.currencyValue < 0 ? this.currencyValue : 0);
    }
    public String getAmortizedValueFormat(){
        return StringUtils.formatCurrency(Math.abs(this.currencyValue < 0 ? this.currencyValue : 0));
    }

    public String getAdditionForDaysOfDelayFormat(){
        return StringUtils.formatCurrency(this.additionForDaysOfDelay);
    }

    public String getAmountPaidFormat(){
        return StringUtils.formatCurrency(this.amountPaid == null ? 0 : this.amountPaid);
    }

    public boolean getLateInstallment(){
        return this.getDueDate().isBefore(LocalDate.now()) && this.currencyValue > this.amountPaid;
    }

    public String getDebitBalance(){
        if(this.valueDiary != null && this.valueDiary > 0){
            CalculateUtil.calculateValueTotalDiaryOnerousLoans(this);
        }
        double debit = this.currencyValue - this.amountPaid;
        return StringUtils.formatCurrency(debit > 0 ? debit : 0);
    }

    public String getAmountPaidOnerousFormat(){
        return StringUtils.formatCurrency(this.amountPaidOnerous != null ? this.amountPaidOnerous : 0);
    }

    public Integer getDaysOverdue() {
        LocalDate dateNow = LocalDate.now();
        if(this.duePayment != null){
            dateNow = this.duePayment;
        }
        return DateUtil.CalculateTheDifferenceInDaysBetweenTwoDates(this.dueDate, dateNow);
    }

    @PrePersist
    private void prePersist(){
        this.setAmountPaid((double) 0);
        this.executedPledge = false;
        if (this.installmentValue != null) {
            BigDecimal value = BigDecimal.valueOf(this.installmentValue);
            this.installmentValue = value.setScale(2, RoundingMode.HALF_UP).doubleValue();
        }
        if(this.currencyValue != null){
            BigDecimal value = BigDecimal.valueOf(this.currencyValue);
            this.currencyValue = value.setScale(2, RoundingMode.HALF_UP).doubleValue();
        }
        if(this.additionForDaysOfDelay != null){
            BigDecimal value = BigDecimal.valueOf(this.additionForDaysOfDelay);
            this.additionForDaysOfDelay = value.setScale(2, RoundingMode.HALF_UP).doubleValue();
        }
        if(this.valueDiary != null){
            BigDecimal value = BigDecimal.valueOf(this.valueDiary);
            this.valueDiary = value.setScale(2, RoundingMode.HALF_UP).doubleValue();
        }
        if(this.amountPaidOnerous != null){
            BigDecimal value = BigDecimal.valueOf(this.amountPaidOnerous);
            this.amountPaidOnerous = value.setScale(2, RoundingMode.HALF_UP).doubleValue();
        }
    }

    @PreUpdate
    private void preUpdate(){
        if (this.installmentValue != null) {
            BigDecimal value = BigDecimal.valueOf(this.installmentValue);
            this.installmentValue = value.setScale(2, RoundingMode.HALF_UP).doubleValue();
        }
        if(this.currencyValue != null){
            BigDecimal value = BigDecimal.valueOf(this.currencyValue);
            this.currencyValue = value.setScale(2, RoundingMode.HALF_UP).doubleValue();
        }
        if(this.additionForDaysOfDelay != null){
            BigDecimal value = BigDecimal.valueOf(this.additionForDaysOfDelay);
            this.additionForDaysOfDelay = value.setScale(2, RoundingMode.HALF_UP).doubleValue();
        }
        if(this.valueDiary != null){
            BigDecimal value = BigDecimal.valueOf(this.valueDiary);
            this.valueDiary = value.setScale(2, RoundingMode.HALF_UP).doubleValue();
        }
        if(this.amountPaidOnerous != null){
            BigDecimal value = BigDecimal.valueOf(this.amountPaidOnerous);
            this.amountPaidOnerous = value.setScale(2, RoundingMode.HALF_UP).doubleValue();
        }
    }
}
