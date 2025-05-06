package com.dentalHCI.dental.repository;


import com.dentalHCI.dental.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByDentistIdAndAppointmentDateTimeBetweenOrderByAppointmentDateTimeAsc(
            Long dentistId, LocalDateTime start, LocalDateTime end);

    List<Appointment> findByPatientIdOrderByAppointmentDateTimeAsc(Long patientId);

    List<Appointment> findByPatientIdAndAppointmentDateTimeAfterOrderByAppointmentDateTimeAsc(
            Long patientId, LocalDateTime now);

    boolean existsByDentistIdAndAppointmentDateTime(Long dentistId, LocalDateTime dateTime);

    Optional<Appointment> findByIdAndPatientId(Long id, Long patientId);

    Optional<Appointment> findByIdAndDentistId(Long id, Long dentistId);

    // Find appointments for a specific dentist on a specific date (needed for availability check)
    @Query("SELECT a FROM Appointment a WHERE a.dentist.id = :dentistId AND FUNCTION('DATE', a.appointmentDateTime) = FUNCTION('DATE', :date)")
    List<Appointment> findByDentistIdAndAppointmentDate(@Param("dentistId") Long dentistId, @Param("date") LocalDateTime date);
}