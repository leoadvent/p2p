package com.expoMoney.security.utils;

import java.security.SecureRandom;
import java.text.NumberFormat;
import java.util.Locale;

public class StringUtils {

    public static String generateSecretClientRealm() {

        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        int length = 32;

        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(length);

        for (int i = 0; i < length; i++) {
            int index = random.nextInt(characters.length());
            sb.append(characters.charAt(index));
        }

        return sb.toString();
    }

    public static String formatCurrency(Double value){
        NumberFormat format = NumberFormat.getCurrencyInstance(new Locale("pt","BR"));
        return format.format(value);
    }
}
