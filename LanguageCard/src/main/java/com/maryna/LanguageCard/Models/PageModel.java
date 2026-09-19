package com.maryna.LanguageCard.Models;

import java.util.List;

/**
 * One page of a list endpoint: the rows, plus everything the client needs to
 * draw a pager without a second round trip.
 */
public class PageModel<T> {
    private List<T> items;
    private int page;
    private int size;
    private long total;
    private int totalPages;

    public PageModel() {
    }

    public PageModel(List<T> items, int page, int size, long total) {
        this.items = items;
        this.page = page;
        this.size = size;
        this.total = total;
        this.totalPages = size > 0 ? (int) Math.ceil((double) total / size) : 0;
    }

    public List<T> getItems() {
        return items;
    }

    public void setItems(List<T> items) {
        this.items = items;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }
}
