package com.rposhop.backend.service;

import com.rposhop.backend.dto.RegisterRequest;
import com.rposhop.backend.model.User;
import com.rposhop.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

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
}
