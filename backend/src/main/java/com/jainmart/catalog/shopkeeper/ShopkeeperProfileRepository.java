package com.jainmart.catalog.shopkeeper;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ShopkeeperProfileRepository extends JpaRepository<ShopkeeperProfile, String> {
    List<ShopkeeperProfile> findAllByOrderByNameAsc();
}
