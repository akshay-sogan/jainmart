CREATE TABLE products (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    category VARCHAR(80) NOT NULL,
    description VARCHAR(500) NOT NULL,
    price INT NOT NULL,
    unit VARCHAR(40) NOT NULL
);

INSERT INTO products (id, name, category, description, price, unit) VALUES
    ('farm-bananas', 'Farm bananas', 'Fresh produce', 'Naturally sweet, hand-picked and ready for breakfast.', 48, '1 kg'),
    ('tomatoes', 'Red tomatoes', 'Fresh produce', 'Juicy everyday tomatoes from nearby farms.', 42, '500 g'),
    ('full-cream-milk', 'Full cream milk', 'Dairy & eggs', 'Fresh dairy goodness delivered cold to your door.', 34, '500 ml'),
    ('farm-eggs', 'Farm fresh eggs', 'Dairy & eggs', 'Protein-rich brown eggs for your everyday meals.', 78, '6 pack'),
    ('basmati-rice', 'Classic basmati rice', 'Pantry', 'Long-grain rice with a fragrant, fluffy finish.', 120, '1 kg'),
    ('toor-dal', 'Toor dal', 'Pantry', 'Everyday split pigeon peas for comforting dal.', 145, '1 kg'),
    ('masala-chips', 'Masala chips', 'Snacks', 'Crisp, spiced potato bites for little breaks.', 35, '100 g'),
    ('jaggery', 'Organic jaggery', 'Pantry', 'Rich, unrefined sweetness for desserts and chai.', 110, '500 g');
