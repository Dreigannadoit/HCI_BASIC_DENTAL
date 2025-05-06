package com.dentalHCI.dental.controller;

import com.dentalHCI.dental.dto.AppointmentDto;
import com.dentalHCI.dental.dto.BlockSlotRequestDto;
import com.dentalHCI.dental.security.UserDetailsImpl;
import com.dentalHCI.dental.service.DentistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dentist")
@PreAuthorize("hasRole('DENTIST')")
@RequiredArgsConstructor
public class DentistController {

    private final DentistService dentistService;

    @GetMapping("/schedule")
    public ResponseEntity<List<AppointmentDto>> getSchedule(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        List<AppointmentDto> schedule = dentistService.getDentistSchedule(currentUser.getId(), startDate, endDate);
        return ResponseEntity.ok(schedule);
    }

    @PostMapping("/block-slot")
    public ResponseEntity<?> blockSlot(
            @Valid @RequestBody BlockSlotRequestDto blockRequest,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        dentistService.blockSlot(currentUser.getId(), blockRequest);
        return ResponseEntity.ok("Slot blocked successfully.");
    }

    // Using DELETE for unblocking feels more RESTful if we consider the block as a resource
    @DeleteMapping("/unblock-slot") // Or could be POST /unblock-slot
    public ResponseEntity<?> unblockSlot(
            @Valid @RequestBody BlockSlotRequestDto unblockRequest, // Send time to unblock in body
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        dentistService.unblockSlot(currentUser.getId(), unblockRequest);
        return ResponseEntity.ok("Slot unblocked successfully.");
    }

    @DeleteMapping("/appointments/{appointmentId}")
    public ResponseEntity<?> deleteAppointment(
            @PathVariable Long appointmentId,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        dentistService.deleteAppointmentByDentist(currentUser.getId(), appointmentId);
        return ResponseEntity.ok("Appointment deleted successfully.");
    }
}