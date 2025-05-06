package com.dentalHCI.dental.repository;

import com.dentalHCI.dental.model.BlockedSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BlockedSlotRepository extends JpaRepository<BlockedSlot, Long> {

    boolean existsByDentistIdAndStartDateTime(Long dentistId, LocalDateTime dateTime);

    List<BlockedSlot> findByDentistIdAndStartDateTimeBetween(Long dentistId, LocalDateTime start, LocalDateTime end);

    Optional<BlockedSlot> findByDentistIdAndStartDateTime(Long dentistId, LocalDateTime dateTime);

    // Find blocked slots for a specific dentist on a specific date
    @Query("SELECT bs FROM BlockedSlot bs WHERE bs.dentist.id = :dentistId AND FUNCTION('DATE', bs.startDateTime) = FUNCTION('DATE', :date)")
    List<BlockedSlot> findByDentistIdAndBlockedDate(@Param("dentistId") Long dentistId, @Param("date") LocalDateTime date);
}