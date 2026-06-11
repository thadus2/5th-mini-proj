package com.aivle.bookapp.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.ServletRequestBindingException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    //해당하는 id의 팩이 없을 때 id와 함께 404번 NOT FOUND 출력
    @ExceptionHandler(BookNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleBookNotFound(BookNotFoundException e) {
        Map<String, String> body = Map.of(
                "error", "Book not found",
                "message", e.getMessage()
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    //입력값 검증 (놓친 필수 필드 있다면 출력하고 400번 Bad Request)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException e) {

        Map<String, String> errors = new LinkedHashMap<>();

        e.getBindingResult().getFieldErrors().forEach(error -> {
            errors.put(error.getField(), error.getDefaultMessage());
        });

        Map<String, Object> body = Map.of(
                "error", "Validation failed",
                "message", "입력값 검증에 실패했습니다.",
                "errors", errors
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    //body가 비었거나 형식에 맞지 않을 때 출력
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> handleInvalidJson(HttpMessageNotReadableException e) {
        Map<String, String> body = Map.of(
                "error", "Invalid request body",
                "message", "요청된 Http 본문 형식이 올바르지 않습니다."
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    //DB 제약조건 위반(데이터 무결성 제약조건을 위반)
    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrity(org.springframework.dao.DataIntegrityViolationException e) {
        Map<String, String> body = Map.of(
                "error", "Bad Request",
                "message", "필수 입력 값(viewCount/likeCount 등)이 누락되어 데이터 무결성 제약조건을 위반했습니다." );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    //0611수정
    //argument type 맞지 않을 때
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, String>> handleTypeMismatch(MethodArgumentTypeMismatchException e) {
        Map<String, String> body = Map.of(
                "error", "Bad Request",
                "message", "요청 파라미터 타입이 올바르지 않습니다. id는 숫자여야 합니다."
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    //0611수정
    //isLiked 누락
    @ExceptionHandler(ServletRequestBindingException.class)
    public ResponseEntity<Map<String, String>> handleServletRequestBinding(ServletRequestBindingException e) {
        Map<String, String> body = Map.of(
                "error", "Bad Request",
                "message", "요청 파라미터가 누락되었거나 올바르지 않습니다."
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    //서버 오류
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(Exception e) {
        Map<String, String> body = Map.of(
                "error", "Internal server error",
                "message", "서버 내부 오류가 발생했습니다."
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}