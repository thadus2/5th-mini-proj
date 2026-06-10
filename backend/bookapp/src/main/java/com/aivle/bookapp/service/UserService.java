package com.aivle.bookapp.service;

import com.aivle.bookapp.domain.User;
import com.aivle.bookapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    // 회원가입
    @Transactional
    public User signup(User user) {
        validateDuplicateUser(user);

        return userRepository.save(user);
    }

    // 로그인
    public User signin(String loginId, String password) {
        // 아이디 검증
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalStateException("비밀번호 혹은 ID 오류"));

        // 비밀번호 검증 (평문 비교)
        if (!user.getPassword().equals(password)) {
            throw new IllegalStateException("비밀번호 혹은 ID 오류");
        }

        return user;
    }

    // 중복 검사
    private void validateDuplicateUser(User user) {

        if (userRepository.existsByLoginId(user.getLoginId())) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }

        if (userRepository.existsByNickName(user.getNickName())) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }
    }

    // 회원 조회
    public User findById(Long userId) {
        return userRepository.findById(userId).orElseThrow(() ->
                        new IllegalArgumentException("존재하지 않는 회원입니다."));
    }
}