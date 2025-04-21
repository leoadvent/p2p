package com.expoMoney.entities.dto;

import com.expoMoney.entities.Customer;
import com.expoMoney.entities.FinancialLoansPaid;
import com.expoMoney.security.utils.StringUtils;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class FinancialLoansDTO {

    private UUID id;
    @NotNull(message = "Campo Obrigatório")
    private Double value;
    @NotNull(message = "Campo Obrigatório")
    private Float rate;
    @NotNull(message = "Campo Obrigatório")
    private Float lateInterest;
    @NotNull(message = "Campo Obrigatório")
    private Integer dueDay;
    @NotNull(message = "Campo Obrigatório")
    private Integer startMonth;
    @NotNull(message = "Campo Obrigatório")
    private Integer startYear;
    @NotNull(message = "Campo Obrigatório")
    private Double additionForDaysOfDelay;

    @NotNull(message = "Campo Obrigatório")
    private List<FinancialLoansPaid> loansPaids = new ArrayList<>();

    @NotNull(message = "Campo Obrigatório")
    private Customer customer;

    public String getValueFormat(){
        return StringUtils.formatCurrency(this.value);
    }

    public String getValueTotalFormat(){
        Double value = 0.0;
        for(FinancialLoansPaid x : this.loansPaids){
            value += x.getInstallmentValue();
        }
        return StringUtils.formatCurrency(value);
    }

    public String getAdditionForDaysOfDelayFormat(){
        return StringUtils.formatCurrency(this.additionForDaysOfDelay);
    }

    public String getRates(){
        String rate = this.loansPaids.get(0).getRate() + " %";
        String interestDelay = this.loansPaids.get(0).getInterestDelay() + " %";
        return "Juros: " + rate + ", Juros atraso: " + interestDelay;
    }

    public Integer getCashInstallment(){
        return this.loansPaids.size();
    }

    public Integer getTotalInstallmentPending(){
        return this.loansPaids.stream().filter(
                item -> item.getDueDate().isBefore(LocalDate.now())
                        && item.getAmountPaid() < item.getCurrencyValue()
                ).toList().size();
    }
}
