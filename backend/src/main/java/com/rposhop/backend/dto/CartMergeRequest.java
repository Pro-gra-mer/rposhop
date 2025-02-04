package com.rposhop.backend.dto;

import java.util.List;

public class CartMergeRequest {

    private List<CartItemDTO> items;

    // Getters y setters
    public List<CartItemDTO> getItems() {
        return items;
    }
    public void setItems(List<CartItemDTO> items) {
        this.items = items;
    }

    public static class CartItemDTO {
        private Long productId;
        private int quantity;

        public Long getProductId() {
            return productId;
        }
        public void setProductId(Long productId) {
            this.productId = productId;
        }
        public int getQuantity() {
            return quantity;
        }
        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }
    }
}
