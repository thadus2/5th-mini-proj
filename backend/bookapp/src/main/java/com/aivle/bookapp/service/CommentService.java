package com.aivle.bookapp.service;

import com.aivle.bookapp.domain.Book;
import com.aivle.bookapp.domain.Comment;
import com.aivle.bookapp.domain.User;
import com.aivle.bookapp.dto.request.CommentRequestDto;
import com.aivle.bookapp.dto.response.CommentResponseDto;
import com.aivle.bookapp.repository.BookRepository;
import com.aivle.bookapp.repository.CommentRepository;
import com.aivle.bookapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {
    private final CommentRepository commentRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Transactional
    public CommentResponseDto createComment(Long bookId, String loginId, CommentRequestDto dto) {
        Long userId = Long.valueOf(loginId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 도서입니다."));

        Comment comment = new Comment(user, book, dto.getContent());
        Comment savedComment = commentRepository.save(comment);

        return new CommentResponseDto(savedComment);
    }

    public List<CommentResponseDto> getCommentsByBook(Long bookId) {
        List<Comment> comments = commentRepository.findByBook_BookIdOrderByCreatedAtAsc(bookId);

        return comments.stream()
                .map(CommentResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteComment(Long commentId, String loginId) {
        Long userId = Long.valueOf(loginId);

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 댓글입니다."));

        System.out.println("comment id: " + comment.getUser().getUserId() + "loginId: " + loginId);
        if (!Objects.equals(comment.getUser().getUserId(), userId)) {
            throw new IllegalStateException("본인이 작성한 댓글만 삭제할 수 있습니다.");
        }

        commentRepository.delete(comment);
    }
}
