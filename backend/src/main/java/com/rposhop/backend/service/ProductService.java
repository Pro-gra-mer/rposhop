package com.rposhop.backend.service;

import com.rposhop.backend.dto.ProductRequest;
import com.rposhop.backend.model.Category;
import com.rposhop.backend.model.Product;
import com.rposhop.backend.repository.CategoryRepository;
import com.rposhop.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // Obtener todos los productos
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Obtener productos por categoría
    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    // Crear un producto
    public Product createProduct(ProductRequest request) {
        // Verificar si la categoría existe
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));

        // Crear el producto
        Product product = new Product();
        product.setName(request.getName());
        product.setImageUrl(request.getImageUrl());
        product.setPrice(request.getPrice());
        product.setCategoryId(category.getId());
        product.setDescription(request.getDescription()); // Asigna la descripción

        return productRepository.save(product);
    }

    // Actualizar un producto
    public Product updateProduct(Long id, ProductRequest request) {
        // Verificar si el producto existe
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));

        // Verificar si la categoría existe
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));

        // Actualizar el producto
        product.setName(request.getName());
        product.setImageUrl(request.getImageUrl());
        product.setPrice(request.getPrice());
        product.setCategoryId(category.getId());
        product.setDescription(request.getDescription()); // Actualiza la descripción

        return productRepository.save(product);
    }

    // Eliminar un producto
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new IllegalArgumentException("Producto no encontrado");
        }
        productRepository.deleteById(id);
    }

    // Dentro de ProductService.java
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));
    }

    public List<Product> searchProducts(String query) {
        String[] words = query.trim().split("\\s+");
        Specification<Product> spec = null;

        for (String word : words) {
            String singular;
            if (word.toLowerCase().endsWith("s") && word.length() > 1) {
                singular = word.substring(0, word.length() - 1);
            } else {
                singular = word;
            }
            Specification<Product> tempSpec = (root, cq, cb) -> {
                String patternOriginal = "%" + word.toLowerCase() + "%";
                String patternSingular = "%" + singular.toLowerCase() + "%";
                return cb.or(
                        cb.like(cb.lower(root.get("name")), patternOriginal),
                        cb.like(cb.lower(root.get("name")), patternSingular)
                );
            };
            spec = (spec == null) ? tempSpec : spec.and(tempSpec);
        }
        return productRepository.findAll(spec);
    }


}
