package com.rposhop.backend.service;

import com.rposhop.backend.dto.RegisterRequest;
import com.rposhop.backend.model.User;
import com.rposhop.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    // Registrar usuario
    public User registerUser(RegisterRequest request) {
        // Verificar si el email ya está registrado
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("El email ya está registrado");
        }

        // Validar la contraseña
        if (!isPasswordValid(request.getPassword())) {
            throw new IllegalArgumentException(
                    "La contraseña debe tener al menos 8 caracteres, incluyendo letras, números y símbolos");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        user.setActive(false);
        user.setActivationToken(generateActivationToken());

        return userRepository.save(user);
    }

    // Método para validar la contraseña usando una expresión regular
    private boolean isPasswordValid(String password) {
        String passwordPattern = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
        return password.matches(passwordPattern);
    }



    // Método para generar un token único
    public String generateActivationToken() {
        return UUID.randomUUID().toString();
    }

    public boolean activateUser(String token) {
        System.out.println("Token recibido para activación: " + token);
        Optional<User> userOpt = userRepository.findByActivationToken(token);

        if (userOpt.isEmpty()) {
            return false;
        }

        User user = userOpt.get();
        user.setActive(true);
        user.setActivationToken(null); // Eliminar el token después de activarlo
        userRepository.save(user);

        System.out.println("Cuenta activada para el usuario: " + user.getEmail());
        return true;
    }


    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public void save(User user) {
        userRepository.save(user);
    }

    public boolean generatePasswordResetToken(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String token = UUID.randomUUID().toString();
            user.setResetPasswordToken(token);
            user.setTokenExpiryDate(LocalDateTime.now().plusHours(1)); // Ejemplo: 1 hora de validez
            userRepository.save(user);
            // Envía el token al correo
            emailService.sendEmail(user.getEmail(), "Restablecer Contraseña",
                    "Para restablecer tu contraseña, usa el siguiente enlace:\n\nhttp://localhost:4200/reset-password?token=" + token);
            return true;
        }
        return false;
    }

    public boolean resetPassword(String token, String newPassword) {
        Optional<User> userOpt = userRepository.findByResetPasswordToken(token);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getTokenExpiryDate().isAfter(LocalDateTime.now())) {
                user.setPassword(passwordEncoder.encode(newPassword));
                user.setResetPasswordToken(null); // Limpia el token
                user.setTokenExpiryDate(null);
                userRepository.save(user);
                return true;
            }
        }
        return false;
    }

    public boolean emailExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new IllegalStateException("No hay usuario autenticado");
        }
        String email = authentication.getName(); // Se asume que el email se usa como username
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con email: " + email));
    }


}
