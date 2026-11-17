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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SalesPersonService {
    @Autowired
    private SalesPersonRepo salesPersonRepo;
    @Autowired
    private SaleOrderRepo saleOrderRepo;
    @Autowired
    private SalesPersonMapper salesPersonMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public SalesPersonDTO createSalesPerson(SalesPersonRequestDto dto)
    {
        SalesPerson salesPerson = salesPersonMapper.toEntity(dto);
        SalesPerson existing = salesPersonRepo.findByEmail(salesPerson.getEmail());
        if(existing != null)
        {
            throw new RuntimeException("Email Already Exist:" + existing.getEmail());
        }

        String encoded = passwordEncoder.encode(salesPerson.getPassword());
        salesPerson.setPassword(encoded);
        salesPerson.setIsActive(true);
        SalesPerson saved = salesPersonRepo.save(salesPerson);
        return salesPersonMapper.salesPersonDto(saved);
    }

    @Transactional(readOnly = true)
    public SalesPersonDTO findSalespersonByid(int id){
        SalesPerson salesPerson = salesPersonRepo.findById(id);
        if(salesPerson != null){
            return salesPersonMapper.salesPersonDto(salesPerson);
        }
        throw new RuntimeException("SalesPerson Not exist with Id:" + id);
    }

    @Transactional(readOnly = true)
    public Page<SalesPersonDTO> getAllSalesPersons(Pageable pageable) {
        Page<SalesPerson> salesPeoplePage = salesPersonRepo.findAll(pageable);
        return salesPeoplePage.map(salesPersonMapper::salesPersonDto);
    }

    @Transactional(readOnly = true)
    public Page<SalesPersonDTO> searchSalesPersonsByName(String name, Pageable pageable) {
        Page<SalesPerson> salesPeoplePage;
        if (name != null && !name.trim().isEmpty()) {
            salesPeoplePage = salesPersonRepo.findByNameContainingIgnoreCase(name, pageable);
        } else {
            salesPeoplePage = salesPersonRepo.findAll(pageable);
        }
        return salesPeoplePage.map(salesPersonMapper::salesPersonDto);
    }

    @Transactional(readOnly = true)
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
        SalesPerson salesPerson = salesPersonRepo.findById(id);
        if(salesPerson == null)
        {
            throw new RuntimeException("SalesPerson not found with id: " + id);
        }
        return salesPersonMapper.salesPersonDto(salesPerson);
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
        SalesPerson salesPerson = salesPersonRepo.findById(id);
        if (salesPerson == null) {
            throw new RuntimeException("SalesPerson not found with id: " + id);
        }
        String name = updateProfileRequestDto.getName();
        String phone = updateProfileRequestDto.getPhone();
        if(name != null && !name.isBlank())
        {
           salesPerson.setName(name);
        }
        if(phone != null && !phone.isBlank())
        {
            salesPerson.setPhoneno(phone);
        }
        if (name == null && phone == null) { //if there are no fields
            throw new RuntimeException("No update fields provided.");
        }
        SalesPerson updated = salesPersonRepo.save(salesPerson);
        return salesPersonMapper.salesPersonDto(updated);
    }

    @Transactional
    public SalesPersonDTO deactivateSalesPerson(int id) {
        SalesPerson salesPerson = salesPersonRepo.findById(id);
        if (salesPerson == null) {
            throw new RuntimeException("SalesPerson not found with id: " + id);
        }
        salesPerson.setIsActive(false);
        salesPersonRepo.save(salesPerson);
        return salesPersonMapper.salesPersonDto(salesPerson);
    }

    @Transactional
    public SalesPersonDTO activateSalesPerson(int id) {
        SalesPerson salesPerson = salesPersonRepo.findById(id);
        if (salesPerson == null) {
            throw new RuntimeException("SalesPerson not found with id: " + id);
        }
        salesPerson.setIsActive(true);
        salesPersonRepo.save(salesPerson);
        return salesPersonMapper.salesPersonDto(salesPerson);
    }
}
