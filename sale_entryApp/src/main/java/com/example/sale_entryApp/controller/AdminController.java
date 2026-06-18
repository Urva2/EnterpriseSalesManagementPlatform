package com.example.sale_entryApp.controller;

import com.example.sale_entryApp.dto.RequestDto.AdminRequestDto;
import com.example.sale_entryApp.dto.ResponseDto.AdminDTO;
import com.example.sale_entryApp.dto.ResponseDto.SaleOrderDTO;
import com.example.sale_entryApp.entity.Admin;
import com.example.sale_entryApp.service.AdminService;
import com.example.sale_entryApp.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private AdminService adminService;

    @Autowired
    private ReportService reportService;

    @PostMapping("/register")
    public ResponseEntity<?> addAdmin(@Valid @RequestBody AdminRequestDto admin){
        try{
            System.out.println(admin.getName());
            AdminDTO savesAdmin=adminService.createAdmin(admin);
            return ResponseEntity.status(HttpStatus.CREATED).body(savesAdmin);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    //15/6/2026 name : Nidhi
    @GetMapping("/customers/{id}/history")
    public ResponseEntity<List<SaleOrderDTO>> getCustomerPurchaseHistory(@PathVariable int id)
    {
        return ResponseEntity.ok(reportService.getCustomerPurchaseHistory(id));
    }
}
