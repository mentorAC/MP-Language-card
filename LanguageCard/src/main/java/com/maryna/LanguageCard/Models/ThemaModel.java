package com.maryna.LanguageCard.Models;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ThemaModel {
    private int id;

    @NotBlank(message = "The theme name is required.")
    @Size(max = 100, message = "The theme name is too long.")
    private String name;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
