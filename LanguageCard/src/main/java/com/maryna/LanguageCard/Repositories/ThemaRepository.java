package com.maryna.LanguageCard.Repositories;

import com.maryna.LanguageCard.Models.ThemaModel;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ThemaRepository {
    private final JdbcClient _jdbc;

    public ThemaRepository(JdbcClient jdbc) {
        _jdbc = jdbc;
    }

    public Boolean exists(int themaId) {
        return _jdbc.sql("SELECT EXISTS (SELECT 1 FROM themas WHERE id = :id)")
                .param("id", themaId)
                .query(Boolean.class)
                .single();
    }

    /** One page, newest first, so a theme you just added is on the page you are on. */
    public List<ThemaModel> getPage(int limit, int offset) {
        return _jdbc.sql("SELECT * FROM themas ORDER BY id DESC LIMIT :limit OFFSET :offset")
                .param("limit", limit)
                .param("offset", offset)
                .query(ThemaModel.class)
                .list();
    }

    public long count() {
        return _jdbc.sql("SELECT COUNT(*) FROM themas")
                .query(Long.class)
                .single();
    }

    public Optional<ThemaModel> getById(int id) {
        return _jdbc.sql("SELECT * FROM themas WHERE id = :id")
                .param("id", id)
                .query(ThemaModel.class)
                .optional();
    }

    public ThemaModel create(String name) {
        var keyHolder = new GeneratedKeyHolder();
        _jdbc.sql("INSERT INTO themas(name) VALUES(:name) returning id")
                .param("name", name)
                .update(keyHolder);
        var id = ((Number) keyHolder.getKeys().get("id")).intValue();
        ThemaModel themaModel = new ThemaModel();
        themaModel.setId(id);
        themaModel.setName(name);
        return themaModel;
    }

    public ThemaModel update(ThemaModel themaModel) {
        _jdbc.sql("UPDATE themas SET name = :name WHERE id = :id")
                .param("name", themaModel.getName())
                .param("id", themaModel.getId())
                .update();
        return themaModel;
    }

    public void delete(int id) {
        _jdbc.sql("DELETE FROM themas WHERE id = :id")
                .param("id", id)
                .update();
    }
}
