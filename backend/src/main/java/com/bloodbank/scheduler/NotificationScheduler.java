package com.bloodbank.scheduler;

import com.bloodbank.entity.User;
import com.bloodbank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class NotificationScheduler {

    @Autowired
    private UserRepository userRepository;

    // Run every day at 10 AM (cron = "0 0 10 * * ?")
    // For testing purposes, we can run it more frequently or just keep the cron
    @Scheduled(cron = "0 0 10 * * ?")
    public void sendDonationReminders() {
        System.out.println("Running daily donation reminder check...");
        
        LocalDate threeMonthsAgo = LocalDate.now().minusMonths(3);
        
        List<User> eligibleDonors = userRepository.findAll().stream()
                .filter(u -> u.getLastDonationDate() != null)
                .filter(u -> u.getLastDonationDate().isBefore(threeMonthsAgo) || u.getLastDonationDate().isEqual(threeMonthsAgo))
                .collect(Collectors.toList());
                
        for (User donor : eligibleDonors) {
            mockSendNotification(donor);
        }
    }
    
    private void mockSendNotification(User user) {
        // Here we would integrate with a communication API (e.g., Twilio, SendGrid)
        System.out.println("MOCK COMM API: Sending notification to " + user.getUsername() + 
                " at " + user.getEmail() + 
                ". It has been 3 months since your last donation. You are eligible to donate again!");
    }
}
