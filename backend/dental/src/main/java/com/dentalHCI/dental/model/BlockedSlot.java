package com.dentalHCI.dental.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "blocked_slots", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"dentist_id", "startDateTime"})
})
@Data
@NoArgsConstructor
public class BlockedSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dentist_id", nullable = false)
    private User dentist;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime startDateTime; // Represents the start of the blocked hour/slot

    public BlockedSlot(User dentist, LocalDateTime startDateTime) {
        this.dentist = dentist;
        this.startDateTime = startDateTime;
    }
}