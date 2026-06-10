package com.example.sale_entryApp.error;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.sql.Time;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@AllArgsConstructor
public class ErrorResponse {
    LocalDateTime timeStamp;
    String msg;
    HttpStatus status;
    public ErrorResponse(){
            this.timeStamp=LocalDateTime.now();
    }
}
