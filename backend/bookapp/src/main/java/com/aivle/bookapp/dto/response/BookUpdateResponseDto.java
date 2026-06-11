package com.aivle.bookapp.dto.response;

import com.aivle.bookapp.domain.Book;
import lombok.Getter;

@Getter
public class BookUpdateResponseDto {
    private final Long bookId;
    private final String title;
    private final String author;
    private final String content;
    private final String publisher;
    private final Integer price;
    private final String genre;
    private final String summary;
    private final Integer viewCount;
    private final Integer likeCount;
    private final String coverImgUrl;

    public BookUpdateResponseDto(Book book) {
        this.bookId = book.getBookId();
        this.title = book.getTitle();
        this.author = book.getAuthor();
        this.content = book.getContent();
        this.publisher = book.getPublisher();
        this.price = book.getPrice();
        this.genre = book.getGenre();
        this.summary = book.getSummary();
        this.viewCount = book.getViewCount();
        this.likeCount = book.getLikeCount();
        this.coverImgUrl = book.getCoverImgUrl();
    }
}