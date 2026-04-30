package com.bloodbank.controller;

import com.bloodbank.entity.CampRequest;
import com.bloodbank.repository.CampRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/camp-requests")
public class CampRequestController {

    @Autowired
    private CampRequestRepository campRequestRepository;

    // Public — anyone can submit a camp request (no auth needed)
    @PostMapping
    public ResponseEntity<CampRequest> submit(@RequestBody CampRequest request) {
        return ResponseEntity.ok(campRequestRepository.save(request));
    }

    // Admin only — list all submissions
    @GetMapping
    public List<CampRequest> getAll() {
        return campRequestRepository.findAll();
    }

    // Admin only — update status (PENDING → ACCEPTED / REJECTED / REVIEWED)
    @PutMapping("/{id}/status")
    public ResponseEntity<CampRequest> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return campRequestRepository.findById(id).map(req -> {
            req.setStatus(status);
            return ResponseEntity.ok(campRequestRepository.save(req));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Admin only — delete a request
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return campRequestRepository.findById(id).map(req -> {
            campRequestRepository.delete(req);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
