package com.example.sale_entryApp.entity;

public enum OrderStatus {
    PENDING,
    CONFIRMED,
    PROCESSING,
    DELIVERED,
    CANCELLED;

    public static OrderStatus fromString(String status) {
        if (status == null) {
            throw new RuntimeException("Status cannot be null");
        }
        try {
            return OrderStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Unknown order status: " + status + ". Allowed values: PENDING, CONFIRMED, PROCESSING, DELIVERED, CANCELLED");
        }
    }
}

