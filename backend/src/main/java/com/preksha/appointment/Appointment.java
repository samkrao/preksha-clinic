package com.preksha.appointment;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Owner (logged-in user)
    @Column(nullable = false, length = 200)
    private String userEmail;

    @Column(nullable = false, length = 120)
    private String patientName;

    @Column(nullable = false, length = 40)
    private String phone;

    @Column(nullable = false)
    private LocalDateTime appointmentDateTime;

    @Column(nullable = false, length = 500)
    private String reason;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public Appointment() {}

    public Appointment(String userEmail, String patientName, String phone, LocalDateTime appointmentDateTime, String reason) {
        this.userEmail = userEmail;
        this.patientName = patientName;
        this.phone = phone;
        this.appointmentDateTime = appointmentDateTime;
        this.reason = reason;
    }

    public Long getId() { return id; }
    public String getUserEmail() { return userEmail; }
    public String getPatientName() { return patientName; }
    public String getPhone() { return phone; }
    public LocalDateTime getAppointmentDateTime() { return appointmentDateTime; }
    public String getReason() { return reason; }
    public Instant getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setAppointmentDateTime(LocalDateTime appointmentDateTime) { this.appointmentDateTime = appointmentDateTime; }
    public void setReason(String reason) { this.reason = reason; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
