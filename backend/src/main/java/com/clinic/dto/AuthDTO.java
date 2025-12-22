package com.clinic.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
class LoginRequest {
    @Email
    @NotBlank
    private String email;
    @NotBlank
    private String password;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class RegisterRequest {
    @NotBlank
    private String name;
    @Email
    @NotBlank
    private String email;
    @NotBlank
    private String password;
    private String phone;
}

@Data
@AllArgsConstructor
class AuthResponse {
    private Long id;
    private String name;
    private String email;
    private String token;
    private String message;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class AppointmentRequest {
    @NotBlank
    private String doctor;
    @NotBlank
    private String date;
    @NotBlank
    private String time;
    private String reason;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class ContactRequest {
    @NotBlank
    private String name;
    @Email
    @NotBlank
    private String email;
    private String phone;
    @NotBlank
    private String message;
}

@Data
@AllArgsConstructor
class ErrorResponse {
    private String error;
    private String message;
}
