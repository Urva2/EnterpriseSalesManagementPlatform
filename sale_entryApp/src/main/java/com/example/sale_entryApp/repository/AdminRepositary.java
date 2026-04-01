package com.example.sale_entryApp.repository;

import com.example.sale_entryApp.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;


public interface AdminRepositary extends JpaRepository<Admin,Integer>{
        Admin findByName(String name);
        Admin findById(int id);  //Just Writing it,but Spring Provide this
        Admin findByEmail(String email);
}
