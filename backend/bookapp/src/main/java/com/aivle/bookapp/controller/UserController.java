package com.aivle.bookapp.controller;

import com.aivle.bookapp.domain.User;
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

    /**
     * 회원가입 API
     * POST /api/v1/auth/signup
     */
    @PostMapping("/sign-up")
    public ResponseEntity<User> signup(@RequestBody User user) {
        User savedUser = userService.signup(user);
        // 생성 성공 시 201 Created 상태코드와 함께 저장된 유저 정보 반환
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    /**
     * 로그인 API
     */
    @PostMapping("/sign-in")
    public ResponseEntity<Map<String, Object>> signIn(@RequestBody Map<String, String> request) {

        String accessToken = userService.signin(request.get("loginId"), request.get("password"));

        // 2. 표준 명세 규격에 맞게 프론트엔드에 전달할 JSON 데이터 구성
        Map<String, Object> response = new HashMap<>();
        response.put("grantType", "Bearer"); // 토큰 타입 명시
        response.put("accessToken", accessToken); // 발급된 JWT 토큰

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
