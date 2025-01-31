package com.rposhop.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public class CategoryRequest {

    @Schema(description = "Nombre de la categoría", example = "Sudaderas")
    private String name;

    public CategoryRequest() {}

    public CategoryRequest(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
