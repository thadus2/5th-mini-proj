package com.aivle.bookapp.dto;

import com.aivle.bookapp.domain.Book;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BookDetailResponseDto {
    private Long bookId;
    private String title;
    private String author;
    private String publisher;
    private String genre;
    private Integer likeCount;
    private Integer viewCount;
    private String summary;
    private String content;
    private String coverImgUrl;

    public static BookDetailResponseDto from(Book book) {
        return BookDetailResponseDto.builder()
                .bookId(book.getBookId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .publisher(book.getPublisher())
                .genre(book.getGenre())
                .likeCount(book.getLikeCount())
                .viewCount(book.getViewCount())
                .summary(book.getSummary())
                .content(book.getContent())
                .coverImgUrl(book.getCoverImgUrl())
                .build();
    }
}