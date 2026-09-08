package com.maryna.LanguageCard.Repositories;

import com.maryna.LanguageCard.Models.CardModel;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CardRepository {
    private final JdbcClient _jdbc;

    public CardRepository(JdbcClient jdbcClient){
        _jdbc = jdbcClient;
    }

    public CardModel create(CardModel cardModel) {
        var keyHolder = new GeneratedKeyHolder();
        _jdbc.sql("INSERT INTO CARDS(WORD, TRANS_WORD, PLURAL) VALUES(:word, :trans_Word, :plural) returning id")
                .param("word",cardModel.getWord())
                .param("trans_Word",cardModel.getTransWord())
                .param("plural",cardModel.getPlural())
                .update(keyHolder);
        var id = ((Number)keyHolder.getKeys().get("id")).intValue();
        cardModel.setId(id);
        return cardModel;
    }
    public Boolean exists(int cardId){
        var count = _jdbc.sql("SELECT COUNT(*) FROM CARDS WHERE ID = :id")
                .param("id", cardId)
                .query(Integer.class)
                .single();
        return count == 1;
    }
    public void delete(int id){
        _jdbc.sql("DELETE FROM CARDS WHERE ID = :id")
                .param("id", id)
                .update();
    }
    public Optional<CardModel> getById(int id){
        return _jdbc.sql("SELECT * FROM CARDS WHERE ID = :id")
                .param("id", id)
                .query(CardModel.class)
                .optional();
    }
    public List<CardModel> getAll(int themaId) {
        return _jdbc.sql("SELECT * FROM CARDS " +
                        "JOIN themas_cards ON cards.id = themas_cards.card_id " +
                        "WHERE themas_cards.thema_id = :themaId;")
                .param("themaId", themaId)
                .query(CardModel.class)
                .list();
    }
    public int selectOne(CardModel cardModel) {
        var count = _jdbc.sql("SELECT COUNT(*) FROM CARDS WHERE ID = :id")
                .param("id", cardModel.getId())
                .query(Integer.class)
                .single();
        return count;
    }
    public int update(CardModel cardModel){
        _jdbc.sql("UPDATE CARDS SET WORD = :word, TRANS_WORD = :trans_Word, PLURAL = :plural WHERE ID = :id")
                .param("word", cardModel.getWord())
                .param("trans_Word", cardModel.getTransWord())
                .param("plural", cardModel.getPlural())
                .param("id", cardModel.getId())
                .update();
        return cardModel.getId();
    }
}
