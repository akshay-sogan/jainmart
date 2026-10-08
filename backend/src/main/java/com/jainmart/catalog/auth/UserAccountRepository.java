package com.jainmart.catalog.auth;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAccountRepository extends JpaRepository<UserAccount, String> {
    boolean existsByEmail(String email);

    Optional<UserAccount> findByEmail(String email);

    List<UserAccount> findAllByRoleOrderByNameAsc(String role);
}
