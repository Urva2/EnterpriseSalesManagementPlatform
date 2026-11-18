
package com.example.sale_entryApp.service;

import com.example.sale_entryApp.dto.RequestDto.CustomerRequestDto;
import com.example.sale_entryApp.dto.ResponseDto.CustomerDTO;
import com.example.sale_entryApp.entity.Customer;
import com.example.sale_entryApp.mapper.CustomerMapper;
import com.example.sale_entryApp.repository.CustomerRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepo customerRepo;

    @Autowired
    private CustomerMapper customerMapper;

    @Transactional
    public CustomerDTO createCustomer(CustomerRequestDto dto) {

        Customer customer = customerMapper.toEntity(dto);

        Customer existing =
                customerRepo.findByPhoneno(customer.getPhoneno());

        if (existing != null && existing.getId() != customer.getId()) {
            throw new RuntimeException(
                    "Customer Already Exist with Phone_No:"
                            + customer.getPhoneno()
            );
        }

        Customer saved = customerRepo.save(customer);

        return customerMapper.customerDto(saved);
    }

    @Transactional(readOnly = true)
    public CustomerDTO findCustomerByid(int id) {

        Customer customer = customerRepo.findById(id);

        if (customer != null) {
            return customerMapper.customerDto(customer);
        }

        throw new RuntimeException(
                "Customer Not exist with Id:" + id
        );
    }

    @Transactional(readOnly = true)
    public List<CustomerDTO> findCustomers() {

        List<Customer> customerList = customerRepo.findAll();

        if (!customerList.isEmpty()) {
            return customerMapper.toDtoCustomersList(customerList);
        }

        throw new RuntimeException("Error!! Customers Not Found.");
    }

    // Search customers by phone number
    @Transactional(readOnly = true)
    public List<CustomerDTO> searchCustomersByPhone(String phone) {

        if (phone == null || phone.trim().isEmpty()) {
            return findCustomers();
        }

        List<Customer> customers =
                customerRepo.findByPhonenoContaining(phone.trim());

        return customerMapper.toDtoCustomersList(customers);
    }

    // Compatibility method for existing callers
    @Transactional(readOnly = true)
    public List<CustomerDTO> searchCustomerByPhoneno(String phone) {

        return searchCustomersByPhone(phone);
    }
}
