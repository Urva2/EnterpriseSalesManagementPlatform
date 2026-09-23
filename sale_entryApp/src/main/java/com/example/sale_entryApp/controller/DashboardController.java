package com.example.sale_entryApp.controller;

import com.example.sale_entryApp.dto.ResponseDto.DashboardStatsDTO;
import com.example.sale_entryApp.repository.CustomerRepo;
import com.example.sale_entryApp.repository.ProductRepo;
import com.example.sale_entryApp.repository.SaleOrderRepo;
import com.example.sale_entryApp.repository.SalesPersonRepo;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/dashboard")
public class DashboardController {

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private SaleOrderRepo saleOrderRepo;

    @Autowired
    private SalesPersonRepo salesPersonRepo;

    @Autowired
    private CustomerRepo customerRepo;
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalProducts(productRepo.count());
        stats.setTotalOrders(saleOrderRepo.count());
        stats.setTotalSalespersons(salesPersonRepo.count());
        stats.setTotalCustomers(customerRepo.count());
        
        Double revenue = saleOrderRepo.calculateTotalRevenue();
        stats.setTotalRevenue(revenue != null ? revenue : 0.0);
        List<String> top = saleOrderRepo.findTopSalesPerson();

        stats.setTopSalesPerson(
                top.isEmpty() ? "N/A" : top.get(0)
        );
        
        return ResponseEntity.ok(stats);
    }
}
