package com.bloodbank.service;

import com.bloodbank.entity.User;
import com.bloodbank.repository.UserRepository;
import com.bloodbank.security.JwtUtils;
import com.bloodbank.util.EncryptionUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EncryptionUtil encryptionUtil;

    public Map<String, String> login(String username, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        final UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        final String jwt = jwtUtils.generateToken(userDetails);
        
        User user = userRepository.findByUsername(username).orElseThrow();

        Map<String, String> response = new HashMap<>();
        response.put("token", jwt);
        response.put("role", user.getRole());
        response.put("username", user.getUsername());
        return response;
    }

    public User register(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        
        if ("ROLE_ADMIN".equals(user.getRole())) {
            if (userRepository.countByRole("ROLE_ADMIN") >= 10) {
                throw new RuntimeException("Registration failed: Maximum number of Admin accounts (10) has been reached.");
            }
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        if (user.getGovernmentId() != null) {
            user.setGovernmentId(encryptionUtil.encrypt(user.getGovernmentId()));
        }
        
        return userRepository.save(user);
    }
}
