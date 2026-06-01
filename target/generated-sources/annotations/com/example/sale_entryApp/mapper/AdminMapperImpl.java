package com.example.sale_entryApp.mapper;

import com.example.sale_entryApp.dto.RequestDto.AdminRequestDto;
import com.example.sale_entryApp.dto.ResponseDto.AdminDTO;
import com.example.sale_entryApp.entity.Admin;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-06-01T15:05:46+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class AdminMapperImpl implements AdminMapper {

    @Override
    public Admin toEntity(AdminRequestDto adminRequestDto) {
        if ( adminRequestDto == null ) {
            return null;
        }

        Admin admin = new Admin();

        admin.setEmail( adminRequestDto.getEmail() );
        admin.setName( adminRequestDto.getName() );
        admin.setPassword( adminRequestDto.getPassword() );

        admin.setRole( "ADMIN" );

        return admin;
    }

    @Override
    public AdminDTO adminDto(Admin admin) {
        if ( admin == null ) {
            return null;
        }

        AdminDTO adminDTO = new AdminDTO();

        adminDTO.setName( admin.getName() );
        adminDTO.setEmail( admin.getEmail() );
        adminDTO.setRole( admin.getRole() );

        return adminDTO;
    }
}
