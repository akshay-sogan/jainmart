package com.jainmart.catalog.auth;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class AuthExceptionHandler {
    @ExceptionHandler(AccountAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, String> handleAccountAlreadyExists() {
        return Map.of("message", "An account with this email already exists.");
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Map<String, String> handleInvalidCredentials() {
        return Map.of("message", "Email or password is incorrect.");
    }

    @ExceptionHandler(InvalidPasswordException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleInvalidPassword() {
        return Map.of("message", "Password must be no more than 72 UTF-8 bytes.");
    }

    @ExceptionHandler(AuthenticationRequiredException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Map<String, String> handleAuthenticationRequired() {
        return Map.of("message", "Sign in is required to perform this action.");
    }

    @ExceptionHandler(ManagerAccessRequiredException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public Map<String, String> handleManagerAccessRequired() {
        return Map.of("message", "Manager access is required to perform this action.");
    }

    @ExceptionHandler(AccountNotApprovedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public Map<String, String> handleAccountNotApproved() {
        return Map.of("message", "This account is disabled or awaiting admin activation. Please contact the administrator.");
    }
}
