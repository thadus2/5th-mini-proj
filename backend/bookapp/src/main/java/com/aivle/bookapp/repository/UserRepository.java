package com.aivle.bookapp.repository;

import com.aivle.bookapp.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByLoginId(String loginId);

    boolean existsByNickName(String nickName);

    boolean existsByEmail(String email);
}