package com.expoMoney.entities.dto;

import com.expoMoney.security.utils.StringUtils;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class InvestmentsDTO {

    private Double investmentsValue;
    private Double totalExpectedValue;
    private Double profitValue;
    private Double delayedExpectedValue;

    public String getFormatedInvestmentsValue(){
        return StringUtils.formatCurrency(this.investmentsValue == null ? 0 : this.investmentsValue);
    }

    public String getFormatedTotalExpectedValue(){
        return StringUtils.formatCurrency(this.totalExpectedValue == null ? 0 : this.totalExpectedValue);
    }

    public String getFormatedProfitValue(){
        return StringUtils.formatCurrency(this.profitValue == null ? 0 : this.profitValue);
    }

    public String getFormatedDelayedExpectedValue(){
        return StringUtils.formatCurrency(this.delayedExpectedValue == null ? 0 : this.delayedExpectedValue);
    }

}
