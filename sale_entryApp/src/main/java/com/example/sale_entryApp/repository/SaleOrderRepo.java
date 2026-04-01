package com.example.sale_entryApp.repository;

import com.example.sale_entryApp.entity.SaleOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Locale;

public interface SaleOrderRepo extends JpaRepository<SaleOrder,Integer> {
    SaleOrder findById(int id);  //Just Writing it,but Spring Provide this
    List<SaleOrder> findAllById(int id);
    List<SaleOrder> findByCustomerId(int c_id);
    List<SaleOrder> findByStatus(String status);
    List<SaleOrder> findBySalesPersonId(int s_personId);
    List<SaleOrder> findByDate(LocalDate date);
}
