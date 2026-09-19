package com.maryna.LanguageCard.Models;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

public class CardModel {
    private int id;

    @NotBlank(message = "The word is required.")
    @Size(max = 200, message = "The word is too long.")
    private String word;

    @NotBlank(message = "The translation is required.")
    @Size(max = 200, message = "The translation is too long.")
    private String trans_word;

    @Size(max = 200, message = "The plural form is too long.")
    private String plural;

    /**
     * Both directions of the card <-> theme link. Reads come back with the names
     * filled in, so the client can label a card without a second request; writes
     * only need the ids, and anything else in the objects is ignored.
     */
    private List<ThemaModel> themas = new ArrayList<>();

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }

    public String getTransWord() {
        return trans_word;
    }

    public void setTransWord(String trans_word) {
        this.trans_word = trans_word;
    }

    public String getPlural() {
        return plural;
    }

    public void setPlural(String plural) {
        this.plural = plural;
    }

    public List<ThemaModel> getThemas() {
        return themas;
    }

    public void setThemas(List<ThemaModel> themas) {
        this.themas = themas == null ? new ArrayList<>() : themas;
    }

    /** The ids of {@link #getThemas()}, de-duplicated and in the order given. */
    public Set<Integer> themaIds() {
        Set<Integer> ids = new LinkedHashSet<>();
        for (ThemaModel thema : themas) {
            if (thema != null && thema.getId() != 0) {
                ids.add(thema.getId());
            }
        }
        return ids;
    }
}
