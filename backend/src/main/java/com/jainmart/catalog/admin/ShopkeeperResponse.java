package com.jainmart.catalog.admin;

import com.jainmart.catalog.shopkeeper.ShopkeeperProfile;

public record ShopkeeperResponse(String id, String name, String email, String mobileNumber, boolean enabled) {
    public static ShopkeeperResponse from(ShopkeeperProfile shopkeeper) {
        return new ShopkeeperResponse(
                shopkeeper.getId(),
                shopkeeper.getName(),
                shopkeeper.getEmail(),
                shopkeeper.getMobileNumber(),
                shopkeeper.isEnabled()
        );
    }
}
