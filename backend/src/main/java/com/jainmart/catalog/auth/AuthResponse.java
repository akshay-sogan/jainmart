package com.jainmart.catalog.auth;

public record AuthResponse(String id, String name, String email, String role) {
    public static AuthResponse from(UserAccount user) {
        return new AuthResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
