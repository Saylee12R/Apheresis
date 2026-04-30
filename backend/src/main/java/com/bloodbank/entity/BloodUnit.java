package com.bloodbank.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "blood_units")
public class BloodUnit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bloodGroup; // A+, O-, etc.
    private String bloodComponentType; // whole blood, rbc, platelets, plasma, super red
    private Integer units; // usually 1 per bag, but keeping it for flexibility
    private LocalDate collectionDate;
    private LocalDate expiryDate;
    
    private String status; // AVAILABLE, USED, EXPIRED
}
