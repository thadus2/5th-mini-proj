package com.aivle.bookapp.repository;

import com.aivle.bookapp.domain.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByBook_BookIdOrderByCreatedAtAsc(Long bookId);
}