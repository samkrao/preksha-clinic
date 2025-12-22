package com.clinic.service;

import com.clinic.dto.*;
import com.clinic.entity.User;
import com.clinic.repository.UserRepository;
import com.clinic.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user = userRepository.save(user);
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getName());
        return new AuthResponse(user.getId(), user.getName(), user.getEmail(), token, "Registration successful");
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getName());
        return new AuthResponse(user.getId(), user.getName(), user.getEmail(), token, "Login successful");
    }
}
