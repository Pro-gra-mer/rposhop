package com.rposhop.backend.config;

import com.rposhop.backend.utils.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Deshabilitar CSRF para simplificar
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Configuración CORS
                .authorizeHttpRequests(auth -> auth
                        // Rutas públicas de Swagger
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/v3/api-docs.yaml",
                                "/swagger-ui.html"
                        ).permitAll()
                        // Rutas públicas de autenticación
                        .requestMatchers(
                                "/api/auth/register",
                                "/api/auth/login",
                                "/api/auth/request-password",
                                "/api/auth/reset-password",
                                "/api/auth/activate"
                        ).permitAll()
                        // Rutas de carrito: restringir solo a usuarios autenticados
                        .requestMatchers(HttpMethod.GET, "/api/cart/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/cart/add").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/cart/update").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/cart/remove").authenticated()
                        // Rutas de productos: disponibles públicamente
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        // Rutas de categorías: disponibles públicamente
                        .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                        // Rutas protegidas por rol
                        .requestMatchers(HttpMethod.POST, "/api/categories").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/categories/**").hasRole("ADMIN")
                        // Rutas protegidas por rol de admin y user
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/user/**").hasRole("USER")
                        .anyRequest().authenticated() // Resto de rutas protegidas
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .logout(logout -> logout
                        .logoutUrl("/api/logout")
                        .permitAll()
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
                "https://rposhop.netlify.app",
                "https://rposhop-backend-latest.onrender.com"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "application/json", "X-Requested-With", "Origin", "Accept"));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Para encriptar contraseñas
    }
}
