const CART_KEY = "restaurant_cart";

function toPositiveNumber(value) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

export function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function writeCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function getCartItemQuantity(cartItems, productId) {
  return cartItems.find((item) => item.productId === productId)?.quantity || 0;
}

export function syncCartWithInventory(cartItems, products = []) {
  const productMap = new Map(products.map((product) => [product._id, product]));

  const synced = cartItems
    .map((item) => {
      const product = productMap.get(item.productId);

      if (!product || !product.available || toPositiveNumber(product.stock) <= 0) {
        return null;
      }

      const stock = toPositiveNumber(product.stock);
      const quantity = Math.min(Math.max(1, toPositiveNumber(item.quantity)), stock);

      return {
        productId: product._id,
        name: product.name,
        price: product.price,
        stock,
        available: Boolean(product.available),
        quantity,
      };
    })
    .filter(Boolean);

  writeCart(synced);
  return synced;
}

export function addToCart(product, quantity = 1) {
  const existing = readCart();
  const index = existing.findIndex((item) => item.productId === product._id);
  const stock = toPositiveNumber(product.stock);

  if (!product.available || stock <= 0) {
    return existing;
  }

  const nextQuantity = Math.min(
    stock,
    (index >= 0 ? toPositiveNumber(existing[index].quantity) : 0) + Math.max(1, toPositiveNumber(quantity))
  );

  if (index >= 0) {
    existing[index] = {
      ...existing[index],
      name: product.name,
      price: product.price,
      stock,
      available: Boolean(product.available),
      quantity: nextQuantity,
    };
  } else {
    existing.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      stock,
      available: Boolean(product.available),
      quantity: nextQuantity,
    });
  }

  writeCart(existing);
  return existing;
}

export function updateCartItem(productId, quantity) {
  const existing = readCart();
  const updated = existing
    .map((item) => {
      if (item.productId !== productId) {
        return item;
      }

      const stock = toPositiveNumber(item.stock);
      const normalizedQuantity = Math.max(1, toPositiveNumber(quantity));

      return {
        ...item,
        quantity: stock > 0 ? Math.min(normalizedQuantity, stock) : normalizedQuantity,
      };
    })
    .filter((item) => item.quantity > 0);

  writeCart(updated);
  return updated;
}

export function removeCartItem(productId) {
  const existing = readCart();
  const updated = existing.filter((item) => item.productId !== productId);
  writeCart(updated);
  return updated;
}

export function clearCart() {
  writeCart([]);
}

export function getCartTotals(items = readCart()) {
  const itemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = items.reduce((acc, item) => acc + item.quantity * item.price, 0);

  return {
    itemsCount,
    totalAmount,
  };
}
