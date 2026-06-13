package com.example.sale_entryApp.controller;

import com.example.sale_entryApp.dto.RequestDto.SalesPersonRequestDto;
import com.example.sale_entryApp.dto.RequestDto.UpdateProfileRequestDto;
import com.example.sale_entryApp.dto.ResponseDto.SalesPersonDTO;
import com.example.sale_entryApp.service.SalesPersonService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/salesperson")
public class SalesPersonController {
    @Autowired
    private SalesPersonService salesPersonService;

    @PostMapping("/register")
    public ResponseEntity<?> addSalesperson(@Valid @RequestBody SalesPersonRequestDto salesPerson)
    {
        try{
            System.out.println(salesPerson.getName());
            SalesPersonDTO savedSp=salesPersonService.createSalesPerson(salesPerson);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedSp);
            } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            }
    }

    //10/6/26 name : Nidhi
    @GetMapping("/me")
    public ResponseEntity<?> viewMyProfile()
    {
        try {
            SalesPersonDTO salesPersonDTO = salesPersonService.getMyProfile();
            return ResponseEntity.status(HttpStatus.OK).body(salesPersonDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    //10/6/26 name : Nidhi
    @PatchMapping("/me")
    public ResponseEntity<?> updateMyProfile(@RequestBody UpdateProfileRequestDto dto)
    {
        try
        {
            SalesPersonDTO salesPersonDTO = salesPersonService.updateMyProfile(dto);
            return ResponseEntity.status(HttpStatus.OK).body(salesPersonDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    //Urva 12-06
    @GetMapping
    public ResponseEntity<Page<SalesPersonDTO>> getAllSalesPersons(
            @PageableDefault(page = 0, size = 10) Pageable pageable) { //Pageable Also handles the -ve page and size validation

        Page<SalesPersonDTO> salesPersons = salesPersonService.getAllSalesPersons(pageable);
        return ResponseEntity.ok(salesPersons);
    }
    @GetMapping("/search")
    public ResponseEntity<Page<SalesPersonDTO>> searchSalesPersonsByName(
            @RequestParam(required = false) String keyword,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {

        Page<SalesPersonDTO> salesPersons = salesPersonService.searchSalesPersonsByName(keyword, pageable);
        return ResponseEntity.ok(salesPersons);
    }
}
