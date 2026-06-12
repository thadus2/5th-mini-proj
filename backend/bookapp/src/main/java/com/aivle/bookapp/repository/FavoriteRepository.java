package com.aivle.bookapp.repository;

import com.aivle.bookapp.domain.Book;
import com.aivle.bookapp.domain.Favorite;
import com.aivle.bookapp.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    Optional<Favorite> findByUserAndBook(User user, Book book);
}