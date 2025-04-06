package com.expoMoney.mapper;

import com.expoMoney.entities.FinancialLoans;
import com.expoMoney.entities.dto.FinancialLoansCreateDTO;
import com.expoMoney.entities.dto.FinancialLoansDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {FinancialLoans.class, FinancialLoansCreateDTO.class, FinancialLoansDTO.class})
public interface FinancialLoansMapper {

    FinancialLoans fromCreate(FinancialLoansCreateDTO dto);
    FinancialLoans toEntity(FinancialLoansDTO dto);
    FinancialLoansDTO toDto(FinancialLoans entity);
}
