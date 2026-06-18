package com.example.sale_entryApp.scheduler;

import com.example.sale_entryApp.entity.SaleOrder;
import com.example.sale_entryApp.repository.SaleOrderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class MidnightCleanupScheduler {

    @Autowired
    private SaleOrderRepo saleOrderRepo;

    // Runs every day at midnight
    @Scheduled(cron = "0 0 0 * * ?")
    public void cleanupAbandonedCarts() {
        LocalDate yesterday = LocalDate.now().minusDays(1);

        // Find all DRAFT orders older than 24 hours
        List<SaleOrder> oldDrafts = saleOrderRepo.findByStatusAndDateBefore("DRAFT", yesterday);
        
        // Find all PENDING orders older than 24 hours
        List<SaleOrder> oldPendings = saleOrderRepo.findByStatusAndDateBefore("Pending", yesterday);

        if (!oldDrafts.isEmpty()) {
            oldDrafts.forEach(order -> order.setStatus("CANCELLED"));
            saleOrderRepo.saveAll(oldDrafts);
            System.out.println("Cancelled " + oldDrafts.size() + " abandoned DRAFT orders.");
        }

        if (!oldPendings.isEmpty()) {
            oldPendings.forEach(order -> order.setStatus("CANCELLED"));
            saleOrderRepo.saveAll(oldPendings);
            System.out.println("Cancelled " + oldPendings.size() + " abandoned PENDING orders.");
        }
    }
}
