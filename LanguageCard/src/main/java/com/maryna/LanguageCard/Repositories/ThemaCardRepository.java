package com.maryna.LanguageCard.Repositories;

import com.maryna.LanguageCard.Models.ThemaModel;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ThemaCardRepository {
    private final JdbcClient _jdbc;

    public ThemaCardRepository(JdbcClient jdbcClient) {
        _jdbc = jdbcClient;
    }

    public void bind(int cardId, int themaId) {
        _jdbc.sql("""
                INSERT INTO themas_cards(thema_id, card_id) VALUES(:themaId, :cardId)
                ON CONFLICT DO NOTHING
                """)
                .param("themaId", themaId)
                .param("cardId", cardId)
                .update();
    }

    public void unbind(int cardId, int themaId) {
        _jdbc.sql("""
                DELETE FROM themas_cards
                WHERE card_id = :cardId
                AND thema_id = :themaId
                """)
                .param("cardId", cardId)
                .param("themaId", themaId)
                .update();
    }

    /** Whether the theme still holds cards — a theme with cards is not deletable. */
    public Boolean hasCards(int themaId) {
        return _jdbc.sql("SELECT EXISTS (SELECT 1 FROM themas_cards WHERE thema_id = :id)")
                .param("id", themaId)
                .query(Boolean.class)
                .single();
    }

    /** The themes a card belongs to, names included, for the card's edit form. */
    public List<ThemaModel> getThemasByCard(int cardId) {
        return _jdbc.sql("""
                SELECT themas.* FROM themas
                JOIN themas_cards ON themas.id = themas_cards.thema_id
                WHERE themas_cards.card_id = :cardId
                ORDER BY themas.name
                """)
                .param("cardId", cardId)
                .query(ThemaModel.class)
                .list();
    }

    public List<Integer> getThemaIdsByCard(int cardId) {
        return _jdbc.sql("SELECT thema_id FROM themas_cards WHERE card_id = :cardId")
                .param("cardId", cardId)
                .query(Integer.class)
                .list();
    }
}
