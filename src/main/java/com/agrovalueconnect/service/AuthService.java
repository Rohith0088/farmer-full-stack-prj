package com.agrovalueconnect.service;

import com.agrovalueconnect.dto.AuthRequest;
import com.agrovalueconnect.dto.AuthResponse;
import com.agrovalueconnect.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(AuthRequest request);
}
