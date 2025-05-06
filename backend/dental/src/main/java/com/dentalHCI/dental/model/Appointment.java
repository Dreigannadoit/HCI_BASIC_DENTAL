package com.dentalHCI.dental.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments", uniqueConstraints = {
        // Prevent double booking the exact same slot by the same dentist
        @UniqueConstraint(columnNames = {"dentist_id", "appointmentDateTime"})
})
@Data
@NoArgsConstructor
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dentist_id", nullable = false)
    private User dentist;

    @NotNull
    // @Future // Could add validation, but needs careful handling during updates
    @Column(nullable = false)
    private LocalDateTime appointmentDateTime;

    public Appointment(User patient, User dentist, LocalDateTime appointmentDateTime) {
        this.patient = patient;
        this.dentist = dentist;
        this.appointmentDateTime = appointmentDateTime;
    }
}