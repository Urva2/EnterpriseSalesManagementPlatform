package com.example.sale_entryApp.controller;

import com.example.sale_entryApp.dto.ResponseDto.SalesPersonDTO;
import com.example.sale_entryApp.dto.SalesPersonPerformanceDto;
import com.example.sale_entryApp.dto.SalesReportDto;
import com.example.sale_entryApp.dto.TopProductDto;
import com.example.sale_entryApp.repository.SaleOrderRepo;
import com.example.sale_entryApp.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/admin/reports")
public class ReportController {

    @Autowired
    private SaleOrderRepo saleOrderRepo;

    @Autowired
    private ReportService reportService;

    //15/6/2026 name : Nidhi
    @GetMapping("/sales")
    public ResponseEntity<SalesReportDto> getSalesReport(@RequestParam LocalDate from,
                                                         @RequestParam LocalDate to)
    {
        return ResponseEntity.ok(reportService.getSalesReport(from,to));
    }

    //15/6/2026 name : Nidhi
    @GetMapping("/top-products")
    public ResponseEntity<List<TopProductDto>> getTopProducts(@RequestParam(defaultValue = "5")
                                                                  int limit)
    {
        return ResponseEntity.ok(reportService.getTopProducts(limit));
    }

    //15/6/2026 name : Nidhi
    @GetMapping("/salesperson-ranking")
    public ResponseEntity<List<SalesPersonPerformanceDto>> getSalesPersonRanking()
    {
        return ResponseEntity.ok(reportService.getSalesPersonRaking());
    }
}