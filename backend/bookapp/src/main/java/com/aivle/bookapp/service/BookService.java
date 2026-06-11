package com.aivle.bookapp.service;

import com.aivle.bookapp.domain.Book;
import com.aivle.bookapp.dto.request.BookCreateRequestDto;
import com.aivle.bookapp.dto.request.BookUpdateRequestDto;
import com.aivle.bookapp.dto.response.BookCreateResponseDto;
import com.aivle.bookapp.dto.response.BookDetailResponseDto;
import com.aivle.bookapp.exception.BookNotFoundException;
import com.aivle.bookapp.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookService {

    private final BookRepository bookRepository;

    public Book findById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException(id));
    }

    public BookDetailResponseDto getBookDetail(Long id) {
        Book book = findById(id);
        return BookDetailResponseDto.from(book);
    }

    public List<Book> getBooks(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return bookRepository.findAll();
        }
        return bookRepository.findByTitleContainingOrAuthorContaining(keyword, keyword);
    }

    @Transactional
    public BookCreateResponseDto create(BookCreateRequestDto dto) {
        Book book = dto.toEntity();
        Book savedBook = bookRepository.save(book);
        return BookCreateResponseDto.from(savedBook);
    }

    @Transactional
    public Book update(Long id, BookUpdateRequestDto dto) {
        Book existing = findById(id);

        if (dto.getTitle() != null && !dto.getTitle().isBlank()) {
            existing.setTitle(dto.getTitle());
        }
        if (dto.getAuthor() != null && !dto.getAuthor().isBlank()) {
            existing.setAuthor(dto.getAuthor());
        }
        if (dto.getContent() != null && !dto.getContent().isBlank()) {
            existing.setContent(dto.getContent());
        }
        if (dto.getGenre() != null && !dto.getGenre().isBlank()) {
            existing.setGenre(dto.getGenre());
        }
        if (dto.getSummary() != null) {
            existing.setSummary(dto.getSummary());
        }
        if (dto.getPublisher() != null) {
            existing.setPublisher(dto.getPublisher());
        }
        if (dto.getCoverImgUrl() != null) {
            existing.setCoverImgUrl(dto.getCoverImgUrl());
        }
        if (dto.getPrice() != null) {
            existing.setPrice(dto.getPrice());
        }

        return existing;
    }

    @Transactional
    public Book changeLikeCount(Long id, boolean isLiked) {
        Book book = findById(id);
        if (isLiked) {
            book.setLikeCount(book.getLikeCount() + 1);
        } else if (book.getLikeCount() > 0) {
            book.setLikeCount(book.getLikeCount() - 1);
        }
        return book;
    }

    @Transactional
    public void deleteBook(Long id) {
        Book book = findById(id);
        bookRepository.delete(book);
    }

    @Transactional
    public void increaseViewCount(Long id) {
        Book book = findById(id);
        book.setViewCount(book.getViewCount() + 1);
    }

    @Transactional
    public void updateCoverImage(Long id, String coverImgUrl) {
        Book book = findById(id);
        book.setCoverImgUrl(coverImgUrl);
    }
}