package com.rposhop.backend.controller;

import com.rposhop.backend.dto.CartMergeRequest;
import com.rposhop.backend.model.Cart;
import com.rposhop.backend.model.User;
import com.rposhop.backend.repository.UserRepository;
import com.rposhop.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserRepository userRepository;

    // Endpoint para fusionar el carrito anónimo con el carrito persistente.
    @PostMapping("/merge")
    public ResponseEntity<Cart> mergeCart(@RequestBody CartMergeRequest mergeRequest, Authentication authentication) {
        Cart mergedCart = cartService.mergeCart(mergeRequest);
        return ResponseEntity.ok(mergedCart);
    }

    // Obtiene el carrito del usuario autenticado, o un carrito vacío si es anónimo.
    @GetMapping
    public ResponseEntity<Cart> getCart(Authentication authentication) {
        if (authentication == null || "anonymousUser".equals(authentication.getName())) {
            // Retornamos un carrito vacío para usuario anónimo
            Cart emptyCart = new Cart();
            emptyCart.setItems(null); // O una lista vacía
            return ResponseEntity.ok(emptyCart);
        }
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con email: " + email));
        Cart cart = cartService.getCartForCurrentUser();
        return ResponseEntity.ok(cart);

    }

    // Agrega un producto al carrito del usuario autenticado
    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(
            @RequestParam Long productId,
            @RequestParam(defaultValue = "1") int quantity,
            Authentication authentication) {
        Cart cart = cartService.addToCart(productId, quantity);
        return ResponseEntity.ok(cart);
    }

    // Actualiza la cantidad de un producto en el carrito del usuario autenticado
    @PutMapping("/update")
    public ResponseEntity<Cart> updateCartItem(
            @RequestParam Long productId,
            @RequestParam int quantity,
            Authentication authentication) {
        Cart cart = cartService.updateCartItem(productId, quantity);
        return ResponseEntity.ok(cart);
    }

    // Elimina un producto del carrito del usuario autenticado
    @DeleteMapping("/remove")
    public ResponseEntity<Cart> removeCartItem(
            @RequestParam Long productId,
            Authentication authentication) {
        Cart cart = cartService.removeCartItem(productId);
        return ResponseEntity.ok(cart);
    }
}
