package com.expoMoney.service.util;

import com.expoMoney.entities.FinancialLoansPaid;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;

public class CalculateUtil {

    public static Double calculateValueInstallment(Double capital, Float rate){
        BigDecimal value = BigDecimal.valueOf((capital * rate) /100);
        return value.setScale(2, RoundingMode.HALF_UP).doubleValue();
    }

    public static Double calculateValueInstallmentDiary(Double capital, Float rate){
        double value = calculateValueInstallment(capital, rate);
        BigDecimal diary = BigDecimal.valueOf(value/30);
        return diary.setScale(2, RoundingMode.HALF_UP).doubleValue();
    }

    public static void calculateValueTotalDiaryOnerousLoans(FinancialLoansPaid paid){

        int d = DateUtil.CalculateTheDifferenceInDaysBetweenTwoDates(
                paid.getFinancialLoans().getDateCreateFinancial(),
                LocalDate.now());

        double p = paid.getValueDiary() * d;
        paid.setCurrencyValue(
                (p - paid.getAmountPaidOnerous()));
    }
}
