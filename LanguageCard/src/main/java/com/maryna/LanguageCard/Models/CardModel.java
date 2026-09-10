package com.maryna.LanguageCard.Models;

import java.util.LinkedList;
import java.util.List;

public class CardModel {
    private int id;
    private String word;
    private String trans_word;
    private String plural;
    private LinkedList<Integer> themaIds = new LinkedList<>();

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

    public LinkedList<Integer> getThemaIds() {
        return themaIds;
    }

    public void setThemaIds(LinkedList<Integer> themaIds) {
        this.themaIds = themaIds;
    }
}
