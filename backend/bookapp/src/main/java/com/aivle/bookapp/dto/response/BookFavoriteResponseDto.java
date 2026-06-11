package com.aivle.bookapp.dto.response;

import com.aivle.bookapp.domain.Book;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BookFavoriteResponseDto {

    private Long bookId;
    private Integer likeCount;

    public static BookFavoriteResponseDto from(Book book) {
        return new BookFavoriteResponseDto(
                book.getBookId(),
                book.getLikeCount()
        );
    }
}