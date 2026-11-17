package com.example.sale_entryApp.error;

public class InvalidTokenException extends BusinessException {
    public InvalidTokenException(String message) {
        super(message, "INVALID_REFRESH_TOKEN");
    }
}
