package com.rposhop.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Operation(summary = "Lista todos los productos")
    @GetMapping
    public String listProducts() {
        return "Lista de productos públicos";
    }

    @Operation(summary = "Añade un producto (solo admin)")
    @PostMapping("/admin")
    public String addProduct() {
        return "Producto añadido (solo admin)";
    }

    @Operation(summary = "Actualiza un producto (solo admin)")
    @PutMapping("/admin/{id}")
    public String updateProduct(@PathVariable Long id) {
        return "Producto actualizado (solo admin)";
    }

    @Operation(summary = "Elimina un producto (solo admin)")
    @DeleteMapping("/admin/{id}")
    public String deleteProduct(@PathVariable Long id) {
        return "Producto eliminado (solo admin)";
    }
}
