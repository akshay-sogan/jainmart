package com.jainmart.catalog.product;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProductRepository extends JpaRepository<Product, String> {
    List<Product> findAllByOrderByNameAsc();

    List<Product> findAllBySellerIdOrderByNameAsc(String sellerId);

    @Query("select p from Product p where p.sellerId is null or exists "
            + "(select u.id from UserAccount u where u.id = p.sellerId "
            + "and u.role = 'SHOPKEEPER' and u.enabled = true) order by p.name asc")
    List<Product> findAllVisibleToCustomers();

    @Query("select p from Product p where p.id = :id and (p.sellerId is null or exists "
            + "(select u.id from UserAccount u where u.id = p.sellerId "
            + "and u.role = 'SHOPKEEPER' and u.enabled = true))")
    Optional<Product> findVisibleById(String id);
}
