package com.aivle.bookapp.dto.response;

import com.aivle.bookapp.domain.Comment;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class CommentResponseDto {
    private Long commentId;
    private String content;
    private String nickname;
    private Long userId;
    private LocalDateTime createdAt;

    public CommentResponseDto(Comment comment) {
        this.commentId = comment.getCommentId();
        this.content = comment.getContent();
        this.nickname = comment.getUser().getNickName();
        this.userId = comment.getUser().getUserId();
        this.createdAt = comment.getCreatedAt();
    }
}
