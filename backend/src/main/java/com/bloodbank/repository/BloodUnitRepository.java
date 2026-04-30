package com.bloodbank.repository;

import com.bloodbank.entity.BloodUnit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BloodUnitRepository extends JpaRepository<BloodUnit, Long> {
    long countByBloodGroupAndBloodComponentTypeAndStatus(String bloodGroup, String bloodComponentType, String status);
}
