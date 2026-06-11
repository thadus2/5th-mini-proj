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

    @PostMapping("/sign-up")
    public ResponseEntity<User> signup(@RequestBody User user) {
        User savedUser = userService.signup(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    @PostMapping("/sign-in")
    public ResponseEntity<Map<String, Object>> signIn(@RequestBody Map<String, String> request) {

        String accessToken = userService.signin(request.get("loginId"), request.get("password"));

        Map<String, Object> response = new HashMap<>();
        response.put("grantType", "Bearer");
        response.put("accessToken", accessToken); 

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
