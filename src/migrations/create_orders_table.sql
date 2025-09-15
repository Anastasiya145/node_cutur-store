-- Создание таблицы заказов (orders)
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    total NUMERIC(10,2) NOT NULL,
    items JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Индекс для быстрого поиска по email
CREATE INDEX IF NOT EXISTS idx_orders_user_email ON orders(user_email);

-- Индекс для быстрого поиска по дате
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(date);
