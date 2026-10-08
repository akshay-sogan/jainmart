CREATE TABLE customers (
    user_id VARCHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(254) NOT NULL,
    mobile_number VARCHAR(20) NULL,
    enabled BOOLEAN NOT NULL,
    CONSTRAINT fk_customers_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE
);

CREATE TABLE shopkeepers (
    user_id VARCHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(254) NOT NULL,
    mobile_number VARCHAR(20) NULL,
    enabled BOOLEAN NOT NULL,
    CONSTRAINT fk_shopkeepers_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE
);

INSERT INTO customers (user_id, name, email, enabled)
SELECT id, name, email, enabled FROM users WHERE role = 'CUSTOMER';

INSERT INTO shopkeepers (user_id, name, email, enabled)
SELECT id, name, email, enabled FROM users WHERE role = 'SHOPKEEPER';
