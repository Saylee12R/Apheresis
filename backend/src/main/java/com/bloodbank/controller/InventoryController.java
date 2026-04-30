package com.bloodbank.controller;

import com.bloodbank.entity.BloodUnit;
import com.bloodbank.repository.BloodUnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
public class InventoryController {

    @Autowired
    private BloodUnitRepository bloodUnitRepository;

    @GetMapping
    public List<BloodUnit> getAllUnits() {
        return bloodUnitRepository.findAll();
    }

    @PostMapping
    public BloodUnit addUnit(@RequestBody BloodUnit unit) {
        if (unit.getCollectionDate() != null) {
            // Assume expiry is 42 days from collection
            unit.setExpiryDate(unit.getCollectionDate().plusDays(42));
        }
        unit.setStatus("AVAILABLE");
        return bloodUnitRepository.save(unit);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BloodUnit> updateUnit(@PathVariable Long id, @RequestBody BloodUnit unitDetails) {
        return bloodUnitRepository.findById(id).map(unit -> {
            unit.setBloodGroup(unitDetails.getBloodGroup());
            unit.setBloodComponentType(unitDetails.getBloodComponentType());
            unit.setUnits(unitDetails.getUnits());
            unit.setCollectionDate(unitDetails.getCollectionDate());
            if (unitDetails.getCollectionDate() != null) {
                unit.setExpiryDate(unitDetails.getCollectionDate().plusDays(42));
            }
            unit.setStatus(unitDetails.getStatus());
            return ResponseEntity.ok(bloodUnitRepository.save(unit));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUnit(@PathVariable Long id) {
        return bloodUnitRepository.findById(id).map(unit -> {
            bloodUnitRepository.delete(unit);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // Worker only - clean up expired blood
    @PostMapping("/cleanup")
    public ResponseEntity<?> cleanupExpired() {
        LocalDate today = LocalDate.now();
        List<BloodUnit> units = bloodUnitRepository.findAll();
        for (BloodUnit unit : units) {
            if (unit.getExpiryDate() != null && unit.getExpiryDate().isBefore(today) && "AVAILABLE".equals(unit.getStatus())) {
                unit.setStatus("EXPIRED");
                bloodUnitRepository.save(unit);
            }
        }
        return ResponseEntity.ok("Cleanup complete");
    }
}
