package com.expoMoney.enums;

import lombok.Getter;

@Getter
public enum ModalityFinancing {

    FINANCING(1, "Parcelado"),
    ONEROUS_LOAN(2, "Carência de Capital");

    private final int cod;
    private final String description;


    ModalityFinancing(int cod, String description) {
        this.cod = cod;
        this.description = description;
    }
}
