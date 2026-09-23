package com.example.sale_entryApp.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class SalesReportDto {
        private LocalDate from;
        private LocalDate to;
        private Double totalRevenue;
        private Long totalOrders;
        private double averageOrderValue;
}