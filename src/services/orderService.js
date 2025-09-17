const sequelize = require("../utils/db");

// Получить все заказы (только для админки, без деталей товаров)
// async function getAllOrders() {
//   const [orders] = await sequelize.query(
//     "SELECT * FROM orders ORDER BY created_at DESC"
//   );
//   return orders;
// }

// Получить заказы пользователя с деталями товаров
async function getOrdersByUserEmail(userEmail) {
  const [orders] = await sequelize.query(
    "SELECT * FROM orders WHERE user_email = $1 ORDER BY created_at DESC",
    { bind: [userEmail] }
  );
  // Для каждого заказа подгружаем строки заказа с деталями товаров
  for (const order of orders) {
    const [items] = await sequelize.query(
      "SELECT * FROM order_items WHERE order_id = $1 ORDER BY id",
      { bind: [order.id] }
    );
    order.items = items;
  }
  return orders;
}

// Получить заказ по id с деталями товаров
async function getOrderById(id) {
  const [orders] = await sequelize.query("SELECT * FROM orders WHERE id = $1", {
    bind: [id],
  });
  if (!orders.length) return null;
  const order = orders[0];
  const [items] = await sequelize.query(
    "SELECT * FROM order_items WHERE order_id = $1 ORDER BY id",
    { bind: [id] }
  );
  order.items = items;
  return order;
}

// Надёжное создание заказа (см. предыдущие версии)
async function createOrder({ user_email, items }) {
  if (!user_email) throw new Error("user_email required");
  if (!Array.isArray(items) || items.length === 0)
    throw new Error("items required");

  const status = "created";

  const t = await sequelize.transaction();
  try {
    // Валидация входных данных
    for (const it of items) {
      if (!it || typeof it.id !== "number" || !Number.isInteger(it.id))
        throw new Error("each item must have numeric id");
      if (
        typeof it.quantity !== "number" ||
        !Number.isInteger(it.quantity) ||
        it.quantity <= 0
      )
        throw new Error("each item must have positive integer quantity");
    }

    const ids = items.map((it) => it.id);

    // Получаем продукты с блокировкой строк
    const [products] = await sequelize.query(
      `SELECT id, name, price, itemsleft, images FROM products WHERE id = ANY($1::int[]) FOR UPDATE`,
      { bind: [ids], transaction: t }
    );
    const prodMap = new Map(products.map((p) => [p.id, p]));

    // Проверка наличия и расчёт total
    let totalCents = 0;
    for (const it of items) {
      const p = prodMap.get(it.id);
      if (!p) throw new Error(`Product ${it.id} not found`);
      const priceNum = Number(p.price);
      if (Number.isNaN(priceNum))
        throw new Error(`Invalid price for product ${it.id}`);
      if (p.itemsleft != null && Number(p.itemsleft) < it.quantity)
        throw new Error(`Insufficient stock for product ${it.id}`);
      totalCents += Math.round(priceNum * 100) * it.quantity;
    }
    const total = (totalCents / 100).toFixed(2);
    const itemsJson = JSON.stringify(items);

    // Вставляем заказ (дата будет выставлена автоматически в orders.created_at)
    const [orderRows] = await sequelize.query(
      `INSERT INTO orders (user_email, status, total, items)
       VALUES ($1, $2, $3, $4::jsonb)
       RETURNING *`,
      { bind: [user_email, status, total, itemsJson], transaction: t }
    );
    const order = orderRows[0];

    // Вставляем строки заказа и уменьшаем остатки
    for (const it of items) {
      const p = prodMap.get(it.id);
      const image =
        Array.isArray(p.images) && p.images.length ? p.images[0] : null;

      await sequelize.query(
        `INSERT INTO order_items (order_id, product_id, name, price, quantity, image)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        {
          bind: [order.id, p.id, p.name, p.price, it.quantity, image],
          transaction: t,
        }
      );

      if (p.itemsleft != null) {
        await sequelize.query(
          `UPDATE products SET itemsleft = itemsleft - $1 WHERE id = $2`,
          { bind: [it.quantity, p.id], transaction: t }
        );
      }
    }

    await t.commit();
    return order;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

// Удаление заказа (только если прошло не более 24 часов)
async function deleteOrder(orderId, userEmail) {
  // Получаем заказ
  const [orders] = await sequelize.query(
    "SELECT * FROM orders WHERE id = $1 AND user_email = $2",
    { bind: [orderId, userEmail] }
  );
  if (!orders.length) throw new Error("Order not found");
  const order = orders[0];

  // Проверяем, что прошло не более 24 часов с момента создания
  const createdAt = new Date(order.created_at);
  const now = new Date();
  const diffHours = (now - createdAt) / (1000 * 60 * 60);
  if (diffHours > 24)
    throw new Error("Order can only be cancelled within 24 hours");

  const t = await sequelize.transaction();
  try {
    // Получаем строки заказа
    const [items] = await sequelize.query(
      "SELECT * FROM order_items WHERE order_id = $1",
      { bind: [orderId], transaction: t }
    );

    // Возвращаем товары на склад
    for (const item of items) {
      await sequelize.query(
        `UPDATE products SET itemsleft = itemsleft + $1 WHERE id = $2`,
        { bind: [item.quantity, item.product_id], transaction: t }
      );
    }

    // Обновляем статус заказа и updated_at
    await sequelize.query(
      `UPDATE orders SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      { bind: [orderId], transaction: t }
    );

    await t.commit();
    return { success: true };
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

module.exports = {
  // getAllOrders,
  getOrdersByUserEmail,
  getOrderById,
  createOrder,
  deleteOrder, // добавлен экспорт
};
