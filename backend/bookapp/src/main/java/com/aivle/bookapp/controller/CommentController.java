package com.aivle.bookapp.controller;

import com.aivle.bookapp.dto.request.CommentRequestDto;
import com.aivle.bookapp.dto.response.CommentResponseDto;
import com.aivle.bookapp.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/books/{bookId}/comments")
    public ResponseEntity<CommentResponseDto> createComment(
            @PathVariable Long bookId,
            @AuthenticationPrincipal String userId,
            @RequestBody CommentRequestDto requestDto) {

        CommentResponseDto responseDto = commentService.createComment(bookId, userId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @GetMapping("/books/{bookId}/comments")
    public ResponseEntity<List<CommentResponseDto>> getComments(@PathVariable Long bookId) {
        List<CommentResponseDto> comments = commentService.getCommentsByBook(bookId);
        return ResponseEntity.status(HttpStatus.OK).body(comments);
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal String loginId) {

        commentService.deleteComment(commentId, loginId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}