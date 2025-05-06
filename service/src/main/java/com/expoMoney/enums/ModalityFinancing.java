package com.expoMoney.enums;

import lombok.Getter;

@Getter
public enum ModalityFinancing {

    FINANCING(1, "Financiamento"),
    ONEROUS_LOAN(2, "Mútuo Oneroso");

    private final int cod;
    private final String description;


    ModalityFinancing(int cod, String description) {
        this.cod = cod;
        this.description = description;
    }
}
