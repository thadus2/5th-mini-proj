package com.aivle.bookapp.dto.response;

import com.aivle.bookapp.domain.Book;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BookFavoriteResponseDto {

    private Long bookId;
    private Integer likeCount;
    private Boolean isLiked;

    public static BookFavoriteResponseDto from(Book book, boolean isLiked) {
        return new BookFavoriteResponseDto(
                book.getBookId(),
                book.getLikeCount(),
                isLiked
        );
    }
}