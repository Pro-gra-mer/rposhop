package com.rposhop.backend.service;

import com.rposhop.backend.dto.CartMergeRequest;
import com.rposhop.backend.model.Cart;
import com.rposhop.backend.model.CartItem;
import com.rposhop.backend.model.Product;
import com.rposhop.backend.model.User;
import com.rposhop.backend.repository.CartRepository;
import com.rposhop.backend.repository.ProductRepository;
import com.rposhop.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository; // Repositorio para la entidad User

    @Autowired
    private UserService userService; // Inyecta UserService para obtener el usuario autenticado

    // Obtiene el carrito persistente del usuario autenticado o crea uno nuevo
    public Cart getCartForCurrentUser() {
        User currentUser = userService.getCurrentUser();  // Se extrae el usuario del contexto de seguridad
        return cartRepository.findByUserId(currentUser.getId())
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(currentUser);
                    return cartRepository.save(newCart);
                });
    }

    // Agrega un producto al carrito del usuario autenticado
    public Cart addToCart(Long productId, int quantity) {
        Cart cart = getCartForCurrentUser();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));
        CartItem item = new CartItem();
        item.setProduct(product);
        item.setQuantity(quantity);
        cart.addItem(item);
        return cartRepository.save(cart);
    }

    // Método de fusión: recibe los ítems del carrito anónimo y los fusiona con el carrito persistente

    public Cart mergeCart(CartMergeRequest mergeRequest) {
        Cart cart = getCartForCurrentUser();

        // Declaramos el mapa explícitamente con tipos Long e Integer
        Map<Long, Integer> groupedItems = new HashMap<>();

        mergeRequest.getItems().forEach(itemDTO -> {
            Long productId = itemDTO.getProductId();
            int cantidad = itemDTO.getQuantity();
            // Usamos getOrDefault para sumar la cantidad
            Integer currentQuantity = groupedItems.getOrDefault(productId, 0);
            groupedItems.put(productId, currentQuantity + cantidad);
        });

        groupedItems.forEach((productId, totalQuantity) -> {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con id: " + productId));
            CartItem newItem = new CartItem();
            newItem.setProduct(product);
            newItem.setQuantity(totalQuantity);
            cart.addItem(newItem);  // Este método ya suma cantidades si existe el ítem
        });

        return cartRepository.save(cart);
    }



    // Actualiza la cantidad de un producto en el carrito del usuario autenticado
    public Cart updateCartItem(Long productId, int quantity) {
        Cart cart = getCartForCurrentUser();
        cart.updateItem(productId, quantity);
        return cartRepository.save(cart);
    }

    // Elimina un producto del carrito del usuario autenticado
    public Cart removeCartItem(Long productId) {
        Cart cart = getCartForCurrentUser();
        cart.removeItem(productId);
        return cartRepository.save(cart);
    }

    // Calcula el total del carrito para el usuario autenticado
    public double getTotal() {
        Cart cart = getCartForCurrentUser();
        return cart.getTotal();
    }
}
