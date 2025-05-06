package com.dentalHCI.dental.controller;

import com.dentalHCI.dental.dto.AppointmentDto;
import com.dentalHCI.dental.dto.AppointmentRequestDto;
import com.dentalHCI.dental.dto.AvailabilitySlotDto;
import com.dentalHCI.dental.dto.UserDto;
import com.dentalHCI.dental.security.UserDetailsImpl;
import com.dentalHCI.dental.service.AppointmentService;
import com.dentalHCI.dental.service.PatientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/patient")
@PreAuthorize("hasRole('PATIENT')")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;
    private final AppointmentService appointmentService;

    @GetMapping("/dentists")
    public ResponseEntity<List<UserDto>> getAllDentists() {
        List<UserDto> dentists = patientService.getAllDentists();
        return ResponseEntity.ok(dentists);
    }

    @GetMapping("/dentists/{dentistId}/availability")
    public ResponseEntity<List<AvailabilitySlotDto>> getDentistAvailability(
            @PathVariable Long dentistId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<AvailabilitySlotDto> availability = patientService.getDentistAvailability(dentistId, date);
        return ResponseEntity.ok(availability);
    }

    @PostMapping("/appointments")
    public ResponseEntity<AppointmentDto> bookAppointment(
            @Valid @RequestBody AppointmentRequestDto appointmentRequest,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        AppointmentDto bookedAppointment = appointmentService.bookAppointment(currentUser.getId(), appointmentRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(bookedAppointment);
    }

    @GetMapping("/appointments/upcoming")
    public ResponseEntity<List<AppointmentDto>> getUpcomingAppointments(
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        List<AppointmentDto> appointments = appointmentService.getUpcomingAppointmentsForPatient(currentUser.getId());
        return ResponseEntity.ok(appointments);
    }

    @PutMapping("/appointments/{appointmentId}")
    public ResponseEntity<AppointmentDto> editAppointment(
            @PathVariable Long appointmentId,
            @Valid @RequestBody AppointmentRequestDto appointmentRequest,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        AppointmentDto updatedAppointment = appointmentService.editAppointment(currentUser.getId(), appointmentId, appointmentRequest);
        return ResponseEntity.ok(updatedAppointment);
    }

    @DeleteMapping("/appointments/{appointmentId}")
    public ResponseEntity<?> cancelAppointment(
            @PathVariable Long appointmentId,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        appointmentService.cancelAppointmentByPatient(currentUser.getId(), appointmentId);
        return ResponseEntity.ok("Appointment cancelled successfully.");
    }
}