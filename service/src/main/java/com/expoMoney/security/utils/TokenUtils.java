package com.expoMoney.security.utils;

import jakarta.servlet.http.HttpServletRequest;

public class TokenUtils {

    public static String RetrieveToken(HttpServletRequest request){
        return request.getHeader("Authorization");
    }

    public static String retrieveRealm(HttpServletRequest request){
        return request.getHeader("X-Tenant-ID");
    }
}
