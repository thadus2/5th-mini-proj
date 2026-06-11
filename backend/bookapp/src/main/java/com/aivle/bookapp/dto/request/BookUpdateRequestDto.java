package com.aivle.bookapp.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class BookUpdateRequestDto {
    private String title;
    private String author;
    private String content;
    private String publisher;
    private Integer price;
    private String genre;
    private String summary;
    private String coverImgUrl;
}