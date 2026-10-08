package com.jainmart.catalog.shopkeeper;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "shopkeepers")
public class ShopkeeperProfile {
    @Id
    @Column(name = "user_id", length = 36, nullable = false)
    private String id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 254)
    private String email;

    @Column(name = "mobile_number", length = 20)
    private String mobileNumber;

    @Column(nullable = false)
    private boolean enabled;

    protected ShopkeeperProfile() {
    }

    public ShopkeeperProfile(String id, String name, String email, String mobileNumber, boolean enabled) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.mobileNumber = mobileNumber;
        this.enabled = enabled;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}
