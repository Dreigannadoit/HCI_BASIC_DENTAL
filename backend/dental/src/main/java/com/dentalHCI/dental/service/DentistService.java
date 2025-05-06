package com.dentalHCI.dental.service;

import com.dentalHCI.dental.dto.AppointmentDto;
import com.dentalHCI.dental.dto.BlockSlotRequestDto;
import com.dentalHCI.dental.exception.BadRequestException;
import com.dentalHCI.dental.exception.ResourceNotFoundException;
import com.dentalHCI.dental.exception.SlotUnavailableException;
import com.dentalHCI.dental.model.Appointment;
import com.dentalHCI.dental.model.BlockedSlot;
import com.dentalHCI.dental.model.Role;
import com.dentalHCI.dental.model.User;
import com.dentalHCI.dental.repository.AppointmentRepository;
import com.dentalHCI.dental.repository.BlockedSlotRepository;
import com.dentalHCI.dental.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DentistService {

    private final AppointmentRepository appointmentRepository;
    private final BlockedSlotRepository blockedSlotRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<AppointmentDto> getDentistSchedule(Long dentistId, LocalDate startDate, LocalDate endDate) {
        User dentist = getUserById(dentistId, Role.DENTIST); // Verify user is a dentist

        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay(); // Exclusive end

        List<Appointment> appointments = appointmentRepository.findByDentistIdAndAppointmentDateTimeBetweenOrderByAppointmentDateTimeAsc(
                dentistId, startDateTime, endDateTime);

        return appointments.stream().map(AppointmentDto::fromEntity).collect(Collectors.toList());
    }

    @Transactional
    public void blockSlot(Long dentistId, BlockSlotRequestDto requestDto) {
        User dentist = getUserById(dentistId, Role.DENTIST);
        LocalDateTime slotDateTime = requestDto.getDateTime();

        // 1. Check if the slot is in the past
        if (slotDateTime.isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Cannot block past time slots.");
        }

        // 2. Check if an appointment already exists for this slot
        boolean appointmentExists = appointmentRepository.existsByDentistIdAndAppointmentDateTime(dentistId, slotDateTime);
        if (appointmentExists) {
            throw new SlotUnavailableException("Cannot block the slot, an appointment already exists.");
        }

        // 3. Check if already blocked (optional, can just rely on unique constraint)
        boolean alreadyBlocked = blockedSlotRepository.existsByDentistIdAndStartDateTime(dentistId, slotDateTime);
        if (alreadyBlocked) {
            log.warn("Slot {} for dentist {} is already blocked.", slotDateTime, dentistId);
            // Optionally throw an exception or just do nothing
            // throw new BadRequestException("Slot is already blocked.");
            return; // Or just return successfully if idempotency is desired
        }


        BlockedSlot blockedSlot = new BlockedSlot(dentist, slotDateTime);
        blockedSlotRepository.save(blockedSlot);
        log.info("Slot {} blocked successfully for dentist ID {}.", slotDateTime, dentistId);
    }

    @Transactional
    public void unblockSlot(Long dentistId, BlockSlotRequestDto requestDto) {
        User dentist = getUserById(dentistId, Role.DENTIST);
        LocalDateTime slotDateTime = requestDto.getDateTime();

        BlockedSlot blockedSlot = blockedSlotRepository.findByDentistIdAndStartDateTime(dentistId, slotDateTime)
                .orElseThrow(() -> new ResourceNotFoundException("Blocked slot not found for the specified time."));

        blockedSlotRepository.delete(blockedSlot);
        log.info("Slot {} unblocked successfully for dentist ID {}.", slotDateTime, dentistId);
    }

    @Transactional
    public void deleteAppointmentByDentist(Long dentistId, Long appointmentId) {
        User dentist = getUserById(dentistId, Role.DENTIST);

        // Find appointment by ID and verify it belongs to this dentist
        Appointment appointment = appointmentRepository.findByIdAndDentistId(appointmentId, dentistId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found or does not belong to this dentist."));

        // Optional: Add logic here if you need to notify the patient about the cancellation

        appointmentRepository.delete(appointment);
        log.info("Appointment ID {} deleted successfully by dentist ID {}.", appointmentId, dentistId);
    }


    // --- Helper Method ---
    private User getUserById(Long userId, Role expectedRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        if (user.getRole() != expectedRole) {
            throw new BadRequestException("User " + userId + " does not have the expected role: " + expectedRole);
        }
        return user;
    }
}
