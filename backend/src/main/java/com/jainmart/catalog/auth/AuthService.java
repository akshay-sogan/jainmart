package com.jainmart.catalog.auth;

import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.UUID;

import com.jainmart.catalog.customer.CustomerProfile;
import com.jainmart.catalog.customer.CustomerProfileRepository;
import com.jainmart.catalog.shopkeeper.ShopkeeperProfile;
import com.jainmart.catalog.shopkeeper.ShopkeeperProfileRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserAccountRepository users;
    private final PasswordEncoder passwordEncoder;
    private final CustomerProfileRepository customers;
    private final ShopkeeperProfileRepository shopkeepers;

    public AuthService(
            UserAccountRepository users,
            PasswordEncoder passwordEncoder,
            CustomerProfileRepository customers,
            ShopkeeperProfileRepository shopkeepers
    ) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.customers = customers;
        this.shopkeepers = shopkeepers;
    }

    @Transactional
    public AuthResponse signUp(SignUpRequest request) {
        if (passwordLengthInBytes(request.password()) > 72) {
            throw new InvalidPasswordException();
        }
        String role = request.role() == null ? "CUSTOMER" : request.role();
        String email = normalizeEmail(request.email());
        if (users.existsByEmail(email)) {
            throw new AccountAlreadyExistsException();
        }

        UserAccount user = new UserAccount(
                UUID.randomUUID().toString(),
                request.name().trim(),
                email,
                passwordEncoder.encode(request.password()),
                role,
                !"SHOPKEEPER".equals(role)
        );
        UserAccount savedUser;
        try {
            savedUser = users.saveAndFlush(user);
        } catch (DataIntegrityViolationException exception) {
            throw new AccountAlreadyExistsException();
        }

        String mobileNumber = request.mobileNumber().trim();
        if ("SHOPKEEPER".equals(role)) {
            shopkeepers.save(new ShopkeeperProfile(
                    savedUser.getId(),
                    savedUser.getName(),
                    savedUser.getEmail(),
                    mobileNumber,
                    false
            ));
        } else {
            customers.save(new CustomerProfile(
                    savedUser.getId(),
                    savedUser.getName(),
                    savedUser.getEmail(),
                    mobileNumber,
                    true
            ));
        }
        return AuthResponse.from(savedUser);
    }

    public AuthResponse signIn(SignInRequest request) {
        if (passwordLengthInBytes(request.password()) > 72) {
            throw new InvalidCredentialsException();
        }
        String email = normalizeEmail(request.email());
        UserAccount user = users.findByEmail(email)
                .filter(account -> passwordEncoder.matches(request.password(), account.getPasswordHash()))
                .orElseThrow(InvalidCredentialsException::new);
        if (!user.isEnabled()) {
            throw new AccountNotApprovedException();
        }
        boolean profileEnabled = switch (user.getRole()) {
            case "CUSTOMER" -> customers.findById(user.getId())
                    .map(CustomerProfile::isEnabled)
                    .orElse(false);
            case "SHOPKEEPER" -> shopkeepers.findById(user.getId())
                    .map(ShopkeeperProfile::isEnabled)
                    .orElse(false);
            default -> true;
        };
        if (!profileEnabled) {
            throw new AccountNotApprovedException();
        }
        return AuthResponse.from(user);
    }

    public AuthResponse getCurrentUser(String userId) {
        return users.findById(userId)
                .filter(UserAccount::isEnabled)
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
