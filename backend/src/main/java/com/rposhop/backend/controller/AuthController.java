package com.rposhop.backend.controller;

import com.rposhop.backend.dto.LoginRequest;
import com.rposhop.backend.dto.LoginResponse;
import com.rposhop.backend.dto.RegisterRequest;
import com.rposhop.backend.model.User;
import com.rposhop.backend.service.UserService;
import com.rposhop.backend.utils.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtils jwtUtils;

    // **Endpoint para Registro**
    @Operation(summary = "Registro de usuario", description = "Permite registrar un nuevo usuario")
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody RegisterRequest request) {
        User newUser = userService.registerUser(request);
        return ResponseEntity.ok(newUser);
    }

    // **Endpoint para Login**
    @Operation(summary = "Inicio de sesión", description = "Autentica a un usuario con su email y contraseña")
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userService.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Usuario no encontrado");
        }

        User user = userOpt.get();

        if (!userService.checkPassword(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }

        // Generar JWT con el rol
        String token = jwtUtils.generateToken(user.getEmail(), user.getRole());
        return ResponseEntity.ok(new LoginResponse(token));
    }
}
