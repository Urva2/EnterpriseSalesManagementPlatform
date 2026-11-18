package com.example.sale_entryApp.controller;

import com.example.sale_entryApp.dto.RequestDto.PaymentRequestDto;
import com.example.sale_entryApp.dto.ResponseDto.OrderPaymentSummaryDto;
import com.example.sale_entryApp.dto.ResponseDto.PaymentResponseDto;
import com.example.sale_entryApp.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/orders/{orderId}")
    public ResponseEntity<?> recordPayment(@PathVariable int orderId, @Valid @RequestBody PaymentRequestDto requestDto) {
        try {
            PaymentResponseDto response = paymentService.recordPayment(orderId, requestDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<List<PaymentResponseDto>> getPaymentsForOrder(@PathVariable int orderId) {
        return ResponseEntity.ok(paymentService.getPaymentsForOrder(orderId));
    }

    @GetMapping("/orders/{orderId}/summary")
    public ResponseEntity<OrderPaymentSummaryDto> getOrderPaymentSummary(@PathVariable int orderId) {
        return ResponseEntity.ok(paymentService.getOrderPaymentSummary(orderId));
    }

    @PostMapping("/{paymentId}/refund")
    public ResponseEntity<?> refundPayment(@PathVariable Long paymentId, @RequestParam(required = false) String reason) {
        try {
            PaymentResponseDto response = paymentService.refundPayment(paymentId, reason);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}

