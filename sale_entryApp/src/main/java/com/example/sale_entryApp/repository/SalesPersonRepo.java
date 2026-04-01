package com.example.sale_entryApp.repository;

import com.example.sale_entryApp.entity.SalesPerson;
import org.hibernate.tool.schema.spi.SchemaTruncator;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalesPersonRepo extends JpaRepository<SalesPerson,Integer> {
    SalesPerson findByEmail(String email);
    SalesPerson findById(int id);  //Just Writing it,but Spring Provide this
    SalesPerson findByName(String name);
}
