package com.example.sale_entryApp.dto;

import com.example.sale_entryApp.dto.ResponseDto.SaleOrderDTO;
import com.example.sale_entryApp.entity.SaleOrder;

import java.util.List;

public class CustomerPurchaseHistoryDto {
    private Integer customerId;
    private String customerName;
    private Long totalOrders;
    private Double totalSpent;
    List<SaleOrderDTO> orders;
}
