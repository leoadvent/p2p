package com.expoMoney.mapper;

import com.expoMoney.entities.CustomerCommitmentItem;
import com.expoMoney.entities.dto.CustomerCommitmentItemDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {CustomerCommitmentItem.class, CustomerCommitmentItemDTO.class})
public interface CustomerCommitmentItemMapper {

    CustomerCommitmentItem toEntity(CustomerCommitmentItemDTO dto);
    @Mapping(ignore = true, target = "entity.customer")
    CustomerCommitmentItemDTO toDto(CustomerCommitmentItem entity);
}
