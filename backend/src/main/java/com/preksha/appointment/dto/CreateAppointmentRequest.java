package com.preksha.appointment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class CreateAppointmentRequest {
    @NotBlank @Size(max = 120)
    public String patientName;

    @NotBlank
    @Pattern(regexp = "^[0-9+\-() ]{7,40}$", message = "Invalid phone")
    public String phone;

    // HTML datetime-local sends: yyyy-MM-ddTHH:mm
    @NotBlank
    @Pattern(regexp = "^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$", message = "Use format yyyy-MM-ddTHH:mm")
    public String dateTime;

    @NotBlank @Size(max = 500)
    public String reason;
}
