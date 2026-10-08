package com.jainmart.catalog.product;

import java.util.List;
import java.util.UUID;

import com.jainmart.catalog.auth.SessionAccountService;
import com.jainmart.catalog.auth.UserAccount;
import com.jainmart.catalog.shopkeeper.ShopkeeperProfileRepository;
import jakarta.servlet.http.HttpServletRequest;
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
    private final SessionAccountService accounts;
    private final ShopkeeperProfileRepository shopkeepers;

    public ProductController(
            ProductRepository products,
            SessionAccountService accounts,
            ShopkeeperProfileRepository shopkeepers
    ) {
        this.products = products;
        this.accounts = accounts;
        this.shopkeepers = shopkeepers;
    }

    @GetMapping
    public List<Product> getProducts() {
        return products.findAllVisibleToCustomers();
    }

    @GetMapping("/manage")
    public List<Product> getManagedProducts(HttpServletRequest httpRequest) {
        UserAccount user = accounts.requireProductManager(httpRequest);
        if (!"ADMIN".equals(user.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Use the shopkeeper-specific product endpoint.");
        }
        return products.findAllByOrderByNameAsc();
    }

    @GetMapping("/manage/{shopkeeperId}")
    public List<Product> getShopkeeperProducts(
            @PathVariable String shopkeeperId,
            HttpServletRequest httpRequest
    ) {
        UserAccount user = accounts.requireProductManager(httpRequest);
        if (!"SHOPKEEPER".equals(user.getRole()) || !user.getId().equals(shopkeeperId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only access your own store products.");
        }
        return products.findAllBySellerIdOrderByNameAsc(shopkeeperId);
    }

    @GetMapping("/shopkeeper/{shopkeeperId}")
    public List<Product> getProductsForShopkeeper(
            @PathVariable String shopkeeperId,
            HttpServletRequest httpRequest
    ) {
        accounts.requireAdmin(httpRequest);
        if (!shopkeepers.existsById(shopkeeperId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Shopkeeper not found.");
        }
        return products.findAllBySellerIdOrderByNameAsc(shopkeeperId);
    }

    @GetMapping("/{id}")
    public Product getProduct(@PathVariable String id) {
        return products.findVisibleById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found."));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product createProduct(@Valid @RequestBody ProductRequest request, HttpServletRequest httpRequest) {
        UserAccount user = accounts.requireProductManager(httpRequest);

        Product product = new Product(
                UUID.randomUUID().toString(),
                request.name().trim(),
                request.category().trim(),
                request.description().trim(),
                request.price(),
                request.unit().trim(),
                "SHOPKEEPER".equals(user.getRole()) ? user.getId() : null
        );
        return products.save(product);
    }

    @PutMapping("/{id}")
    public Product updateProduct(
            @PathVariable String id,
            @Valid @RequestBody ProductRequest request,
            HttpServletRequest httpRequest
    ) {
        UserAccount user = accounts.requireProductManager(httpRequest);
        Product existingProduct = products.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found."));
        if ("SHOPKEEPER".equals(user.getRole()) && !user.getId().equals(existingProduct.getSellerId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found.");
        }

        Product product = new Product(
                id,
                request.name().trim(),
                request.category().trim(),
                request.description().trim(),
                request.price(),
                request.unit().trim(),
                existingProduct.getSellerId()
        );
        return products.save(product);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable String id, HttpServletRequest httpRequest) {
        UserAccount user = accounts.requireProductManager(httpRequest);
        Product existingProduct = products.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found."));
        if ("SHOPKEEPER".equals(user.getRole()) && !user.getId().equals(existingProduct.getSellerId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found.");
        }
        products.deleteById(id);
    }
}
