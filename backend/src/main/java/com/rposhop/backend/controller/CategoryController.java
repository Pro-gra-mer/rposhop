package com.rposhop.backend.controller;

import com.rposhop.backend.dto.CategoryRequest;
import com.rposhop.backend.model.Category;
import com.rposhop.backend.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // ✅ Obtener todas las categorías
    @Operation(summary = "Obtener todas las categorías", description = "Devuelve una lista de todas las categorías disponibles en la base de datos.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de categorías obtenida con éxito",
                    content = @Content(schema = @Schema(implementation = Category.class)))
    })
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    // ✅ Crear una nueva categoría (Solo Admins)

    @Operation(summary = "Crear una categoría", description = "Permite a los administradores crear nuevas categorías.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Categoría creada exitosamente"),
            @ApiResponse(responseCode = "400", description = "El nombre de la categoría es obligatorio"),
            @ApiResponse(responseCode = "403", description = "No tienes permisos para crear categorías (Solo Admins)")
    })
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCategory(@RequestBody CategoryRequest request, Principal principal) {
        String name = request.getName();
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "El nombre de la categoría es obligatorio"));
        }

        try {
            Category category = categoryService.createCategory(name);
            return ResponseEntity.ok(category);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }


    // ✅ Eliminar una categoría (Solo Admins)
    @Operation(summary = "Eliminar una categoría", description = "Permite a los administradores eliminar una categoría por su ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Categoría eliminada exitosamente"),
            @ApiResponse(responseCode = "404", description = "Categoría no encontrada"),
            @ApiResponse(responseCode = "403", description = "No tienes permisos para eliminar categorías (Solo Admins)")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(Map.of("message", "Categoría eliminada correctamente"));
    }

    // Controlador: Editar una categoría
    @Operation(summary = "Editar una categoría", description = "Permite a los administradores editar el nombre de una categoría existente.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Categoría actualizada exitosamente"),
            @ApiResponse(responseCode = "400", description = "El nombre de la categoría es obligatorio o ya existe"),
            @ApiResponse(responseCode = "403", description = "No tienes permisos para editar categorías (Solo Admins)"),
            @ApiResponse(responseCode = "404", description = "Categoría no encontrada")
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody CategoryRequest request) {
        String name = request.getName();
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "El nombre de la categoría es obligatorio"));
        }

        try {
            // Llamamos al servicio para actualizar la categoría
            Category updatedCategory = categoryService.updateCategory(id, name);
            return ResponseEntity.ok(updatedCategory);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }


}
