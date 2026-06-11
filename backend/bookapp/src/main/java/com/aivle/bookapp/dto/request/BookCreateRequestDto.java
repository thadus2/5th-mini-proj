package com.aivle.bookapp.dto.request;

import com.aivle.bookapp.domain.Book;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class BookCreateRequestDto {

    @NotBlank(message = "도서 제목은 필수입니다.")
    private String title;

    @NotBlank(message = "작가 이름은 필수입니다.")
    private String author;

    @NotBlank(message = "본문 내용은 필수입니다.")
    private String content;

    private String publisher;
    private Integer price;
    private String genre;
    private String summary;
    private String coverImgUrl;

    public Book toEntity() {
        Book book = new Book();
        book.setTitle(this.title);
        book.setAuthor(this.author);
        book.setContent(this.content);
        book.setPublisher(this.publisher);
        book.setPrice(this.price);
        book.setGenre(this.genre);
        book.setSummary(this.summary);
        book.setCoverImgUrl(this.coverImgUrl);
        return book;
    }
}