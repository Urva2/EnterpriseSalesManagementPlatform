package com.example.sale_entryApp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SaleEntryAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(SaleEntryAppApplication.class, args);
	}

}
