package com.aivle.bookapp.service;

import com.aivle.bookapp.domain.Book;
import com.aivle.bookapp.domain.Favorite;
import com.aivle.bookapp.domain.User;
import com.aivle.bookapp.dto.request.BookCreateRequestDto;
import com.aivle.bookapp.dto.request.BookUpdateRequestDto;
import com.aivle.bookapp.dto.response.BookCreateResponseDto;
import com.aivle.bookapp.dto.response.BookDetailResponseDto;
import com.aivle.bookapp.exception.BookNotFoundException;
import com.aivle.bookapp.repository.BookRepository;
import com.aivle.bookapp.repository.FavoriteRepository;
import com.aivle.bookapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final FavoriteRepository favoriteRepository;

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

    public List<Book> getMyBooks(Long userId) {
        return bookRepository.findByUser_UserIdOrderByBookIdDesc(userId);
    }

    @Transactional
    public BookCreateResponseDto create(BookCreateRequestDto dto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("로그인이 필요합니다."));

        Book book = dto.toEntity();

        book.setUser(user);

        Book savedBook = bookRepository.save(book);
        return BookCreateResponseDto.from(savedBook);
    }

    @Transactional
    public Book update(Long id, BookUpdateRequestDto dto, Long userId) {
        Book existing = findById(id);

        if (existing.getUser() == null) {
            throw new IllegalStateException("작성자 정보가 없습니다.");
        }

        if (!existing.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("본인이 작성한 글만 수정할 수 있습니다.");
        }

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

        return existing;
    }

    @Transactional
    public boolean toggleLike(Long bookId, Long userId) {
        Book book = findById(bookId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        Optional<Favorite> favoriteOpt = favoriteRepository.findByUserAndBook(user, book);

        if (favoriteOpt.isPresent()) {
            favoriteRepository.delete(favoriteOpt.get());

            if (book.getLikeCount() > 0) {
                book.setLikeCount(book.getLikeCount() - 1);
            }

            return false;
        } else {
            Favorite favorite = new Favorite(user, book);
            favoriteRepository.save(favorite);
            book.setLikeCount(book.getLikeCount() + 1);

            return true;
        }
    }

    @Transactional
    public void deleteBook(Long id, Long userId) {
        Book book = findById(id);

        if (book.getUser() == null) {
            throw new IllegalStateException("작성자 정보 확인에 문제가 생겼습니다.");
        }

        if (!book.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("본인이 작성한 글만 삭제할 수 있습니다.");
        }

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