package com.example.sale_entryApp.mapper;

import com.example.sale_entryApp.dto.RequestDto.CustomerRequestDto;
import com.example.sale_entryApp.dto.ResponseDto.CustomerDTO;
import com.example.sale_entryApp.entity.Customer;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CustomerMapper {
    //DTO->Entity
    Customer toEntity(CustomerRequestDto customerDTO);
    //Entity->DTO
    @BeanMapping(ignoreByDefault = true)
    @Mapping(source="name",target="name")
    @Mapping(source="address",target="address")
    @Mapping(source="phoneno",target="phoneno")
    CustomerDTO customerDto(Customer customer);
    List<CustomerDTO> toDtoCustomersList(List<Customer> customerList);
}
