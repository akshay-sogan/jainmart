package com.jainmart.catalog.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

@Service
public class SessionAccountService {
    private final UserAccountRepository users;

    public SessionAccountService(UserAccountRepository users) {
        this.users = users;
    }

    public UserAccount requireAccount(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || !(session.getAttribute("userId") instanceof String userId)) {
            throw new AuthenticationRequiredException();
        }
        return users.findById(userId)
                .filter(UserAccount::isEnabled)
                .orElseThrow(AuthenticationRequiredException::new);
    }

    public UserAccount requireAdmin(HttpServletRequest request) {
        UserAccount user = requireAccount(request);
        if (!"ADMIN".equals(user.getRole())) {
            throw new ManagerAccessRequiredException();
        }
        return user;
    }

    public UserAccount requireProductManager(HttpServletRequest request) {
        UserAccount user = requireAccount(request);
        if (!"ADMIN".equals(user.getRole()) && !"SHOPKEEPER".equals(user.getRole())) {
            throw new ManagerAccessRequiredException();
        }
        return user;
    }
}
