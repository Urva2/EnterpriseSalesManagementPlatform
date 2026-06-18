package com.example.sale_entryApp.dto;

import lombok.Data;

@Data
public class DashboardStatsDTO {
    private long totalProducts;
    private long totalOrders;
    private long totalSalespersons;
    private double totalRevenue;
    private Long totalCustomers;
    private String topSalesPerson;
}
