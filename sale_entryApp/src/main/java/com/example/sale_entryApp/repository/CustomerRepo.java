package com.example.sale_entryApp.repository;

import com.example.sale_entryApp.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepo extends JpaRepository<Customer,Integer> {
    Customer findByPhoneno(String phoneno);
    Customer findById(int id);   //Just Writing it,but Spring Provide this
}
