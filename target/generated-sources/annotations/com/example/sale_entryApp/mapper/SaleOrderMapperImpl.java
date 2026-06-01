package com.example.sale_entryApp.mapper;

import com.example.sale_entryApp.dto.ResponseDto.OrderItemDTO;
import com.example.sale_entryApp.dto.ResponseDto.SaleOrderDTO;
import com.example.sale_entryApp.entity.OrderItem;
import com.example.sale_entryApp.entity.SaleOrder;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-06-01T15:05:46+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class SaleOrderMapperImpl implements SaleOrderMapper {

    @Override
    public SaleOrderDTO saleOrderDto(SaleOrder saleOrder) {
        if ( saleOrder == null ) {
            return null;
        }

        SaleOrderDTO saleOrderDTO = new SaleOrderDTO();

        saleOrderDTO.setDate( saleOrder.getDate() );
        saleOrderDTO.setTotal( saleOrder.getTotal() );
        saleOrderDTO.setStatus( saleOrder.getStatus() );
        saleOrderDTO.setOrderItemList( orderItemListToOrderItemDTOList( saleOrder.getOrderItemList() ) );

        return saleOrderDTO;
    }

    @Override
    public List<SaleOrderDTO> toDtoSaleOrderList(List<SaleOrder> saleOrders) {
        if ( saleOrders == null ) {
            return null;
        }

        List<SaleOrderDTO> list = new ArrayList<SaleOrderDTO>( saleOrders.size() );
        for ( SaleOrder saleOrder : saleOrders ) {
            list.add( saleOrderDto( saleOrder ) );
        }

        return list;
    }

    protected OrderItemDTO orderItemToOrderItemDTO(OrderItem orderItem) {
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

    protected List<OrderItemDTO> orderItemListToOrderItemDTOList(List<OrderItem> list) {
        if ( list == null ) {
            return null;
        }

        List<OrderItemDTO> list1 = new ArrayList<OrderItemDTO>( list.size() );
        for ( OrderItem orderItem : list ) {
            list1.add( orderItemToOrderItemDTO( orderItem ) );
        }

        return list1;
    }
}
