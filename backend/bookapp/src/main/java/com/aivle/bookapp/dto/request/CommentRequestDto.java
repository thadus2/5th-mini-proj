package com.aivle.bookapp.dto.request;

import com.aivle.bookapp.domain.Comment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CommentRequestDto {
    private String content;
}
