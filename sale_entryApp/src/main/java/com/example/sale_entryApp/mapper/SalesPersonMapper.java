package com.example.sale_entryApp.mapper;

import com.example.sale_entryApp.dto.RequestDto.SalesPersonRequestDto;
import com.example.sale_entryApp.dto.ResponseDto.SalesPersonDTO;
import com.example.sale_entryApp.entity.SalesPerson;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SalesPersonMapper {
    @Mapping(target = "role", constant = "SALESPERSON")
    @Mapping(target = "isActive", constant = "true")
    SalesPerson toEntity(SalesPersonRequestDto salesPersonRequestDto);

    @BeanMapping(ignoreByDefault = true)
    @Mapping(source="id", target="id")
    @Mapping(source="name", target="name")
    @Mapping(source="email", target="email")
    @Mapping(source="phoneno", target="phoneno")
    @Mapping(source="role", target="role")
    @Mapping(source="isActive", target="isActive")
    SalesPersonDTO salesPersonDto(SalesPerson salesPerson);

    List<SalesPersonDTO> toDtoSalesPeopleList(List<SalesPerson> salesPersonList);
}
