package com.example.sale_entryApp.service;

import com.example.sale_entryApp.dto.RequestDto.CustomerRequestDto;
import com.example.sale_entryApp.dto.ResponseDto.CustomerDTO;
import com.example.sale_entryApp.entity.Customer;
import com.example.sale_entryApp.mapper.CustomerMapper;
import com.example.sale_entryApp.repository.CustomerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepo customerRepo;
    @Autowired
    private CustomerMapper customerMapper;
    public CustomerDTO createCustomer(CustomerRequestDto dto)
    {
        Customer customer=customerMapper.toEntity(dto);
        Customer existing=customerRepo.findByPhoneno(customer.getPhoneno());
        if(existing!=null && existing.getId()!=customer.getId()) //Here the Id will be 90% time be diff.,so it's redundant
        {
            throw new RuntimeException("Customer Already Exist with Phone_No:"+customer.getPhoneno());
        }
        Customer saved=customerRepo.save(customer);
        return customerMapper.customerDto(saved) ;
    }
    public CustomerDTO findCustomerByid(int id){
        Customer customer=customerRepo.findById(id);
        if(customer!=null){
            return customerMapper.customerDto(customer);
        }
        throw new RuntimeException("Customer Not exist with Id:"+id);
    }
    public List<CustomerDTO> findCustomers(){
       List<Customer> customerList=customerRepo.findAll();
       if(!customerList.isEmpty()){
           return customerMapper.toDtoCustomersList(customerList);
       }
       throw new RuntimeException("Error!! Customers Not Found.");
    }

    public List<CustomerDTO> searchCustomerByPhoneno(String phone){
        List<Customer> customers = customerRepo.findByPhonenoContaining(phone);
        return customerMapper.toDtoCustomersList(customers);

    }
}
