package com.expoMoney.mapper;

import com.expoMoney.entities.Customer;
import com.expoMoney.entities.dto.CustomerDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {Customer.class, CustomerDTO.class})
public interface CustomerMapper {

    @Mapping(ignore = true, target = "dto.photoFile")
    Customer toEntity(CustomerDTO dto);
    CustomerDTO toDto(Customer entity);
}
