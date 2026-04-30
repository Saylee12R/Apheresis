package com.bloodbank.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "blood_requests")
public class BloodRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User requester; // The User or Receiver requesting blood

    private String bloodGroup;
    private String bloodComponentType;
    private Integer quantityUnits;
    private String status; // PENDING, APPROVED, REJECTED, FULFILLED
    private String urgency; // normal, urgent, critical

    private LocalDateTime requestDate;
}
