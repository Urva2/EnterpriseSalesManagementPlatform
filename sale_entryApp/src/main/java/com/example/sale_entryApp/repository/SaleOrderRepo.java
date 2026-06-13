package com.example.sale_entryApp.repository;

import com.example.sale_entryApp.entity.SaleOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Locale;

public interface SaleOrderRepo extends JpaRepository<SaleOrder,Integer> {
    SaleOrder findById(int id);  //Just Writing it,but Spring Provide this
    SaleOrder findByIdAndSalesPersonId(int id,int salesPersonId);
    List<SaleOrder> findAllById(int id);
    List<SaleOrder> findByCustomerId(int c_id);
    List<SaleOrder> findByStatus(String status);
    List<SaleOrder> findBySalesPersonId(int s_personId);
    List<SaleOrder> findByDate(LocalDate date);
    Page<SaleOrder> findByCustomerNameContainingIgnoreCase(String customerName, Pageable pageable);
    Page<SaleOrder> findByCustomerNameContainingIgnoreCaseAndSalesPersonId(
            String customerName,
            int salesPId,
            Pageable pageable
    );
    Page<SaleOrder> findByStatusIgnoreCase(String status, Pageable pageable);
    Page<SaleOrder> findByStatusContainingIgnoreCaseAndSalesPersonId(
            String customerName,
            int salesPId,
            Pageable pageable
    );
    @Query("SELECT SUM(s.total) FROM SaleOrder s WHERE s.salesPerson.id = :salesPersonId")
    Double calculateTotalRevenueBySalesPersonId(@Param("salesPersonId") int salesPersonId);

    @Query("SELECT SUM(s.total) FROM SaleOrder s")
    Double calculateTotalRevenue();
}
