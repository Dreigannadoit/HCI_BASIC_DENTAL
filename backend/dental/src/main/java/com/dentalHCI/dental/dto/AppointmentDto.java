package com.dentalHCI.dental.dto;

import com.dentalHCI.dental.model.Appointment;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDto {
    private Long id;
    private Long patientId;
    private String patientName;
    private Long dentistId;
    private String dentistName;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime appointmentDateTime;

    public static AppointmentDto fromEntity(Appointment appointment) {
        if (appointment == null) return null;
        return new AppointmentDto(
                appointment.getId(),
                appointment.getPatient().getId(),
                appointment.getPatient().getName(),
                appointment.getDentist().getId(),
                appointment.getDentist().getName(),
                appointment.getAppointmentDateTime()
        );
    }
}