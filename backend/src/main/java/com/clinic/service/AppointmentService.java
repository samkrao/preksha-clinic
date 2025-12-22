package com.clinic.service;

import com.clinic.dto.AppointmentRequest;
import com.clinic.entity.Appointment;
import com.clinic.entity.User;
import com.clinic.repository.AppointmentRepository;
import com.clinic.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public Appointment bookAppointment(Long userId, AppointmentRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setDoctor(request.getDoctor());
        appointment.setDate(request.getDate());
        appointment.setTime(request.getTime());
        appointment.setReason(request.getReason());
        
        appointment = appointmentRepository.save(appointment);
        
        // Send real-time notification
        String message = String.format("Appointment confirmed with %s on %s at %s", 
            request.getDoctor(), request.getDate(), request.getTime());
        notificationService.notifyUser(userId, message);
        
        return appointment;
    }

    public List<Appointment> getUserAppointments(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return appointmentRepository.findByUserOrderByCreatedAtDesc(user);
    }
}
