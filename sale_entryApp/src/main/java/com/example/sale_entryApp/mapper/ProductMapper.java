package com.example.sale_entryApp.mapper;

import com.example.sale_entryApp.dto.RequestDto.ProductRequestDto;
import com.example.sale_entryApp.dto.ResponseDto.ProductDTO;
import com.example.sale_entryApp.entity.Product;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    //DTO->Entity
    @Mapping(source="itemWeight",target="itemWeight")
    Product toEntity(ProductRequestDto productRequestDto);
    //Entity->DTO
    @BeanMapping(ignoreByDefault = true)
    @Mapping(source="name",target="name")
    @Mapping(source="itemWeight",target="itemWeight")
    @Mapping(source="price",target="price")
    @Mapping(source="stockQuantity",target="stockQuantity")
    ProductDTO productDto(Product product);
    List<ProductDTO> toDtoProductsList(List<Product> productList);
}
