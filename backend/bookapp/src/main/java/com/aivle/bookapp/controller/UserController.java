package com.aivle.bookapp.controller;

import com.aivle.bookapp.config.jwt.JwtTokenProvider;
import com.aivle.bookapp.domain.User;
import com.aivle.bookapp.dto.request.PasswordChangeRequestDto;
import com.aivle.bookapp.dto.request.UserInfoResponseDto;
import com.aivle.bookapp.dto.request.UserUpdateRequestDto;
import com.aivle.bookapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    // 3. 내 정보 조회
    @GetMapping("/me")
    public ResponseEntity<UserInfoResponseDto> getMyInfo(
            @RequestHeader("Authorization") String tokenHeader
    ) {
        Long userId = extractUserIdFromHeader(tokenHeader);

        User user = userService.findById(userId);

        return ResponseEntity.ok(new UserInfoResponseDto(user));
    }

    // 4. 회원 정보 수정
    @PutMapping("/user")
    public ResponseEntity<UserInfoResponseDto> updateUser(
            @RequestHeader("Authorization") String tokenHeader,
            @RequestBody UserUpdateRequestDto request
    ) {
        Long userId = extractUserIdFromHeader(tokenHeader);

        User updatedUser = userService.updateUser(userId, request);

        return ResponseEntity.ok(new UserInfoResponseDto(updatedUser));
    }

    // 5. 비밀번호 변경
    @PatchMapping("/user/password")
    public ResponseEntity<Map<String, String>> changePassword(
            @RequestHeader("Authorization") String tokenHeader,
            @RequestBody PasswordChangeRequestDto passwordDto
    ) {
        Long userId = extractUserIdFromHeader(tokenHeader);

        userService.changePassword(
                userId,
                passwordDto.getCurrentPassword(),
                passwordDto.getNewPassword()
        );

        Map<String, String> response = new HashMap<>();
        response.put("message", "비밀번호가 성공적으로 변경되었습니다.");

        return ResponseEntity.ok(response);
    }

    // Authorization 헤더의 JWT 토큰에서 userId 추출
    private Long extractUserIdFromHeader(String tokenHeader) {
        if (tokenHeader != null && tokenHeader.startsWith("Bearer ")) {
            String token = tokenHeader.substring(7);
            return Long.parseLong(jwtTokenProvider.getUserId(token));
        }

        throw new IllegalArgumentException("유효하지 않은 인증 헤더 포맷입니다.");
    }
}