package com.example.sale_entryApp.mapper;

import com.example.sale_entryApp.dto.RequestDto.CustomerRequestDto;
import com.example.sale_entryApp.dto.ResponseDto.CustomerDTO;
import com.example.sale_entryApp.entity.Customer;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-06-12T18:35:43+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class CustomerMapperImpl implements CustomerMapper {

    @Override
    public Customer toEntity(CustomerRequestDto customerDTO) {
        if ( customerDTO == null ) {
            return null;
        }

        Customer customer = new Customer();

        customer.setName( customerDTO.getName() );
        customer.setAddress( customerDTO.getAddress() );
        customer.setPhoneno( customerDTO.getPhoneno() );

        return customer;
    }

    @Override
    public CustomerDTO customerDto(Customer customer) {
        if ( customer == null ) {
            return null;
        }

        CustomerDTO customerDTO = new CustomerDTO();

        customerDTO.setName( customer.getName() );
        customerDTO.setAddress( customer.getAddress() );
        customerDTO.setPhoneno( customer.getPhoneno() );

        return customerDTO;
    }

    @Override
    public List<CustomerDTO> toDtoCustomersList(List<Customer> customerList) {
        if ( customerList == null ) {
            return null;
        }

        List<CustomerDTO> list = new ArrayList<CustomerDTO>( customerList.size() );
        for ( Customer customer : customerList ) {
            list.add( customerDto( customer ) );
        }

        return list;
    }
}
