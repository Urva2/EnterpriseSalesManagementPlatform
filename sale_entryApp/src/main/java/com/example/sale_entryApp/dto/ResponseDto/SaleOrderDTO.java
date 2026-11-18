package com.example.sale_entryApp.dto.ResponseDto;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.util.List;

@Setter
@Getter
@NoArgsConstructor
public class SaleOrderDTO {
    private int id;
    private LocalDate date;
    private double total;
    private String status;
    private String remarks;
    private Double discountPercent;
    private Double discountAmount;
    private Double paidAmount;
    private String paymentStatus;
    private Double remainingBalance;
    private String customerName;
    private List<OrderItemDTO> orderItemList;
}
