package com.jainmart.catalog.auth;

import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.UUID;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserAccountRepository users;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserAccountRepository users, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse signUp(SignUpRequest request) {
        if (passwordLengthInBytes(request.password()) > 72) {
            throw new InvalidPasswordException();
        }
        String email = normalizeEmail(request.email());
        if (users.existsByEmail(email)) {
            throw new AccountAlreadyExistsException();
        }

        UserAccount user = new UserAccount(
                UUID.randomUUID().toString(),
                request.name().trim(),
                email,
                passwordEncoder.encode(request.password()),
                "CUSTOMER"
        );
        try {
            return AuthResponse.from(users.save(user));
        } catch (DataIntegrityViolationException exception) {
            throw new AccountAlreadyExistsException();
        }
    }

    public AuthResponse signIn(SignInRequest request) {
        if (passwordLengthInBytes(request.password()) > 72) {
            throw new InvalidCredentialsException();
        }
        String email = normalizeEmail(request.email());
        UserAccount user = users.findByEmail(email)
                .filter(account -> passwordEncoder.matches(request.password(), account.getPasswordHash()))
                .orElseThrow(InvalidCredentialsException::new);
        return AuthResponse.from(user);
    }

    public AuthResponse getCurrentUser(String userId) {
        return users.findById(userId)
                .map(AuthResponse::from)
                .orElseThrow(AuthenticationRequiredException::new);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private int passwordLengthInBytes(String password) {
        return password.getBytes(StandardCharsets.UTF_8).length;
    }
}
