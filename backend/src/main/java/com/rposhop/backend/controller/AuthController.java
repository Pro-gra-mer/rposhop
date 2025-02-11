package com.rposhop.backend.controller;

import com.rposhop.backend.dto.LoginRequest;
import com.rposhop.backend.dto.RegisterRequest;
import com.rposhop.backend.dto.RequestPassword;
import com.rposhop.backend.dto.ResetPassword;
import com.rposhop.backend.model.User;
import java.util.Map;
import java.util.HashMap;
import com.rposhop.backend.service.EmailService;
import com.rposhop.backend.service.UserService;
import com.rposhop.backend.utils.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private EmailService emailService;

    // **Endpoint para Registro**
    @Operation(summary = "Registro de usuario", description = "Permite registrar un nuevo usuario")
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest request) {
        // Verificar si el email ya existe
        if (userService.emailExists(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "El correo electrónico ya está registrado."));
        }

        try {
            // Registrar al nuevo usuario
            User newUser = userService.registerUser(request);

            // Generar el enlace de activación
            String activationLink = "https://rposhop-backend-latest.onrender.com/api/auth/activate?token=" + newUser.getActivationToken();
            emailService.sendEmail(
                    newUser.getEmail(),
                    "Activación de Cuenta",
                    "Hola " + newUser.getName() + ",\n\nPor favor activa tu cuenta usando el siguiente enlace:\n" + activationLink +
                            "\n\nRPOShop"
            );

            // Respuesta exitosa
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Usuario registrado exitosamente. Revisa tu correo para activar tu cuenta."));
        } catch (Exception e) {
            // Manejo genérico de excepciones
            return ResponseEntity.badRequest().body(Map.of("message", "Ocurrió un error durante el registro: " + e.getMessage()));
        }
    }



    // **Manejador de excepciones**
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }


    // **Endpoint para Login**
    @Operation(summary = "Inicio de sesión", description = "Autentica a un usuario con su email y contraseña")
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody LoginRequest request) {
        Map<String, Object> response = new HashMap<>();

        Optional<User> userOpt = userService.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            response.put("message", "Usuario no encontrado");
            return ResponseEntity.status(404).body(response);
        }

        User user = userOpt.get();

        if (!user.getActive()) {
            response.put("message", "Cuenta no activada. Por favor revisa tu correo.");
            return ResponseEntity.status(403).body(response);
        }

        if (!userService.checkPassword(request.getPassword(), user.getPassword())) {
            response.put("message", "Credenciales inválidas");
            return ResponseEntity.status(401).body(response);
        }

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole());
        response.put("token", token);
        response.put("role", user.getRole());
        response.put("message", "Inicio de sesión exitoso");
        return ResponseEntity.ok(response);
    }



    @GetMapping("/activate")
    public ResponseEntity<Void> activateAccount(@RequestParam String token) {
        boolean activated = userService.activateUser(token);

        if (activated) {
            // Redirigir al frontend con un mensaje de éxito
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(URI.create("rposhop.netlify.app/?activationSuccess=true"));
            return new ResponseEntity<>(headers, HttpStatus.FOUND);
        } else {
            // Redirigir al frontend con un mensaje de error
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(URI.create("rposhop.netlify.app/?activationError=true"));
            return new ResponseEntity<>(headers, HttpStatus.FOUND);
        }
    }


    @Operation(summary = "Solicitar restablecimiento de contraseña", description = "Envía un correo para restablecer la contraseña del usuario.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Correo enviado con éxito"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    @PostMapping("/request-password")
    public ResponseEntity<?> requestPassword(@RequestBody RequestPassword request) {
        String email = request.getEmail();
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "El correo es obligatorio"));
        }

        boolean emailSent = userService.generatePasswordResetToken(email);
        if (emailSent) {
            return ResponseEntity.ok(Map.of("message", "Se ha enviado un enlace para restablecer la contraseña a tu correo"));
        } else {
            return ResponseEntity.status(404).body(Map.of("message", "Usuario no encontrado"));
        }
    }


    @Operation(summary = "Restablecer contraseña", description = "Permite restablecer la contraseña del usuario utilizando un token.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Contraseña restablecida con éxito"),
            @ApiResponse(responseCode = "400", description = "Token inválido o expirado")
    })
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody ResetPassword request) {
        String token = request.getToken();
        String newPassword = request.getNewPassword();

        if (token == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Token y nueva contraseña son obligatorios"));
        }

        boolean passwordUpdated = userService.resetPassword(token, newPassword);
        if (passwordUpdated) {
            return ResponseEntity.ok(Map.of("message", "Contraseña actualizada con éxito"));
        } else {
            return ResponseEntity.status(400).body(Map.of("message", "Token inválido o expirado"));
        }
    }


}
