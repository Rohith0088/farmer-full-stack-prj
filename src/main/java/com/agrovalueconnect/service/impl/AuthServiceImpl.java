package com.agrovalueconnect.service.impl;

import com.agrovalueconnect.config.JwtUtil;
import com.agrovalueconnect.dto.AuthRequest;
import com.agrovalueconnect.dto.AuthResponse;
import com.agrovalueconnect.dto.RegisterRequest;
import com.agrovalueconnect.model.User;
import com.agrovalueconnect.repository.UserRepository;
import com.agrovalueconnect.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    private static final long EXPIRATION = 1000 * 60 * 60 * 6; // 6 hours

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .createdAt(Instant.now())
                .build();
        userRepository.save(user);
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), EXPIRATION);
        return new AuthResponse(token, user.getRole().name());
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                request.getEmail(), request.getPassword()));
        String token = jwtUtil.generateToken(request.getEmail(), request.getRole().name(), EXPIRATION);
        return new AuthResponse(token, request.getRole().name());
    }
}
