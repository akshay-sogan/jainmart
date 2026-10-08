package com.jainmart.catalog.admin;

import java.util.List;

import com.jainmart.catalog.auth.SessionAccountService;
import com.jainmart.catalog.auth.UserAccount;
import com.jainmart.catalog.auth.UserAccountRepository;
import com.jainmart.catalog.shopkeeper.ShopkeeperProfile;
import com.jainmart.catalog.shopkeeper.ShopkeeperProfileRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/admin/shopkeepers")
public class ShopkeeperController {
    private final UserAccountRepository users;
    private final ShopkeeperProfileRepository shopkeepers;
    private final SessionAccountService accounts;

    public ShopkeeperController(
            UserAccountRepository users,
            ShopkeeperProfileRepository shopkeepers,
            SessionAccountService accounts
    ) {
        this.users = users;
        this.shopkeepers = shopkeepers;
        this.accounts = accounts;
    }

    @GetMapping
    public List<ShopkeeperResponse> getShopkeepers(HttpServletRequest request) {
        accounts.requireAdmin(request);
        return shopkeepers.findAllByOrderByNameAsc().stream()
                .map(ShopkeeperResponse::from)
                .toList();
    }

    @PutMapping("/{id}/status")
    @Transactional
    public ShopkeeperResponse setStatus(
            @PathVariable String id,
            @Valid @RequestBody ShopkeeperStatusRequest status,
            HttpServletRequest request
    ) {
        accounts.requireAdmin(request);
        UserAccount account = users.findById(id)
                .filter(user -> "SHOPKEEPER".equals(user.getRole()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shopkeeper not found."));
        ShopkeeperProfile shopkeeper = shopkeepers.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shopkeeper not found."));
        account.setEnabled(status.enabled());
        shopkeeper.setEnabled(status.enabled());
        users.save(account);
        return ShopkeeperResponse.from(shopkeepers.save(shopkeeper));
    }
}
