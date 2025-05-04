package com.expoMoney.entities.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class FundingReceived {

    @JsonFormat(pattern = "dd/MM")
    private LocalDate duePayment;
    private Double value;
}
