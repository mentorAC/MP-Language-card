package com.maryna.LanguageCard.Models;

import jakarta.validation.constraints.NotBlank;

public class SentanceModel {
    private int id;

    @NotBlank(message = "The sentence text is required.")
    private String text;

    @NotBlank(message = "The sentence translation is required.")
    private String translate;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getTranslate() {
        return translate;
    }

    public void setTranslate(String translate) {
        this.translate = translate;
    }
}
