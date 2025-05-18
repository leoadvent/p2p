package com.expoMoney.service.util;

import java.time.LocalDate;
import java.time.Period;

public class DateUtil {

    public static int CalculateTheDifferenceInDaysBetweenTwoDates(LocalDate dateStart, LocalDate dateEnd){
        Period period = Period.between(dateStart, dateEnd);
        return period.getDays();
    }
}
