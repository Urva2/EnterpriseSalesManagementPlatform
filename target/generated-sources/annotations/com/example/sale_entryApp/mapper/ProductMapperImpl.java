package com.example.sale_entryApp.mapper;

import com.example.sale_entryApp.dto.RequestDto.ProductRequestDto;
import com.example.sale_entryApp.dto.ResponseDto.ProductDTO;
import com.example.sale_entryApp.entity.Product;
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
public class ProductMapperImpl implements ProductMapper {

    @Override
    public Product toEntity(ProductRequestDto productRequestDto) {
        if ( productRequestDto == null ) {
            return null;
        }

        Product product = new Product();

        product.setItemWeight( productRequestDto.getItemWeight() );
        product.setName( productRequestDto.getName() );
        product.setPrice( productRequestDto.getPrice() );
        product.setStockQuantity( productRequestDto.getStockQuantity() );

        return product;
    }

    @Override
    public ProductDTO productDto(Product product) {
        if ( product == null ) {
            return null;
        }

        ProductDTO productDTO = new ProductDTO();

        productDTO.setName( product.getName() );
        productDTO.setItemWeight( product.getItemWeight() );
        productDTO.setPrice( product.getPrice() );
        productDTO.setStockQuantity( product.getStockQuantity() );

        return productDTO;
    }

    @Override
    public List<ProductDTO> toDtoProductsList(List<Product> productList) {
        if ( productList == null ) {
            return null;
        }

        List<ProductDTO> list = new ArrayList<ProductDTO>( productList.size() );
        for ( Product product : productList ) {
            list.add( productDto( product ) );
        }

        return list;
    }
}
