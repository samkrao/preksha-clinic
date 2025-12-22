package com.clinic.controller;

import com.clinic.dto.*;
import com.clinic.service.AppointmentService;
import com.clinic.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {
    private final AppointmentService appointmentService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<?> bookAppointment(@RequestHeader("Authorization") String token,
                                              @Valid @RequestBody AppointmentRequest request) {
        try {
            Long userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(appointmentService.bookAppointment(userId, request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("BOOKING_FAILED", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAppointments(@RequestHeader("Authorization") String token) {
        try {
            Long userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
            return ResponseEntity.ok(appointmentService.getUserAppointments(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("FETCH_FAILED", e.getMessage()));
        }
    }
}
