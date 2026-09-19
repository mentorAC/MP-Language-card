package com.maryna.LanguageCard.Models;

/**
 * The `page` / `size` pair every list endpoint accepts, already clamped: a
 * negative page or an unbounded size never reaches a repository.
 */
public record PageRequestModel(int page, int size) {
    public static final int DEFAULT_SIZE = 12;
    public static final int MAX_SIZE = 100;

    public static PageRequestModel of(Integer page, Integer size) {
        int safePage = page == null || page < 0 ? 0 : page;
        int safeSize = size == null || size < 1 ? DEFAULT_SIZE : Math.min(size, MAX_SIZE);
        return new PageRequestModel(safePage, safeSize);
    }

    public int limit() {
        return size;
    }

    public int offset() {
        return page * size;
    }
}
