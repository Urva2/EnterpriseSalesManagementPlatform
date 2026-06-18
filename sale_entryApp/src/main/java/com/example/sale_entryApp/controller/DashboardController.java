package com.example.sale_entryApp.controller;

import com.example.sale_entryApp.dto.ResponseDto.DashboardStatsDTO;
import com.example.sale_entryApp.repository.ProductRepo;
import com.example.sale_entryApp.repository.SaleOrderRepo;
import com.example.sale_entryApp.repository.SalesPersonRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/dashboard")
public class DashboardController {

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private SaleOrderRepo saleOrderRepo;

    @Autowired
    private SalesPersonRepo salesPersonRepo;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalProducts(productRepo.count());
        stats.setTotalOrders(saleOrderRepo.count());
        stats.setTotalSalespersons(salesPersonRepo.count());
        
        Double revenue = saleOrderRepo.calculateTotalRevenue();
        stats.setTotalRevenue(revenue != null ? revenue : 0.0);
        
        return ResponseEntity.ok(stats);
    }
}
