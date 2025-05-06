package com.dentalHCI.dental.service;

import com.dentalHCI.dental.dto.AuthRequest;
import com.dentalHCI.dental.dto.AuthResponse;
import com.dentalHCI.dental.dto.RegisterRequest;
import com.dentalHCI.dental.exception.BadRequestException;
import com.dentalHCI.dental.model.Role;
import com.dentalHCI.dental.model.User;
import com.dentalHCI.dental.repository.UserRepository;
import com.dentalHCI.dental.security.JwtUtil;
import com.dentalHCI.dental.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public User registerUser(RegisterRequest registerRequest, Role role) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new BadRequestException("Error: Username is already taken!");
        }

        User user = new User(
                registerRequest.getUsername(),
                passwordEncoder.encode(registerRequest.getPassword()),
                registerRequest.getName(),
                role
        );
        return userRepository.save(user);
    }

    public AuthResponse authenticateUser(AuthRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtil.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String role = userDetails.getAuthorities().iterator().next().getAuthority(); // Assumes one role

        return new AuthResponse(jwt, userDetails.getUsername(), role);
    }
}