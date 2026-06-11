package com.aivle.bookapp.controller;

import com.aivle.bookapp.domain.Book;
import com.aivle.bookapp.dto.BookListResponseDto;
import com.aivle.bookapp.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

// 전체 조회 + 검색

//    @GetMapping("")
//    public ResponseEntity<List<Book>> getBooks(@RequestParam(required = false) String keyword) {
//        return ResponseEntity.ok(bookService.getBooks(keyword));
//    }

    @GetMapping("")
    public ResponseEntity<List<BookListResponseDto>> getBooks(@RequestParam(required = false) String keyword) {
        List<BookListResponseDto> response = bookService.getBooks(keyword).stream()
                .map(BookListResponseDto::from)
                .toList();

        return ResponseEntity.ok(response);
    }

// 단건 조회

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBook(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.findById(id));
    }

// 등록

    @PostMapping("")
    public ResponseEntity<Book> createBook(@Valid @RequestBody Book book) {
        Book saved = bookService.create(book);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

// 수정

    @PatchMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody Book book) {
        Book updated = bookService.update(id, book);

        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/likes")
    public ResponseEntity<Book> toggleLike(@PathVariable Long id, @RequestParam boolean isLiked) {
        Book updated = bookService.changeLikeCount(id, isLiked);
        return ResponseEntity.ok(updated);
    }

// 삭제

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);

        return ResponseEntity.noContent().build();
    }

    // 조회수 증가
    @PatchMapping("/{id}/views")
    public ResponseEntity<Void> increaseViewCount(@PathVariable Long id) {
        bookService.increaseViewCount(id);
        return ResponseEntity.ok().build();
    }
}
