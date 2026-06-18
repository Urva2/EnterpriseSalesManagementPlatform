package com.example.sale_entryApp.service;

import com.example.sale_entryApp.dto.ResponseDto.SaleOrderDTO;
import com.example.sale_entryApp.dto.ResponseDto.SalesPersonDTO;
import com.example.sale_entryApp.dto.SalesPersonPerformanceDto;
import com.example.sale_entryApp.dto.SalesReportDto;
import com.example.sale_entryApp.dto.TopProductDto;
import com.example.sale_entryApp.entity.Customer;
import com.example.sale_entryApp.entity.SaleOrder;
import com.example.sale_entryApp.mapper.SaleOrderMapper;
import com.example.sale_entryApp.repository.CustomerRepo;
import com.example.sale_entryApp.repository.OrderItemRepo;
import com.example.sale_entryApp.repository.SaleOrderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReportService {

    @Autowired
    private SaleOrderRepo saleOrderRepo;

    @Autowired
    private OrderItemRepo orderItemRepo;

    @Autowired
    private SaleOrderMapper saleOrderMapper;

    @Autowired
    private CustomerRepo customerRepo;
    public SalesReportDto getSalesReport(LocalDate from, LocalDate to)
    {
        Double revenue = saleOrderRepo.getRevenueBetweenDates(from,to);
        Long orders = saleOrderRepo.getOrderCountBetweenDates(from,to);
        Double averageOrderValue = saleOrderRepo.getAverageOrderValueBetweenDates(from, to);

        SalesReportDto dto = new SalesReportDto();

        dto.setFrom(from);
        dto.setTo(to);
        dto.setTotalRevenue(revenue);
        dto.setTotalOrders(orders);
        dto.setAverageOrderValue(averageOrderValue);

        return dto;
    }

    public List<TopProductDto> getTopProducts(int limit)
    {
        Pageable pageable = PageRequest.of(0,limit);
        List<Object[]> results =
                orderItemRepo.getTopSellingProducts(pageable);

        List<TopProductDto> response =
                new ArrayList<>();

        for(Object[] row : results)
        {
            TopProductDto dto =
                    new TopProductDto();

            dto.setProductName((String) row[0]);

            dto.setQuantitySold(
                    ((Number) row[1]).longValue()
            );

            response.add(dto);
        }

        return response;
    }

    public List<SalesPersonPerformanceDto> getSalesPersonRaking() {
        List<Object[]> results = saleOrderRepo.getSalesPersonRanking();
        List<SalesPersonPerformanceDto> response = new ArrayList<>();
        int rank = 1;
        for(Object[] row : results)
        {
            SalesPersonPerformanceDto dto = new SalesPersonPerformanceDto();
            dto.setRank(rank++);
            dto.setSalesPersonName((String)row[0]);
            dto.setOrders(((Number) row[1]).longValue());
            dto.setTotalRevenue(((Number) row[2]).doubleValue());
            response.add(dto);
        }
    return response;
    }

    public List<SaleOrderDTO> getCustomerPurchaseHistory(int id)
    {
        Customer customer =
                customerRepo.findById(id);

        if (customer == null)
        {
            throw new RuntimeException(
                    "Customer not found with id: " + id
            );
        }

        List<SaleOrder> orders =
                saleOrderRepo.findByCustomerId(id);

        return orders.stream()
                .map(saleOrderMapper::saleOrderDto)
                .toList();
    }
}
