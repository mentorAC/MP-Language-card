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

    public CardRepository(JdbcClient jdbcClient) {
        _jdbc = jdbcClient;
    }

    public CardModel create(CardModel cardModel) {
        var keyHolder = new GeneratedKeyHolder();
        _jdbc.sql("INSERT INTO cards(word, trans_word, plural) VALUES(:word, :trans_Word, :plural) returning id")
                .param("word", cardModel.getWord())
                .param("trans_Word", cardModel.getTransWord())
                .param("plural", cardModel.getPlural())
                .update(keyHolder);
        var id = ((Number) keyHolder.getKeys().get("id")).intValue();
        cardModel.setId(id);
        return cardModel;
    }

    public Boolean exists(int cardId) {
        return _jdbc.sql("SELECT EXISTS (SELECT 1 FROM cards WHERE id = :id)")
                .param("id", cardId)
                .query(Boolean.class)
                .single();
    }

    public void delete(int id) {
        _jdbc.sql("DELETE FROM cards WHERE id = :id")
                .param("id", id)
                .update();
    }

    public Optional<CardModel> getById(int id) {
        return _jdbc.sql("SELECT * FROM cards WHERE id = :id")
                .param("id", id)
                .query(CardModel.class)
                .optional();
    }

    /**
     * One page of cards. `themaId` of 0 means "no filter" — the plain /cards page
     * lists everything, while opening a theme narrows it down through the join.
     *
     * `cards.*` rather than `*`: the join would otherwise also select
     * themas_cards.card_id, and the row mapper would have two `id`-ish columns
     * to choose from.
     */
    public List<CardModel> getPage(int themaId, int limit, int offset) {
        var sql = themaId > 0
                ? """
                  SELECT cards.* FROM cards
                  JOIN themas_cards ON cards.id = themas_cards.card_id
                  WHERE themas_cards.thema_id = :themaId
                  ORDER BY cards.id DESC LIMIT :limit OFFSET :offset
                  """
                : "SELECT cards.* FROM cards ORDER BY cards.id DESC LIMIT :limit OFFSET :offset";

        var statement = _jdbc.sql(sql)
                .param("limit", limit)
                .param("offset", offset);
        if (themaId > 0) {
            statement = statement.param("themaId", themaId);
        }
        return statement.query(CardModel.class).list();
    }

    public long count(int themaId) {
        if (themaId <= 0) {
            return _jdbc.sql("SELECT COUNT(*) FROM cards")
                    .query(Long.class)
                    .single();
        }
        return _jdbc.sql("SELECT COUNT(*) FROM themas_cards WHERE thema_id = :themaId")
                .param("themaId", themaId)
                .query(Long.class)
                .single();
    }

    public int update(CardModel cardModel) {
        _jdbc.sql("UPDATE cards SET word = :word, trans_word = :trans_Word, plural = :plural WHERE id = :id")
                .param("word", cardModel.getWord())
                .param("trans_Word", cardModel.getTransWord())
                .param("plural", cardModel.getPlural())
                .param("id", cardModel.getId())
                .update();
        return cardModel.getId();
    }
}
