package com.bloodbank.repository;
import com.bloodbank.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    java.util.List<User> findByIsEmergencyDonorAndBloodGroup(boolean isEmergencyDonor, String bloodGroup);
    long countByRole(String role);
}
