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
import java.util.Objects;

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
            String status,
            int salesPersonId,
            Pageable pageable
    );
    List<SaleOrder> findByStatusAndDateBefore(String status, LocalDate date);

    @Query("SELECT SUM(s.total) FROM SaleOrder s WHERE s.salesPerson.id = :salesPersonId")
    Double calculateTotalRevenueBySalesPersonId(@Param("salesPersonId") int salesPersonId);


    @Query("SELECT SUM(s.total) FROM SaleOrder s")
    Double calculateTotalRevenue();

    @Query("SELECT SUM(s.total) FROM SaleOrder s WHERE s.date BETWEEN :from AND :to")
    Double getRevenueBetweenDates(@Param("from") LocalDate from, @Param("to") LocalDate to);

    @Query("SELECT COUNT(s) FROM SaleOrder s WHERE s.date BETWEEN :from AND :to")
    Long getOrderCountBetweenDates(@Param("from") LocalDate from, @Param("to") LocalDate to);

    @Query("SELECT AVG(s.total) FROM SaleOrder s WHERE s.date BETWEEN :from AND :to")
    Double getAverageOrderValueBetweenDates(@Param("from") LocalDate from, @Param("to") LocalDate to);

    @Query("SELECT s.salesPerson.name, COUNT(s.id), SUM(s.total) FROM SaleOrder s GROUP BY s.salesPerson.name ORDER BY SUM(s.total) DESC")
    List<Object[]> getSalesPersonRanking();
}
