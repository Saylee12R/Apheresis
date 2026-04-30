package com.bloodbank.controller;

import com.bloodbank.entity.Donation;
import com.bloodbank.entity.User;
import com.bloodbank.repository.DonationRepository;
import com.bloodbank.repository.UserRepository;
import com.bloodbank.util.PdfGenerationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private PdfGenerationUtil pdfGenerationUtil;

    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(Authentication authentication) {
        return userRepository.findByUsername(authentication.getName())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/donate")
    public ResponseEntity<?> logDonation(@RequestBody Donation donation, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (user == null) return ResponseEntity.badRequest().build();

        donation.setDonor(user);
        donation.setDonationDate(LocalDate.now());
        
        // Calculate next eligible date based on component
        int daysToWait = 56; // default for whole blood / rbc
        if (donation.getBloodComponentType() != null) {
            switch (donation.getBloodComponentType().toLowerCase()) {
                case "platelets": daysToWait = 7; break;
                case "plasma": daysToWait = 28; break;
                case "super red": daysToWait = 112; break;
                case "rbc":
                case "whole blood":
                default: daysToWait = 56; break;
            }
        }
        donation.setNextEligibleDate(LocalDate.now().plusDays(daysToWait));
        
        user.setLastDonationDate(LocalDate.now());
        userRepository.save(user);

        return ResponseEntity.ok(donationRepository.save(donation));
    }

    @GetMapping("/donations")
    public List<Donation> getMyDonations(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        // Since Donation has User, we can query by User ID. But simplest is streaming or adding a repo method.
        // For simplicity, fetch all and filter or add method to repo.
        return donationRepository.findAll().stream()
                .filter(d -> d.getDonor().getId().equals(user.getId()))
                .toList();
    }

    @GetMapping("/donations/{id}/certificate")
    public ResponseEntity<byte[]> downloadCertificate(@PathVariable Long id, Authentication authentication) {
        Donation donation = donationRepository.findById(id).orElse(null);
        if (donation == null || !donation.getDonor().getUsername().equals(authentication.getName())) {
            return ResponseEntity.badRequest().build();
        }

        byte[] pdfBytes = pdfGenerationUtil.generateDonationCertificate(donation);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=certificate.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    // ---- Admin-only endpoints ----

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        // Strip passwords before sending
        users.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, Authentication authentication) {
        // Prevent admin from deleting themselves
        User self = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (self != null && self.getId().equals(id)) {
            return ResponseEntity.badRequest().body("Cannot delete your own account");
        }
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            return ResponseEntity.ok().body("User deleted");
        }).orElse(ResponseEntity.notFound().build());
    }
}
