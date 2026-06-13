package com.example.sale_entryApp.mapper;

import com.example.sale_entryApp.dto.ResponseDto.OrderItemDTO;
import com.example.sale_entryApp.entity.OrderItem;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderItemMapper {
    @BeanMapping(ignoreByDefault = true)
    @Mapping(source="id",target="id")
    @Mapping(source="name",target="name")
    @Mapping(source="quantity",target="quantity")
    @Mapping(source="price",target="price")
    @Mapping(source="subtotal",target="subtotal")
    OrderItemDTO orderItemDto(OrderItem orderItem);
}
