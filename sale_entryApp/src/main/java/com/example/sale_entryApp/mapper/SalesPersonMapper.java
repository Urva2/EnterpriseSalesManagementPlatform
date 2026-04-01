package com.example.sale_entryApp.mapper;

import com.example.sale_entryApp.dto.RequestDto.SalesPersonRequestDto;
import com.example.sale_entryApp.dto.ResponseDto.SalesPersonDTO;
import com.example.sale_entryApp.entity.SalesPerson;
import com.example.sale_entryApp.repository.SalesPersonRepo;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SalesPersonMapper {
    //DTO->Entity
    @Mapping(target = "role", constant = "SALESPERSON")
    SalesPerson toEntity(SalesPersonRequestDto salesPersonRequestDto);
    //Entity->DTO
    @BeanMapping(ignoreByDefault = true)
    @Mapping(source="name",target="name")
    @Mapping(source="email",target="email")
    @Mapping(source="phoneno",target="phoneno")
    @Mapping(source="role",target="role")
    SalesPersonDTO salesPersonDto(SalesPerson salesPerson);
    List<SalesPersonDTO> toDtoSalesPeopleList(List<SalesPerson> salesPersonList);
}
