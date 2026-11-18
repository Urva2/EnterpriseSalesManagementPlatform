package com.example.sale_entryApp.service;

import com.example.sale_entryApp.dto.RequestDto.PaymentRequestDto;
import com.example.sale_entryApp.dto.ResponseDto.OrderPaymentSummaryDto;
import com.example.sale_entryApp.dto.ResponseDto.PaymentResponseDto;
import com.example.sale_entryApp.entity.Payment;
import com.example.sale_entryApp.entity.PaymentStatus;
import com.example.sale_entryApp.entity.SaleOrder;
import com.example.sale_entryApp.repository.PaymentRepo;
import com.example.sale_entryApp.repository.SaleOrderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepo paymentRepo;

    @Autowired
    private SaleOrderRepo saleOrderRepo;

    @Transactional
    public PaymentResponseDto recordPayment(int orderId, PaymentRequestDto requestDto) {
        SaleOrder order = saleOrderRepo.findById(orderId);
        if (order == null) {
            throw new RuntimeException("Order not found with ID: " + orderId);
        }

        if ("CANCELLED".equalsIgnoreCase(order.getStatus())) {
            throw new RuntimeException("Cannot accept payment for a cancelled order.");
        }

        if (requestDto.getAmount() <= 0) {
            throw new RuntimeException("Payment amount must be greater than 0.");
        }

        double currentPaid = order.getPaidAmount() != null ? order.getPaidAmount() : 0.0;
        double remaining = Math.max(0.0, order.getTotal() - currentPaid);

        if (requestDto.getAmount() > remaining + 0.01) {
            throw new RuntimeException("Payment amount (" + requestDto.getAmount() + ") exceeds remaining balance (" + remaining + ")");
        }

        // Create Payment entity
        Payment payment = new Payment();
        payment.setSaleOrder(order);
        payment.setAmount(requestDto.getAmount());
        payment.setPaymentMethod(requestDto.getPaymentMethod());
        payment.setPaymentStatus(PaymentStatus.COMPLETED);
        payment.setTransactionReference(requestDto.getTransactionReference());
        payment.setPaymentDate(LocalDateTime.now());
        payment.setRemarks(requestDto.getRemarks());

        Payment savedPayment = paymentRepo.save(payment);

        // Update SaleOrder paid amount and payment status
        double newPaid = currentPaid + requestDto.getAmount();
        order.setPaidAmount(newPaid);

        if (newPaid >= order.getTotal() - 0.01) {
            order.setPaymentStatus("PAID");
        } else if (newPaid > 0) {
            order.setPaymentStatus("PARTIALLY_PAID");
        } else {
            order.setPaymentStatus("UNPAID");
        }

        saleOrderRepo.save(order);

        return mapToDto(savedPayment, order);
    }

    @Transactional
    public PaymentResponseDto refundPayment(Long paymentId, String reason) {
        Payment payment = paymentRepo.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with ID: " + paymentId));

        if (payment.getPaymentStatus() != PaymentStatus.COMPLETED) {
            throw new RuntimeException("Only COMPLETED payments can be refunded. Current status: " + payment.getPaymentStatus());
        }

        payment.setPaymentStatus(PaymentStatus.REFUNDED);
        if (reason != null && !reason.trim().isEmpty()) {
            String existingRemarks = payment.getRemarks() != null ? payment.getRemarks() + " | " : "";
            payment.setRemarks(existingRemarks + "Refund Reason: " + reason);
        }

        Payment savedPayment = paymentRepo.save(payment);

        SaleOrder order = payment.getSaleOrder();
        if (order != null) {
            double currentPaid = order.getPaidAmount() != null ? order.getPaidAmount() : 0.0;
            double newPaid = Math.max(0.0, currentPaid - payment.getAmount());
            order.setPaidAmount(newPaid);

            if (newPaid <= 0.01) {
                order.setPaymentStatus("REFUNDED");
            } else if (newPaid < order.getTotal() - 0.01) {
                order.setPaymentStatus("PARTIALLY_PAID");
            } else {
                order.setPaymentStatus("PAID");
            }
            saleOrderRepo.save(order);
        }

        return mapToDto(savedPayment, order);
    }

    @Transactional(readOnly = true)
    public List<PaymentResponseDto> getPaymentsForOrder(int orderId) {
        SaleOrder order = saleOrderRepo.findById(orderId);
        if (order == null) {
            throw new RuntimeException("Order not found with ID: " + orderId);
        }

        List<Payment> payments = paymentRepo.findBySaleOrderIdOrderByPaymentDateDesc(orderId);
        return payments.stream().map(p -> mapToDto(p, order)).toList();
    }

    @Transactional(readOnly = true)
    public OrderPaymentSummaryDto getOrderPaymentSummary(int orderId) {
        SaleOrder order = saleOrderRepo.findById(orderId);
        if (order == null) {
            throw new RuntimeException("Order not found with ID: " + orderId);
        }

        double paid = order.getPaidAmount() != null ? order.getPaidAmount() : 0.0;
        double remaining = Math.max(0.0, order.getTotal() - paid);
        List<PaymentResponseDto> payments = paymentRepo.findBySaleOrderIdOrderByPaymentDateDesc(orderId)
                .stream()
                .map(p -> mapToDto(p, order))
                .toList();

        return new OrderPaymentSummaryDto(
                order.getId(),
                order.getTotal(),
                paid,
                remaining,
                order.getPaymentStatus() != null ? order.getPaymentStatus() : "UNPAID",
                payments
        );
    }

    private PaymentResponseDto mapToDto(Payment payment, SaleOrder order) {
        double total = order != null ? order.getTotal() : 0.0;
        double paid = order != null && order.getPaidAmount() != null ? order.getPaidAmount() : 0.0;
        double remaining = Math.max(0.0, total - paid);

        return new PaymentResponseDto(
                payment.getId(),
                order != null ? order.getId() : 0,
                payment.getAmount(),
                payment.getPaymentMethod(),
                payment.getPaymentStatus(),
                payment.getTransactionReference(),
                payment.getPaymentDate(),
                payment.getRemarks(),
                total,
                paid,
                remaining
        );
    }
}

