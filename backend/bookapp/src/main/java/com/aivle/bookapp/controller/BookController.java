package com.aivle.bookapp.controller;

import com.aivle.bookapp.domain.Book;
import com.aivle.bookapp.dto.request.BookCreateRequestDto;
import com.aivle.bookapp.dto.request.BookUpdateRequestDto;
import com.aivle.bookapp.dto.response.*;
import com.aivle.bookapp.exception.LoginRequiredException;
import com.aivle.bookapp.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping("")
    public ResponseEntity<List<BookListResponseDto>> getBooks(@RequestParam(required = false) String keyword) {
        List<BookListResponseDto> response = bookService.getBooks(keyword).stream()
                .map(BookListResponseDto::from)
                .toList();

        return ResponseEntity.ok(response);
    }

    // 내가 등록한 도서 조회
    @GetMapping("/my")
    public ResponseEntity<List<BookListResponseDto>> getMyBooks(
            @AuthenticationPrincipal String userId
    ) {
        Long currentUserId = Long.parseLong(userId);

        List<BookListResponseDto> response = bookService.getMyBooks(currentUserId).stream()
                .map(BookListResponseDto::from)
                .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookDetailResponseDto> getBookDetail(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(bookService.getBookDetail(id));
    }

    @PostMapping("")
    public ResponseEntity<BookCreateResponseDto> createBook(
            @Valid @RequestBody BookCreateRequestDto dto,
            @AuthenticationPrincipal String userId
    ) {
        Long currentUserId = Long.parseLong(userId);

        BookCreateResponseDto responseDto = bookService.create(dto, currentUserId);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<BookUpdateResponseDto> updateBook(
            @PathVariable Long id,
            @Valid @RequestBody BookUpdateRequestDto dto,
            @AuthenticationPrincipal String userId
    ) {
        Long currentUserId = Long.parseLong(userId);

        Book updated = bookService.update(id, dto, currentUserId);

        return ResponseEntity.ok(new BookUpdateResponseDto(updated));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<BookFavoriteResponseDto> toggleLike(
            @PathVariable Long id,
            @AuthenticationPrincipal String userId) {
        Long currentUserId = getCurrentUserId(userId);
        boolean isLiked = bookService.toggleLike(id, currentUserId);

        Book book = bookService.findById(id);

        BookFavoriteResponseDto response = BookFavoriteResponseDto.from(book, isLiked);

        return ResponseEntity.ok(response);
    }

    // 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(
            @PathVariable Long id,
            @AuthenticationPrincipal String userId
    ) {
        Long currentUserId = Long.parseLong(userId);

        bookService.deleteBook(id, currentUserId);

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/views")
    public ResponseEntity<Void> increaseViewCount(@PathVariable Long id) {
        bookService.increaseViewCount(id);
        return ResponseEntity.ok().build();
    }

    // 표지 이미지 수정
    @PatchMapping("/{id}/cover-img")
    public ResponseEntity<Void> updateCoverImage(
            @PathVariable Long id,
            @RequestBody Map<String, String> request
    ) {
        String pureUrl = request.get("coverImgUrl");
        bookService.updateCoverImage(id, pureUrl);

        return ResponseEntity.ok().build();
    }

    private Long getCurrentUserId(String userId) {
        if (userId == null || userId.isBlank()) {
            throw new LoginRequiredException("로그인이 필요합니다.");
        }

        return Long.parseLong(userId);
    }
}