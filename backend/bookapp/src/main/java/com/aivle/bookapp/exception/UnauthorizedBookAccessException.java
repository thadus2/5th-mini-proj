package com.aivle.bookapp.exception;

public class UnauthorizedBookAccessException extends RuntimeException {

    public UnauthorizedBookAccessException(String message) {
        super(message);
    }
}