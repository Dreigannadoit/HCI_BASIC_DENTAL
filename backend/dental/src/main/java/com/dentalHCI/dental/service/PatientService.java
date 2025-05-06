package com.dentalHCI.dental.service;

import com.dentalHCI.dental.dto.AvailabilitySlotDto;
import com.dentalHCI.dental.dto.UserDto;
import com.dentalHCI.dental.exception.BadRequestException;
import com.dentalHCI.dental.exception.ResourceNotFoundException;
import com.dentalHCI.dental.model.Appointment;
import com.dentalHCI.dental.model.BlockedSlot;
import com.dentalHCI.dental.model.Role;
import com.dentalHCI.dental.model.User;
import com.dentalHCI.dental.repository.AppointmentRepository;
import com.dentalHCI.dental.repository.BlockedSlotRepository;
import com.dentalHCI.dental.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final BlockedSlotRepository blockedSlotRepository;

    @Value("${app.working.hour.start}")
    private int workingHourStart;

    @Value("${app.working.hour.end}")
    private int workingHourEnd;

    @Transactional(readOnly = true)
    public List<UserDto> getAllDentists() {
        return userRepository.findByRole(Role.DENTIST).stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AvailabilitySlotDto> getDentistAvailability(Long dentistId, LocalDate date) {
        User dentist = userRepository.findById(dentistId)
                .filter(user -> user.getRole() == Role.DENTIST)
                .orElseThrow(() -> new ResourceNotFoundException("Dentist not found with ID: " + dentistId));

        if (date.isBefore(LocalDate.now())) {
            throw new BadRequestException("Cannot check availability for past dates.");
        }

        LocalDateTime startOfDay = date.atTime(workingHourStart, 0);
        LocalDateTime endOfDay = date.atTime(workingHourEnd, 0); // Exclusive end hour

        // Fetch existing appointments and blocked slots for the day efficiently
        List<Appointment> todaysAppointments = appointmentRepository.findByDentistIdAndAppointmentDate(dentistId, startOfDay);
        List<BlockedSlot> todaysBlockedSlots = blockedSlotRepository.findByDentistIdAndBlockedDate(dentistId, startOfDay);

        Set<LocalDateTime> bookedTimes = todaysAppointments.stream()
                .map(Appointment::getAppointmentDateTime)
                .collect(Collectors.toSet());

        Set<LocalDateTime> blockedTimes = todaysBlockedSlots.stream()
                .map(BlockedSlot::getStartDateTime)
                .collect(Collectors.toSet());

        List<AvailabilitySlotDto> availability = new ArrayList<>();
        LocalDateTime currentSlot = startOfDay;

        while (currentSlot.isBefore(endOfDay)) {
            // Only consider future slots for today
            if (date.equals(LocalDate.now()) && currentSlot.isBefore(LocalDateTime.now())) {
                // availability.add(new AvailabilitySlotDto(currentSlot, false)); // Optionally show past slots as unavailable
            } else {
                boolean isAvailable = !bookedTimes.contains(currentSlot) && !blockedTimes.contains(currentSlot);
                availability.add(new AvailabilitySlotDto(currentSlot, isAvailable));
            }
            currentSlot = currentSlot.plusHours(1); // Assuming hourly slots
        }

        return availability;
    }
}