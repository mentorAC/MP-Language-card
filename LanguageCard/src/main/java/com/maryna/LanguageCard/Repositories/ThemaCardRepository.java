package com.maryna.LanguageCard.Repositories;

import com.maryna.LanguageCard.Models.CardModel;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

@Service
public class ThemaCardRepository {
    private final JdbcClient _jdbc;
    public ThemaCardRepository(JdbcClient jdbcClient)
    {
        _jdbc = jdbcClient;
    }
    public void bind(int cardId, int themaId){
        _jdbc.sql("INSERT INTO THEMAS_CARDS(THEMA_ID, CARD_ID) VALUES(:themaId, :cardId)")
                .param("themaId",themaId)
                .param("cardId", cardId)
                .update();
    }
    public Boolean exists(int themaId){
        return _jdbc.sql("SELECT EXISTS (SELECT 1 FROM THEMAS_CARDS WHERE THEMA_ID :id)")
                .param("id", themaId)
                .query(Boolean.class)
                .single();
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

}
