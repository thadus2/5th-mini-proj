package com.aivle.bookapp.controller;

import com.aivle.bookapp.config.jwt.JwtTokenProvider;
import com.aivle.bookapp.domain.User;
import com.aivle.bookapp.dto.request.PasswordChangeRequestDto;

import com.aivle.bookapp.dto.response.UserInfoResponseDto;
import com.aivle.bookapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    // 1. 회원가입
    @PostMapping("/sign-up")
    public ResponseEntity<User> signup(@RequestBody User user) {
        User savedUser = userService.signup(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    // 2. 로그인
    @PostMapping("/sign-in")
    public ResponseEntity<Map<String, Object>> signIn(@RequestBody Map<String, String> request) {
        String accessToken = userService.signin(request.get("loginId"), request.get("password"));

        Map<String, Object> response = new HashMap<>();
        response.put("grantType", "Bearer");
        response.put("accessToken", accessToken);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // 3. 회원 정보 수정 API (PUT)
    @PutMapping("/user")
    public ResponseEntity<User> updateUser(
            @RequestHeader("Authorization") String tokenHeader,
            @RequestBody User userRequest) {

        // "Bearer " 접두사를 제거하고 순수 JWT 토큰만 추출하여 userId를 꺼냅니다.
        Long userId = extractUserIdFromHeader(tokenHeader);

        // 서비스의 정보 수정 로직을 호출합니다.
        User updatedUser = userService.updateUser(userId, userRequest);

        return ResponseEntity.ok(updatedUser);
    }

    // 4. 비밀번호 변경 API (PATCH)
    @PatchMapping("/user/password")
    public ResponseEntity<Map<String, String>> changePassword(
            @RequestHeader("Authorization") String tokenHeader,
            @RequestBody PasswordChangeRequestDto passwordDto) {

        Long userId = extractUserIdFromHeader(tokenHeader);

        // 서비스의 비밀번호 변경 로직을 호출합니다. (BCrypt 검증 및 변환이 내부에서 일어남)
        userService.changePassword(userId, passwordDto.getCurrentPassword(), passwordDto.getNewPassword());

        Map<String, String> response = new HashMap<>();
        response.put("message", "비밀번호가 성공적으로 변경되었습니다.");

        return ResponseEntity.ok(response);
    }

    // 헤더의 JWT 토큰에서 userId를 안전하게 파싱하는 공통 메서드
    private Long extractUserIdFromHeader(String tokenHeader) {
        if (tokenHeader != null && tokenHeader.startsWith("Bearer ")) {
            String token = tokenHeader.substring(7); // "Bearer " 뒷부분 잘라내기
            return Long.parseLong(jwtTokenProvider.getUserId(token)); // JwtTokenProvider 활용
        }
        throw new IllegalArgumentException("유효하지 않은 인증 헤더 포맷입니다.");
    }

    @GetMapping("/me")
    public ResponseEntity<UserInfoResponseDto> getMyInfo(
            Authentication authentication) {

        Long userId = Long.valueOf(authentication.getName());

        User user = userService.findById(userId);

        return ResponseEntity.ok(new UserInfoResponseDto(user));
    }
}
