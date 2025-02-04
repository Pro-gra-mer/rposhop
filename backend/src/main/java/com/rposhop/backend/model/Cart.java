package com.rposhop.backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carts")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Asociación One-to-One con el usuario
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference  // Permite serializar los items sin recursión
    private List<CartItem> items;

    // Constructor por defecto: se inicializa items para evitar null
    public Cart() {
        this.items = new ArrayList<>();
    }

    // Getters y Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<CartItem> getItems() {
        return items;
    }

    // Si se pasa null, se inicializa a una lista vacía para evitar errores
    public void setItems(List<CartItem> items) {
        this.items = (items != null) ? items : new ArrayList<>();
    }

    // Métodos de ayuda

    public void addItem(CartItem item) {
        for (CartItem ci : items) {
            if (ci.getProduct().getId().equals(item.getProduct().getId())) {
                ci.setQuantity(ci.getQuantity() + item.getQuantity());
                return;
            }
        }
        items.add(item);
        item.setCart(this);
    }

    public void updateItem(Long productId, int quantity) {
        for (CartItem ci : items) {
            if (ci.getProduct().getId().equals(productId)) {
                ci.setQuantity(quantity);
                return;
            }
        }
    }

    public void removeItem(Long productId) {
        items.removeIf(ci -> ci.getProduct().getId().equals(productId));
    }

    public double getTotal() {
        // Aunque items esté inicializada, se hace una precaución
        return (items != null ? items.stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum() : 0);
    }
}
