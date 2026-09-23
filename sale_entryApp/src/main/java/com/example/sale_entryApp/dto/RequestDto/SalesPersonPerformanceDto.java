package com.example.sale_entryApp.dto;

import lombok.Data;

@Data
public class SalesPersonPerformanceDto {

    private Integer rank;
    private String salesPersonName;
    private Long orders;
    private Double totalRevenue;
}