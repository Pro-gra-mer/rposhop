package com.rposhop.backend.service;

import com.rposhop.backend.model.Category;
import com.rposhop.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // Obtener todas las categorías
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Buscar categoría por nombre
    public Optional<Category> getCategoryByName(String name) {
        return categoryRepository.findByName(name);
    }

    // Crear una nueva categoría
    public Category createCategory(String name) {
        if (categoryRepository.findByName(name).isPresent()) {
            throw new IllegalArgumentException("La categoría ya existe");
        }
        return categoryRepository.save(new Category(name));
    }

    // Eliminar una categoría por ID
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    // Servicio: Actualizar una categoría
    public Category updateCategory(Long id, String name) {
        // Buscar la categoría por ID
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));

        // Verificar si ya existe una categoría con el mismo nombre
        if (categoryRepository.findByName(name).isPresent()) {
            throw new IllegalArgumentException("La categoría ya existe");
        }

        // Actualizar el nombre de la categoría
        category.setName(name);
        return categoryRepository.save(category);
    }

}
