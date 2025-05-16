package com.expoMoney.service.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

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
}
