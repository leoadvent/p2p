package com.expoMoney.service;

import com.expoMoney.entities.Customer;
import com.expoMoney.entities.dto.CustomerDTO;
import com.expoMoney.mapper.CustomerMapper;
import com.expoMoney.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository repository;
    private final CustomerMapper mapper;

    @Value("${path.photo.customer}")
    private String photoPathCustomer;

    private Customer save(Customer customer){
        return repository.save(customer);
    }

    public CustomerDTO createOrUpdate(CustomerDTO dto) throws IOException {
        Customer customer = dto.getId() == null ?  new Customer() : findById(dto.getId());
        if(dto.getPhotoFile() != null){
            customer.setPhoto(UUID.randomUUID().toString()+".jpg");
            dto.setPhoto(customer.getPhoto());

            File dir = new File(photoPathCustomer);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            Path path = Paths.get(photoPathCustomer + "\\"+ customer.getPhoto());
            Files.write(path, dto.getPhotoFile().getBytes());
        }
        customer = mapper.toEntity(dto);
        customer = save(customer);
        return mapper.toDto(customer);
    }

    public Customer findById(UUID idClient){
        return repository.findById(idClient).
                orElseThrow(()-> new NoSuchElementException("Cliente não localizado"));
    }

    public CustomerDTO findByIdDTO(UUID idClient){
        return mapper.toDto(findById(idClient));
    }

    public Page<CustomerDTO> fildByFilter(CustomerDTO dto, Pageable pageable){

        Customer customer = mapper.toEntity(dto);

        ExampleMatcher matcher = ExampleMatcher.matching()
                .withMatcher("id", ExampleMatcher.GenericPropertyMatchers.exact())
                .withMatcher("firsName", ExampleMatcher.GenericPropertyMatchers.contains())
                .withIgnoreCase("firsName")
                .withMatcher("lastName", ExampleMatcher.GenericPropertyMatchers.contains())
                .withIgnoreCase("lastName")
                .withMatcher("contact", ExampleMatcher.GenericPropertyMatchers.contains());

        Example<Customer> example = Example.of(customer, matcher);
        Page<Customer> pageEntity = repository.findAll(example, pageable);
        return pageEntity.map(mapper::toDto);
    }

    public List<CustomerDTO> findLikeByNome(String name){

        List<Customer> clientes = repository.findByNomeLike(name);
        return clientes.stream().map(mapper::toDto).toList();
    }

    public List<CustomerDTO> findByDefaulting(){

        List<Customer> customersDefaulting = repository.findByDefaulting();
        return customersDefaulting.stream().map(mapper::toDto).toList();
    }

    public List<CustomerDTO> findByDueToday(){
        List<Customer> customers = repository.findDueToday();
        return customers.stream().map(mapper::toDto).toList();
    }

    public void delete(UUID idUsuario){
        Customer cliente = findById(idUsuario);
        repository.delete(cliente);
    }
}
