package com.aivle.bookapp.service;

import com.aivle.bookapp.config.jwt.JwtTokenProvider;
import com.aivle.bookapp.domain.User;
import com.aivle.bookapp.dto.request.UserUpdateRequestDto;
import com.aivle.bookapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    // 회원가입
    @Transactional
    public User signup(User user) {
        validateDuplicateUser(user);

        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        return userRepository.save(user);
    }

    // 로그인
    public String signin(String loginId, String password) {
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalStateException("비밀번호 혹은 ID 오류"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalStateException("비밀번호 혹은 ID 오류");
        }

        return jwtTokenProvider.createToken(user.getUserId(), user.getLoginId());
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

    // 회원 정보 수정
    @Transactional
    public User updateUser(Long userId, UserUpdateRequestDto request) {
        User user = findById(userId);

        if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()) {
            throw new IllegalArgumentException("현재 비밀번호를 입력해 주세요.");
        }

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }

        if (
                request.getNickName() != null &&
                        !request.getNickName().isBlank() &&
                        !request.getNickName().equals(user.getNickName())
        ) {
            if (userRepository.existsByNickName(request.getNickName())) {
                throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
            }

            user.setNickName(request.getNickName());
        }

        if (
                request.getEmail() != null &&
                        !request.getEmail().isBlank() &&
                        !request.getEmail().equals(user.getEmail())
        ) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
            }

            user.setEmail(request.getEmail());
        }

        if (request.getAge() != null) {
            user.setAge(request.getAge());
        }

        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }

        if (request.getAddress() != null && !request.getAddress().isBlank()) {
            user.setAddress(request.getAddress());
        }

        return user;
    }

    // 비밀번호 변경
    @Transactional
    public void changePassword(Long userId, String currentPassword, String newPassword) {
        User user = findById(userId);

        if (currentPassword == null || currentPassword.isBlank()) {
            throw new IllegalArgumentException("현재 비밀번호를 입력해 주세요.");
        }

        if (newPassword == null || newPassword.isBlank()) {
            throw new IllegalArgumentException("새 비밀번호를 입력해 주세요.");
        }

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
    }
}