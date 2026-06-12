package com.aivle.bookapp.controller;

import com.aivle.bookapp.domain.Book;
import com.aivle.bookapp.dto.request.BookCreateRequestDto;
import com.aivle.bookapp.dto.request.BookUpdateRequestDto;
import com.aivle.bookapp.dto.response.*;
import com.aivle.bookapp.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
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

    // 전체 조회 + 검색
    @GetMapping("")
    public ResponseEntity<List<BookListResponseDto>> getBooks(@RequestParam(required = false) String keyword) {
        List<BookListResponseDto> response = bookService.getBooks(keyword).stream()
                .map(BookListResponseDto::from)
                .toList();
        return ResponseEntity.ok(response);
    }

    // 단건 조회
    @GetMapping("/{id}")
    public ResponseEntity<BookDetailResponseDto> getBookDetail(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(bookService.getBookDetail(id));
    }

    // 등록
    @PostMapping("")
    public ResponseEntity<BookCreateResponseDto> createBook(@Valid @RequestBody BookCreateRequestDto dto, @AuthenticationPrincipal String userId) {
        Long currentUserId = Long.parseLong(userId);
        BookCreateResponseDto responseDto = bookService.create(dto, currentUserId);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    // 수정 (UpdateResponseDto 대신 UpdateRequestDto를 Body로 받음)
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

    // 좋아요 토글
    @PostMapping("/{id}/like")
    public ResponseEntity<BookFavoriteResponseDto> toggleLike(
            @PathVariable Long id,
            @AuthenticationPrincipal String userId) {
        Long currentUserId = Long.parseLong(userId);
        boolean isLiked = bookService.toggleLike(id, currentUserId);

        Book book = bookService.findById(id);

        BookFavoriteResponseDto response = BookFavoriteResponseDto.from(book, isLiked);
        return ResponseEntity.ok(response);

    }

    // 삭제 (204 No Content 깔깍의 정석)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id, @AuthenticationPrincipal String userId) {
        Long currentUserId = Long.parseLong(userId);

        bookService.deleteBook(id, currentUserId);
        return ResponseEntity.noContent().build();
    }

    // 조회수 증가
    @PatchMapping("/{id}/views")
    public ResponseEntity<Void> increaseViewCount(@PathVariable Long id) {
        bookService.increaseViewCount(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/cover-img")
    public ResponseEntity<Void> updateCoverImage(
            @PathVariable Long id, @RequestBody Map<String, String> request) {
        String pureUrl = request.get("coverImgUrl");
        bookService.updateCoverImage(id, pureUrl);
        return ResponseEntity.ok().build();
    }
}