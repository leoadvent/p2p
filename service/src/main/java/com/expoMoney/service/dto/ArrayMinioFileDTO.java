package com.expoMoney.service.dto;

import lombok.Getter;
import lombok.Setter;

import java.io.ByteArrayOutputStream;

@Getter
@Setter
public class ArrayMinioFileDTO {

    private String extensao;
    private ByteArrayOutputStream outputStream;
}