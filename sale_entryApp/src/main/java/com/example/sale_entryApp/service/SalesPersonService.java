package com.example.sale_entryApp.service;

import com.example.sale_entryApp.dto.RequestDto.SalesPersonRequestDto;
import com.example.sale_entryApp.dto.RequestDto.UpdateProfileRequestDto;
import com.example.sale_entryApp.dto.ResponseDto.AuthenticatedUser;
import com.example.sale_entryApp.dto.ResponseDto.SalesPersonDTO;
import com.example.sale_entryApp.entity.SalesPerson;
import com.example.sale_entryApp.mapper.SalesPersonMapper;
import com.example.sale_entryApp.repository.SaleOrderRepo;
import com.example.sale_entryApp.repository.SalesPersonRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SalesPersonService {
    @Autowired
    private SalesPersonRepo salesPersonRepo;
    @Autowired
    private SaleOrderRepo saleOrderRepo;
    @Autowired
    private SalesPersonMapper salesPersonMapper;
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
@Autowired
PasswordEncoder passwordEncoder;
    public SalesPersonDTO createSalesPerson(SalesPersonRequestDto dto)
    {
        System.out.println(dto.getName());
        SalesPerson salesPerson=salesPersonMapper.toEntity(dto);
        System.out.println(salesPerson.getName());
        SalesPerson existing=salesPersonRepo.findByEmail(salesPerson.getEmail());
        if(existing!=null)
        {
            throw new RuntimeException("Email Already Exist:"+existing.getEmail());
        }

        String encoded = passwordEncoder.encode(salesPerson.getPassword());
        salesPerson.setPassword(encoded);
        SalesPerson saved=salesPersonRepo.save(salesPerson);
        return salesPersonMapper.salesPersonDto(saved);
    }
    public SalesPersonDTO findSalespersonByid(int id){
        SalesPerson salesPerson=salesPersonRepo.findById(id);
        if(salesPerson!=null){
            return salesPersonMapper.salesPersonDto(salesPerson);
        }
        throw new RuntimeException("SalesPerson Not exist with Id:"+id);
    }
    public List<SalesPersonDTO> findSalespersons(){
        List<SalesPerson> salesPeople=salesPersonRepo.findAll();
        if(!salesPeople.isEmpty()){
            return salesPersonMapper.toDtoSalesPeopleList(salesPeople);
        }
        throw new RuntimeException("Error!! SalesPeople Not Found.");
    }

    //Nidhi : 10/6/26
    public SalesPersonDTO getMyProfile()
    {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User is not authenticated.");
        }
        if (!(authentication.getPrincipal() instanceof AuthenticatedUser user)) {
            throw new RuntimeException("Invalid user principal.");
        }

        int id = Math.toIntExact(user.getId());
        SalesPerson salesPerson = salesPersonRepo.findById((int) id); //find the salesperson with that id
        if(salesPerson == null)
        {
            throw new RuntimeException("SalesPerson not found with id: " + id);
        }
        return salesPersonMapper.salesPersonDto(salesPerson); //return the details
    }

    //Nidhi 10/6/26
    public SalesPersonDTO updateMyProfile(UpdateProfileRequestDto updateProfileRequestDto)
    {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User is not authenticated.");
        }
        if (!(authentication.getPrincipal() instanceof AuthenticatedUser user)) {
            throw new RuntimeException("Invalid user principal.");
        }

        int id = Math.toIntExact(user.getId());
        SalesPerson salesPerson = salesPersonRepo.findById((int) id);
        if (salesPerson == null) {
            throw new RuntimeException("SalesPerson not found with id: " + id);
        }
        String name = updateProfileRequestDto.getName();
        String phone = updateProfileRequestDto.getPhone();
        if(name!=null && !name.isBlank())
        {
           salesPerson.setName(name);
        }
        if(phone!=null && !phone.isBlank())
        {
            salesPerson.setPhoneno(phone);
        }
        if (name == null && phone == null) { //if there are no fields
            throw new RuntimeException("No update fields provided.");
        }
        SalesPerson updated = salesPersonRepo.save(salesPerson);
        return salesPersonMapper.salesPersonDto(updated);
    }
}
