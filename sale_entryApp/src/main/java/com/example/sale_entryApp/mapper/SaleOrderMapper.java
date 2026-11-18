package com.example.sale_entryApp.mapper;

import com.example.sale_entryApp.dto.ResponseDto.SaleOrderDTO;
import com.example.sale_entryApp.entity.SaleOrder;
import org.mapstruct.AfterMapping;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SaleOrderMapper {
    //Entity->DTO
    @BeanMapping(ignoreByDefault = true)
    @Mapping(source="id",target="id")
    @Mapping(source="date",target="date")
    @Mapping(source="total",target="total")
    @Mapping(source="status",target="status")
    @Mapping(source="remarks",target="remarks")
    @Mapping(source="discountPercent",target="discountPercent")
    @Mapping(source="discountAmount",target="discountAmount")
    @Mapping(source="paidAmount",target="paidAmount")
    @Mapping(source="paymentStatus",target="paymentStatus")
    @Mapping(source="customer.name",target="customerName")
    @Mapping(source = "orderItemList",target = "orderItemList")
    SaleOrderDTO saleOrderDto(SaleOrder saleOrder);
    List<SaleOrderDTO> toDtoSaleOrderList(List<SaleOrder> saleOrders);

    @AfterMapping
    default void calculateRemainingBalance(SaleOrder saleOrder, @MappingTarget SaleOrderDTO dto) {
        if (dto != null) {
            double paid = saleOrder.getPaidAmount() != null ? saleOrder.getPaidAmount() : 0.0;
            dto.setPaidAmount(paid);
            dto.setRemainingBalance(Math.max(0.0, saleOrder.getTotal() - paid));
            if (dto.getPaymentStatus() == null) {
                dto.setPaymentStatus("UNPAID");
            }
        }
    }
}
