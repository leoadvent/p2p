package com.expoMoney.service;

import com.expoMoney.entities.Customer;
import com.expoMoney.entities.CustomerCommitmentItem;
import com.expoMoney.entities.dto.CustomerCommitmentItemDTO;
import com.expoMoney.mapper.CustomerCommitmentItemMapper;
import com.expoMoney.repository.CustomerCommitmentItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomerCommitmentItemService {

    private final CustomerCommitmentItemRepository repository;
    private final CustomerService customerService;
    private final CustomerCommitmentItemMapper mapper;

    public CustomerCommitmentItem save(CustomerCommitmentItem item){
        return repository.save(item);
    }

    public CustomerCommitmentItemDTO addItemOrUpdate(CustomerCommitmentItemDTO dto, UUID idCustomer){
        Customer customer = customerService.findById(idCustomer);
        dto.setCustomer(customer);
        CustomerCommitmentItem item = mapper.toEntity(dto);
        item = save(item);
        return mapper.toDto(item);
    }

    public List<CustomerCommitmentItemDTO> findAllByCustomer(UUID idCustomer){
        List<CustomerCommitmentItem> listItem = repository.findByIdCustomer(idCustomer);
        return listItem.stream().map(mapper::toDto).toList();
    }


}
