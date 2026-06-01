package com.example.sale_entryApp.mapper;

import com.example.sale_entryApp.dto.ResponseDto.OrderItemDTO;
import com.example.sale_entryApp.entity.OrderItem;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-06-01T15:05:46+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class OrderItemMapperImpl implements OrderItemMapper {

    @Override
    public OrderItemDTO orderItemDto(OrderItem orderItem) {
        if ( orderItem == null ) {
            return null;
        }

        OrderItemDTO orderItemDTO = new OrderItemDTO();

        orderItemDTO.setName( orderItem.getName() );
        orderItemDTO.setQuantity( orderItem.getQuantity() );
        orderItemDTO.setPrice( orderItem.getPrice() );
        orderItemDTO.setSubtotal( orderItem.getSubtotal() );

        return orderItemDTO;
    }
}
