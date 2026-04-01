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
    private LocalDate date;
    private double total;
    private String status;
    private List<OrderItemDTO> orderItemList;
}
