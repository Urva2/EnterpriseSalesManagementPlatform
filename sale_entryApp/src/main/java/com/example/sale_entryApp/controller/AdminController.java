package com.example.sale_entryApp.controller;

import com.example.sale_entryApp.dto.RequestDto.AdminRequestDto;
import com.example.sale_entryApp.dto.ResponseDto.AdminDTO;
import com.example.sale_entryApp.dto.ResponseDto.ProductDTO;
import com.example.sale_entryApp.dto.ResponseDto.SaleOrderDTO;
import com.example.sale_entryApp.dto.ResponseDto.SalesPersonDTO;
import com.example.sale_entryApp.service.AdminService;
import com.example.sale_entryApp.service.ProductService;
import com.example.sale_entryApp.service.ReportService;
import com.example.sale_entryApp.service.SalesPersonService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
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

    @Autowired
    private ProductService productService;

    @Autowired
    private SalesPersonService salesPersonService;

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

    @GetMapping("/customers/{id}/history")
    public ResponseEntity<List<SaleOrderDTO>> getCustomerPurchaseHistory(@PathVariable int id)
    {
        return ResponseEntity.ok(reportService.getCustomerPurchaseHistory(id));
    }

    @GetMapping("/products/low-stock")
    public ResponseEntity<Page<ProductDTO>> getLowStockProducts(
            @RequestParam(defaultValue = "10") int threshold,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        return ResponseEntity.ok(productService.getLowStockProducts(threshold, pageable));
    }

    @PutMapping("/salespersons/{id}/deactivate")
    public ResponseEntity<?> deactivateSalesPerson(@PathVariable int id) {
        try {
            SalesPersonDTO dto = salesPersonService.deactivateSalesPerson(id);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/salespersons/{id}/activate")
    public ResponseEntity<?> activateSalesPerson(@PathVariable int id) {
        try {
            SalesPersonDTO dto = salesPersonService.activateSalesPerson(id);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
