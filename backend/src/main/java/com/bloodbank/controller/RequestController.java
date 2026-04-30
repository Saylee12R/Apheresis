package com.bloodbank.controller;

import com.bloodbank.entity.BloodRequest;
import com.bloodbank.entity.User;
import com.bloodbank.repository.BloodRequestRepository;
import com.bloodbank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/requests")
public class RequestController {

    @Autowired
    private BloodRequestRepository requestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.bloodbank.repository.BloodUnitRepository bloodUnitRepository;

    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody BloodRequest request, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.badRequest().build();

        request.setRequester(user);
        request.setRequestDate(LocalDateTime.now());
        request.setStatus("PENDING");
        
        // Smart matching: Inventory first
        long availableUnits = bloodUnitRepository.countByBloodGroupAndBloodComponentTypeAndStatus(
                request.getBloodGroup(), request.getBloodComponentType(), "AVAILABLE");
                
        if (availableUnits >= request.getQuantityUnits()) {
            System.out.println("Smart Match: Inventory has enough units for request from " + username);
        } else {
            // Not enough in inventory, check Emergency Donors if urgent or critical
            if ("urgent".equalsIgnoreCase(request.getUrgency()) || "critical".equalsIgnoreCase(request.getUrgency())) {
                List<User> emergencyDonors = userRepository.findByIsEmergencyDonorAndBloodGroup(true, request.getBloodGroup());
                System.out.println("Smart Match: Shortage! Alerting " + emergencyDonors.size() + " emergency donors.");
            }
        }
        
        return ResponseEntity.ok(requestRepository.save(request));
    }

    @GetMapping("/my-requests")
    public List<BloodRequest> getMyRequests(Authentication authentication) {
        String username = authentication.getName();
        return requestRepository.findAll().stream()
                .filter(r -> r.getRequester().getUsername().equals(username))
                .collect(Collectors.toList());
    }

    // For Worker/Admin
    @GetMapping
    public List<BloodRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return requestRepository.findById(id).map(request -> {
            request.setStatus(status);
            
            // if fulfilled and requester is govt officer apply discount
            if ("FULFILLED".equals(status)) {
                User u = request.getRequester();
                if (u.isGovtOfficer()) {
                    // Apply 20% discount logic here, mock printing
                    System.out.println("20% discount applied for govt officer: " + u.getUsername());
                }
            }
            return ResponseEntity.ok(requestRepository.save(request));
        }).orElse(ResponseEntity.notFound().build());
    }
}
