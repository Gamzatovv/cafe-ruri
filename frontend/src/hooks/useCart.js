import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'ruri-cart';

function readCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function useCart(products, syncWithCatalog = false) {
  const [cart, setCart] = useState(readCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Если товар удалили из каталога, удаляем его и из локальной корзины.
  useEffect(() => {
    if (!syncWithCatalog) return;

    const availableIds = new Set(products.map((product) => String(product.id)));
    setCart((current) => {
      const next = Object.fromEntries(
        Object.entries(current).filter(([id]) => availableIds.has(id)),
      );
      return Object.keys(next).length === Object.keys(current).length ? current : next;
    });
  }, [products, syncWithCatalog]);

  const items = useMemo(
    () => Object.entries(cart)
      .map(([id, quantity]) => ({
        product: products.find((product) => product.id === Number(id)),
        quantity,
      }))
      .filter((item) => item.product && item.quantity > 0),
    [cart, products],
  );

  const count = Object.values(cart).reduce((sum, value) => sum + Number(value), 0);
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const add = (product) => setCart((current) => ({
    ...current,
    [product.id]: Number(current[product.id] || 0) + 1,
  }));

  const change = (id, delta) => setCart((current) => {
    const next = { ...current, [id]: Number(current[id] || 0) + delta };
    if (next[id] <= 0) delete next[id];
    return next;
  });

  const remove = (id) => setCart((current) => {
    const next = { ...current };
    delete next[id];
    return next;
  });

  const clear = () => setCart({});

  return { cart, items, count, total, add, change, remove, clear };
}
