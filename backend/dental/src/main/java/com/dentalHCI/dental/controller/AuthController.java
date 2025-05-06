package com.dentalHCI.dental.controller;

import com.dentalHCI.dental.dto.AuthRequest;
import com.dentalHCI.dental.dto.AuthResponse;
import com.dentalHCI.dental.dto.RegisterRequest;
import com.dentalHCI.dental.model.Role;
import com.dentalHCI.dental.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600) // Allow all origins for now, refine in CorsConfig
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@Valid @RequestBody AuthRequest loginRequest) {
        AuthResponse authResponse = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/register/patient")
    public ResponseEntity<?> registerPatient(@Valid @RequestBody RegisterRequest registerRequest) {
        authService.registerUser(registerRequest, Role.PATIENT);
        return ResponseEntity.ok("Patient registered successfully!");
    }

    @PostMapping("/register/dentist")
    public ResponseEntity<?> registerDentist(@Valid @RequestBody RegisterRequest registerRequest) {
        // In a real app, you might want extra verification before registering a dentist
        authService.registerUser(registerRequest, Role.DENTIST);
        return ResponseEntity.ok("Dentist registered successfully!");
    }
}