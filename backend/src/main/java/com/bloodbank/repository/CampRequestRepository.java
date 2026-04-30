package com.bloodbank.repository;

import com.bloodbank.entity.CampRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CampRequestRepository extends JpaRepository<CampRequest, Long> {
}
