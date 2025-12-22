package com.clinic.repository;

import com.clinic.entity.Appointment;
import com.clinic.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByUserOrderByCreatedAtDesc(User user);
}
