package com.jainmart.catalog.admin;

import jakarta.validation.constraints.NotNull;

public record ShopkeeperStatusRequest(@NotNull Boolean enabled) {
}
