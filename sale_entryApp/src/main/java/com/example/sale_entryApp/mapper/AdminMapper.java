package com.example.sale_entryApp.mapper;

import com.example.sale_entryApp.dto.RequestDto.AdminRequestDto;
import com.example.sale_entryApp.dto.ResponseDto.AdminDTO;
import com.example.sale_entryApp.entity.Admin;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import javax.swing.text.html.parser.Entity;

@Mapper(componentModel="spring")        //Make it as Bean
public interface AdminMapper { // here we only implement Response DTO ,request DTO is Not Done Yet.

    //DTO->Entity
    @Mapping(target = "role",constant = "ADMIN")
    @Mapping(source="email",target="email")
    Admin toEntity(AdminRequestDto adminRequestDto);

    //Entity->DTO
    @BeanMapping(ignoreByDefault = true)
    @Mapping(source="name",target="name")       //It's like admin.getName(),adminDto.setName()
    @Mapping(source="email",target="email")
    @Mapping(source="role",target="role")
    AdminDTO adminDto(Admin admin);
}
