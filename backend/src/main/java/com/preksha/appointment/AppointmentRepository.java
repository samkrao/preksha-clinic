package com.preksha.appointment;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByUserEmailOrderByAppointmentDateTimeAsc(String userEmail);
}
