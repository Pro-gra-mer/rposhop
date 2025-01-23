package com.rposhop.backend.dto;

public class RegisterRequest {
    private String email;
    private String password;
    private String name;

    // Constructor vacío
    public RegisterRequest() {}

    // Constructor completo (opcional)
    public RegisterRequest(String email, String password, String name) {
        this.email = email;
        this.password = password;
        this.name = name;
    }

    // Getters
    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getName() {
        return name;
    }

    // Setters
    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setName(String name) {
        this.name = name;
    }
}
