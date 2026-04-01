package com.example.sale_entryApp.mapper;

import com.example.sale_entryApp.dto.RequestDto.SalesPersonRequestDto;
import com.example.sale_entryApp.dto.ResponseDto.SalesPersonDTO;
import com.example.sale_entryApp.entity.SalesPerson;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-27T19:36:55+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class SalesPersonMapperImpl implements SalesPersonMapper {

    @Override
    public SalesPerson toEntity(SalesPersonRequestDto salesPersonRequestDto) {
        if ( salesPersonRequestDto == null ) {
            return null;
        }

        SalesPerson salesPerson = new SalesPerson();

        salesPerson.setName( salesPersonRequestDto.getName() );
        salesPerson.setEmail( salesPersonRequestDto.getEmail() );
        salesPerson.setPassword( salesPersonRequestDto.getPassword() );
        salesPerson.setPhoneno( salesPersonRequestDto.getPhoneno() );

        salesPerson.setRole( "SALESPERSON" );

        return salesPerson;
    }

    @Override
    public SalesPersonDTO salesPersonDto(SalesPerson salesPerson) {
        if ( salesPerson == null ) {
            return null;
        }

        SalesPersonDTO salesPersonDTO = new SalesPersonDTO();

        salesPersonDTO.setName( salesPerson.getName() );
        salesPersonDTO.setEmail( salesPerson.getEmail() );
        salesPersonDTO.setPhoneno( salesPerson.getPhoneno() );
        salesPersonDTO.setRole( salesPerson.getRole() );

        return salesPersonDTO;
    }

    @Override
    public List<SalesPersonDTO> toDtoSalesPeopleList(List<SalesPerson> salesPersonList) {
        if ( salesPersonList == null ) {
            return null;
        }

        List<SalesPersonDTO> list = new ArrayList<SalesPersonDTO>( salesPersonList.size() );
        for ( SalesPerson salesPerson : salesPersonList ) {
            list.add( salesPersonDto( salesPerson ) );
        }

        return list;
    }
}
