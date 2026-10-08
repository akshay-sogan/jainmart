ALTER TABLE users
    ADD COLUMN enabled BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE products
    ADD COLUMN seller_id VARCHAR(36) NULL,
    ADD CONSTRAINT fk_products_seller
        FOREIGN KEY (seller_id) REFERENCES users (id)
        ON DELETE SET NULL;
