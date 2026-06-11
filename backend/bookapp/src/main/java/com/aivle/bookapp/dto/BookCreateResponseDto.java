package com.aivle.bookapp.dto;

import com.aivle.bookapp.domain.Book;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BookCreateResponseDto {

    private Long bookId;
    private String title;
    private String author;
    private String genre;
    private String publisher;
    private String content;
    private String summary;
    private String coverImgUrl;

    public static BookCreateResponseDto from(Book book) {
        return BookCreateResponseDto.builder()
                .bookId(book.getBookId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .genre(book.getGenre())
                .publisher(book.getPublisher())
                .content(book.getContent())
                .summary(book.getSummary())
                .coverImgUrl(book.getCoverImgUrl())
                .build();
    }
}
