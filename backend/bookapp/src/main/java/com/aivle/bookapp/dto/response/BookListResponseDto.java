package com.aivle.bookapp.dto.response;

import com.aivle.bookapp.domain.Book;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BookListResponseDto {
    private Long bookId;
    private String title;
    private String author;
    private String coverImgUrl;
    private String summary;
    private String genre;
    private Integer viewCount;
    private Integer likeCount;

    public static BookListResponseDto from (Book book) {
        return new BookListResponseDto(
                book.getBookId(),
                book.getTitle(),
                book.getAuthor(),
                book.getCoverImgUrl(),
                book.getSummary(),
                book.getGenre(),
                book.getViewCount(),
                book.getLikeCount()
        );
    }
}
