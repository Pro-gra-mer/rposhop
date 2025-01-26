package com.rposhop.backend.controller;

import com.rposhop.backend.dto.LoginRequest;
import com.rposhop.backend.dto.RegisterRequest;
import com.rposhop.backend.model.User;
import java.util.Map;
import java.util.HashMap;
import com.rposhop.backend.service.EmailService;
import com.rposhop.backend.service.UserService;
import com.rposhop.backend.utils.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
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
    public ResponseEntity<User> registerUser(@RequestBody RegisterRequest request) {
        User newUser = userService.registerUser(request);

        // Generar un link de activación
        String activationLink = "http://localhost:8080/api/auth/activate?token=" + newUser.getActivationToken();

        emailService.sendEmail(
                newUser.getEmail(),
                "Activación de Cuenta",
                "Hola " + newUser.getName() + ",\n\nPor favor activa tu cuenta usando el siguiente enlace:\n" + activationLink +
                        "\n\nRPOShop"
        );


        return ResponseEntity.ok(newUser);
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
        response.put("message", "Inicio de sesión exitoso");
        return ResponseEntity.ok(response);
    }



    @GetMapping("/activate")
    public ResponseEntity<Void> activateAccount(@RequestParam String token) {
        boolean activated = userService.activateUser(token);

        if (activated) {
            // Redirigir al frontend con un mensaje de éxito
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(URI.create("http://localhost:4200/?activationSuccess=true"));
            return new ResponseEntity<>(headers, HttpStatus.FOUND);
        } else {
            // Redirigir al frontend con un mensaje de error
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(URI.create("http://localhost:4200/?activationError=true"));
            return new ResponseEntity<>(headers, HttpStatus.FOUND);
        }
    }

}
