package com.expoMoney.service;

import com.expoMoney.entities.Customer;
import com.expoMoney.entities.dto.CustomerDTO;
import com.expoMoney.entities.dto.CustomerFilterDTO;
import com.expoMoney.mapper.CustomerMapper;
import com.expoMoney.repository.CustomerRepository;
import io.minio.errors.*;
import jakarta.servlet.http.HttpServletRequest;
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
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository repository;
    private final CustomerMapper mapper;
    private final MinioService minioService;

    @Value("${path.photo.customer}")
    private String photoPathCustomer;

    private Customer save(Customer customer){
        return repository.save(customer);
    }

    public CustomerDTO createOrUpdate(CustomerDTO dto, HttpServletRequest request) throws IOException, ServerException, InsufficientDataException, ErrorResponseException, NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException, InternalException {

        String bucket = request.getHeader("X-Tenant-ID").replaceAll("_", "-").toLowerCase();

        Customer customer = dto.getId() == null ?  new Customer() : findById(dto.getId());
        if(dto.getPhotoFile() != null){

            if(customer.getPhoto() != null){
                minioService.removeFile(bucket,customer.getPhoto());
            }
            customer.setPhoto(UUID.randomUUID().toString()+".jpg");

            String photoName = minioService.uploadArquivo(dto.getPhotoFile(), bucket);

            customer.setPhoto(photoName);
            dto.setPhoto(customer.getPhoto());
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

    public Page<CustomerFilterDTO> findByFilter(CustomerDTO dto, Pageable pageable){

        Page<CustomerFilterDTO> filterDTOS = repository.filterCustomer(pageable);

        return filterDTOS;
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
