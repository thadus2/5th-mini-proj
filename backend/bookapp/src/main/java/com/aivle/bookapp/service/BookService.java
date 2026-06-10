package com.aivle.bookapp.service;

import com.aivle.bookapp.domain.Book;
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

    // 단건 조회
    public Book findById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException(id));
    }

    // 전체 조회 + 검색
    public List<Book> getBooks(String keyword) {

        if (keyword == null || keyword.isBlank()) {
            return bookRepository.findAll();
        }

        return bookRepository.findByTitleContainingOrAuthorContaining(keyword, keyword);
    }

    // 전체 조회
    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    // 책 수 조회
    public long count() {
        return bookRepository.count();
    }

    // 제목 검색
    public List<Book> searchByTitle(String title) {
        return bookRepository.findByTitleContaining(title);
    }

    // 제목 + 저자 검색
    public List<Book> searchByTitleAndAuthor(String title, String author) {
        return bookRepository.findByTitleAndAuthor(title, author);
    }

    // 저자의 책 제목 목록 조회
    public List<String> authorGetTitle(String author) {
        return bookRepository.findByAuthor(author).stream().map(Book::getTitle).toList();
    }

    // 페이징 조회
    public Page<Book> getPage(int page, int size, String sortBy) {
        List<String> allowedSortFields = List.of("id", "title", "author");

        if (!allowedSortFields.contains(sortBy)) {
            sortBy = "id";
        }

        Pageable pageable =
                PageRequest.of(page, size, Sort.by(sortBy).ascending());

        return bookRepository.findAll(pageable);
    }

    // 등록
    @Transactional
    public Book create(Book book) {

                return bookRepository.save(book);
    }

    // 수정
    @Transactional
    public Book update(Long id, Book book) {

        Book existing = findById(id);

        if (book.getTitle() != null &&
                !book.getTitle().isBlank()) {
            existing.setTitle(book.getTitle());
        }

        if (book.getAuthor() != null &&
                !book.getAuthor().isBlank()) {
            existing.setAuthor(book.getAuthor());
        }


        return existing;
    }

    // 삭제
    @Transactional
    public void deleteBook(Long id) {
        Book book = findById(id);
        bookRepository.delete(book);
    }

    // 조회수 증가
    @Transactional
    public void increaseViewCount(Long id) {
        Book book = findById(id);

        book.setViewCount(book.getViewCount() + 1);
    }
}