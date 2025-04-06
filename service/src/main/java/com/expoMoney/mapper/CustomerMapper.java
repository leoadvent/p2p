package com.expoMoney.mapper;

import com.expoMoney.entities.Customer;
import com.expoMoney.entities.dto.CustomerDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {Customer.class, CustomerDTO.class})
public interface CustomerMapper {

    Customer toEntity(CustomerDTO dto);
    CustomerDTO toDto(Customer entity);
}
