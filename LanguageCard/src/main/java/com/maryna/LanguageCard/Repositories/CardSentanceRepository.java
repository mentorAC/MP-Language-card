package com.maryna.LanguageCard.Repositories;

import com.maryna.LanguageCard.Models.SentanceModel;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

@Service
public class CardSentanceRepository {
    private final JdbcClient _jdbc;

    public CardSentanceRepository(JdbcClient jdbc) {
        _jdbc = jdbc;
    }

    public void bind(SentanceModel sentanceModel, int cardId) {
        _jdbc.sql("INSERT INTO cards_sentance(sentance_id, card_id) VALUES(:id, :cardId)")
                .param("cardId", cardId)
                .param("id", sentanceModel.getId())
                .update();
    }

    /** Whether the card still holds sentences — a card with sentences is not deletable. */
    public Boolean hasSentances(int cardId) {
        return _jdbc.sql("SELECT EXISTS (SELECT 1 FROM cards_sentance WHERE card_id = :id)")
                .param("id", cardId)
                .query(Boolean.class)
                .single();
    }
}
