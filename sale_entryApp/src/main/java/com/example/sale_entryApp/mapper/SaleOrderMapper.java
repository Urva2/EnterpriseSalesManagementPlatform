package com.example.sale_entryApp.mapper;

import com.example.sale_entryApp.dto.ResponseDto.SaleOrderDTO;
import com.example.sale_entryApp.entity.SaleOrder;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SaleOrderMapper {
    //Entity->DTO
    @BeanMapping(ignoreByDefault = true)
    @Mapping(source="id",target="id")
    @Mapping(source="date",target="date")
    @Mapping(source="total",target="total")
    @Mapping(source="status",target="status")
    @Mapping(source="customer.name",target="customerName")
    @Mapping(source = "orderItemList",target = "orderItemList")
    SaleOrderDTO saleOrderDto(SaleOrder saleOrder);
    List<SaleOrderDTO> toDtoSaleOrderList(List<SaleOrder> saleOrders);
}
