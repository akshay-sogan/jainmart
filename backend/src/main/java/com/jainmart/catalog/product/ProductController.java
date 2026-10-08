package com.jainmart.catalog.product;

import java.util.List;
import java.util.UUID;

import com.jainmart.catalog.auth.AuthenticationRequiredException;
import com.jainmart.catalog.auth.ManagerAccessRequiredException;
import com.jainmart.catalog.auth.UserAccount;
import com.jainmart.catalog.auth.UserAccountRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductRepository products;
    private final UserAccountRepository users;

    public ProductController(ProductRepository products, UserAccountRepository users) {
        this.products = products;
        this.users = users;
    }

    @GetMapping
    public List<Product> getProducts() {
        return products.findAllByOrderByNameAsc();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product createProduct(@Valid @RequestBody ProductRequest request, HttpServletRequest httpRequest) {
        requireAdmin(httpRequest);

        Product product = new Product(
                UUID.randomUUID().toString(),
                request.name().trim(),
                request.category().trim(),
                request.description().trim(),
                request.price(),
                request.unit().trim()
        );
        return products.save(product);
    }

    @PutMapping("/{id}")
    public Product updateProduct(
            @PathVariable String id,
            @Valid @RequestBody ProductRequest request,
            HttpServletRequest httpRequest
    ) {
        requireAdmin(httpRequest);
        if (!products.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found.");
        }

        Product product = new Product(
                id,
                request.name().trim(),
                request.category().trim(),
                request.description().trim(),
                request.price(),
                request.unit().trim()
        );
        return products.save(product);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable String id, HttpServletRequest httpRequest) {
        requireAdmin(httpRequest);
        if (!products.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found.");
        }
        products.deleteById(id);
    }

    private void requireAdmin(HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session == null) {
            throw new AuthenticationRequiredException();
        }
        Object userId = session.getAttribute("userId");
        if (!(userId instanceof String)) {
            throw new AuthenticationRequiredException();
        }
        UserAccount user = users.findById((String) userId).orElseThrow(AuthenticationRequiredException::new);
        if (!"ADMIN".equals(user.getRole())) {
            throw new ManagerAccessRequiredException();
        }
    }
}
