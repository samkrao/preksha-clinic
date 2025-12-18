package com.preksha.appointment;

import com.preksha.appointment.dto.CreateAppointmentRequest;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentRepository repo;
    private static final DateTimeFormatter INPUT = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");

    public AppointmentController(AppointmentRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public Appointment create(Authentication auth, @Valid @RequestBody CreateAppointmentRequest req) {
        String email = (String) auth.getPrincipal();
        LocalDateTime dt = LocalDateTime.parse(req.dateTime, INPUT);

        Appointment appt = new Appointment(email, req.patientName, req.phone, dt, req.reason);
        return repo.save(appt);
    }

    @GetMapping("/mine")
    public List<Appointment> mine(Authentication auth) {
        String email = (String) auth.getPrincipal();
        return repo.findByUserEmailOrderByAppointmentDateTimeAsc(email);
    }
}
