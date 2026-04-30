package com.bloodbank.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "camp_requests")
public class CampRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String orgName;
    private String email;

    @Column(length = 2000)
    private String message;

    private String status; // PENDING, REVIEWED, ACCEPTED, REJECTED

    private LocalDateTime submittedAt;

    @PrePersist
    public void prePersist() {
        this.submittedAt = LocalDateTime.now();
        if (this.status == null) this.status = "PENDING";
    }
}
