package com.aivle.bookapp.domain;

import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.annotation.Nulls;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookId;


    @Column(nullable = false, length = 200)
    @NotBlank
    private String title;

    @Column(nullable = false, length = 200)
    @NotBlank
    private String author;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    @NotBlank
    private String content;

    private String publisher;

    private Integer price;

    private String recentPublished;
    private String recentUpdated;

    private String genre;

    @Column(length = 1000)
    private String summary;

    @Column(nullable = false)
    @NotNull
    private Integer viewCount = 0;

    @Column(nullable = false)
    @NotNull
    private Integer likeCount = 0;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String coverImgUrl;
}
