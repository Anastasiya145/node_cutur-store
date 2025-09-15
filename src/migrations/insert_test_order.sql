INSERT INTO orders (user_email, date, status, total, items)
VALUES (
  'asiva@ukr.net',
  '2025-09-10',
  'Livré',
  59.99,
  '[{"name": "Bavoir en coton bio", "quantity": 2, "price": 14.99, "image": "/img/products/00043.jpg"}, {"name": "Doudou lapin gris", "quantity": 1, "price": 29.99, "image": "/img/products/0037.jpg"}]'::jsonb
);
