package com.aivle.bookapp.repository;
import com.aivle.bookapp.domain.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findByAuthor(String author);
    List<Book> findByTitleContaining(String keyword);
    List<Book> findByTitleAndAuthor(String title, String author);
    List<Book> findByTitleContainingOrAuthorContaining(String title, String author);

}
