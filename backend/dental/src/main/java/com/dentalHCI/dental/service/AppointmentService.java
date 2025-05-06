package com.dentalHCI.dental.service;

import com.dentalHCI.dental.dto.AppointmentDto;
import com.dentalHCI.dental.dto.AppointmentRequestDto;
import com.dentalHCI.dental.exception.BadRequestException;
import com.dentalHCI.dental.exception.ResourceNotFoundException;
import com.dentalHCI.dental.exception.SlotUnavailableException;
import com.dentalHCI.dental.model.Appointment;
import com.dentalHCI.dental.model.Role;
import com.dentalHCI.dental.model.User;
import com.dentalHCI.dental.repository.AppointmentRepository;
import com.dentalHCI.dental.repository.BlockedSlotRepository;
import com.dentalHCI.dental.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final BlockedSlotRepository blockedSlotRepository;
    private final PatientService patientService; // For availability check

    @Transactional
    public AppointmentDto bookAppointment(Long patientId, AppointmentRequestDto requestDto) {
        User patient = getUserById(patientId, Role.PATIENT);
        User dentist = getUserById(requestDto.getDentistId(), Role.DENTIST);

        LocalDateTime requestedTime = requestDto.getAppointmentDateTime();

        // 1. Double-check if the slot is valid and available NOW (mitigate race conditions)
        if (!isSlotAvailable(dentist.getId(), requestedTime)) {
            throw new SlotUnavailableException("The selected time slot is no longer available.");
        }

        // 2. Check if date is in the past (already handled by @Future validation, but good defense)
        if (requestedTime.isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Cannot book appointments in the past.");
        }

        // 3. Create and save
        Appointment appointment = new Appointment(patient, dentist, requestedTime);
        Appointment savedAppointment = appointmentRepository.save(appointment);
        log.info("Appointment booked successfully: ID {}", savedAppointment.getId());
        return AppointmentDto.fromEntity(savedAppointment);
    }

    @Transactional(readOnly = true)
    public List<AppointmentDto> getUpcomingAppointmentsForPatient(Long patientId) {
        User patient = getUserById(patientId, Role.PATIENT); // Ensure user exists and is a patient
        List<Appointment> appointments = appointmentRepository.findByPatientIdAndAppointmentDateTimeAfterOrderByAppointmentDateTimeAsc(
                patientId, LocalDateTime.now());
        return appointments.stream().map(AppointmentDto::fromEntity).collect(Collectors.toList());
    }

    @Transactional
    public AppointmentDto editAppointment(Long patientId, Long appointmentId, AppointmentRequestDto requestDto) {
        User patient = getUserById(patientId, Role.PATIENT);
        Appointment appointment = appointmentRepository.findByIdAndPatientId(appointmentId, patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found or you don't have permission to edit it."));

        // 1. Check if the original appointment is in the future
        if (appointment.getAppointmentDateTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Cannot edit past appointments.");
        }

        // 2. Check if the NEW requested time is valid and available
        LocalDateTime newDateTime = requestDto.getAppointmentDateTime();
        if (newDateTime.isBefore(LocalDateTime.now())) {
            throw new BadRequestException("New appointment date must be in the future.");
        }
        // Make sure the new slot isn't the *current* appointment's slot if it hasn't changed dentist/time
        if (!appointment.getDentist().getId().equals(requestDto.getDentistId()) || !appointment.getAppointmentDateTime().equals(newDateTime)) {
            if (!isSlotAvailable(requestDto.getDentistId(), newDateTime)) {
                throw new SlotUnavailableException("The new selected time slot is not available.");
            }
        }


        // 3. Update fields
        User newDentist = getUserById(requestDto.getDentistId(), Role.DENTIST);
        appointment.setDentist(newDentist);
        appointment.setAppointmentDateTime(newDateTime);

        Appointment updatedAppointment = appointmentRepository.save(appointment);
        log.info("Appointment ID {} updated successfully.", updatedAppointment.getId());
        return AppointmentDto.fromEntity(updatedAppointment);
    }

    @Transactional
    public void cancelAppointmentByPatient(Long patientId, Long appointmentId) {
        User patient = getUserById(patientId, Role.PATIENT);
        Appointment appointment = appointmentRepository.findByIdAndPatientId(appointmentId, patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found or you don't have permission to cancel it."));

        if (appointment.getAppointmentDateTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Cannot cancel past appointments.");
        }

        appointmentRepository.delete(appointment);
        log.info("Appointment ID {} cancelled successfully by patient ID {}.", appointmentId, patientId);
    }

    // --- Helper Methods ---

    private User getUserById(Long userId, Role expectedRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        if (user.getRole() != expectedRole) {
            throw new BadRequestException("User " + userId + " does not have the expected role: " + expectedRole);
        }
        return user;
    }

    private boolean isSlotAvailable(Long dentistId, LocalDateTime dateTime) {
        // Check if already booked
        boolean alreadyBooked = appointmentRepository.existsByDentistIdAndAppointmentDateTime(dentistId, dateTime);
        if (alreadyBooked) return false;

        // Check if blocked by dentist
        boolean isBlocked = blockedSlotRepository.existsByDentistIdAndStartDateTime(dentistId, dateTime);
        if (isBlocked) return false;

        // Optional: Check against working hours / valid slot times if needed here too
        // For now, relying on the availability generation logic in PatientService

        return true; // Slot is available
    }
}