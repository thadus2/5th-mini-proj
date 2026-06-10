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

        // 서비스 호출
        User loginUser = userService.signin(request.get("loginId"), request.get("password"));

        // 명세서 규격에 맞게 반환할 JSON 데이터를 Map으로 생성
        Map<String, Object> response = new HashMap<>();
        response.put("userId", loginUser.getUserId());
        response.put("nickname", loginUser.getNickName());

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
